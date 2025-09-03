const API_URL = import.meta.env.VITE_BASE_URL;

const getAccessToken = () => localStorage.getItem("chieta_user_token");
const getRefreshToken = () => localStorage.getItem("chieta_user_refresh");

const getDefaultHeaders = () => {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token found");

  const res = await fetch(`${API_URL}acc/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    throw new Error("Unable to refresh token");
  }

  const data = await res.json();
  localStorage.setItem("chieta_user_token", data.data.access);
  return data.data.access;
};

// MAIN API
const fetchAPI = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  isFormData = false,
  retry: boolean = true,
): Promise<any> => {
  const headers = isFormData
    ? {
        ...(getAccessToken()
          ? { Authorization: `Bearer ${getAccessToken()}` }
          : {}),
      }
    : getDefaultHeaders();

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      credentials: "include",
      ...(body && (isFormData ? { body } : { body: JSON.stringify(body) })),
    });

    if (res.status === 401 && retry) {
      try {
        await refreshToken();
        return fetchAPI(endpoint, method, body, isFormData, false); // retry once
      } catch (refreshErr) {
        localStorage.removeItem("chieta_user_token");
        localStorage.removeItem("chieta_user_refresh");
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (!res.ok) {
      const error = await res.text();
      //   toast.error(`Error ${res.status}: ${error}`);
      throw new Error(`Error ${res.status}: ${error}`);
    }

    return res.status !== 204 ? await res.json() : null;
  } catch (err: any) {
    // toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

// LOGIN
export const login = async (data: { email: string; password: string }) => {
  const res = await fetchAPI("acc/auth/login/", "POST", data);

  if (res.status === 200) {
    localStorage.setItem("chieta_user_token", res.data.access);
    return res;
    // localStorage.setItem("chieta_user_refresh", res.data.refresh);
  } else {
    throw new Error("Login failed: invalid response");
  }

  return res;
};

export const logout = () => {
  localStorage.removeItem("chieta_user_token");
  localStorage.removeItem("chieta_user_refresh");
};

// profiles
export const getProfile = () => fetchAPI("acc/me");

// desks
export const getDesks = () => fetchAPI("management/desks/");


// BOOKINGS

export const createBooking = (data: {
  deskId: string;
  date: string;
  time: string;
  type: "desk" | "office";
}) => fetchAPI("bookings/", "POST", data);

// Get all bookings for the logged in user
export const getMyBookings = () => fetchAPI("bookings/");

// Confirm a booking by ID
export const confirmBooking = (bookingId: number) =>
  fetchAPI(`bookings/${bookingId}/confirm/`, "POST");
