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

// user accounts
export const getProfile = () => fetchAPI("acc/me/");

export const getUsers = () => fetchAPI("management/users/");

export const activateUser = (id: number | string) =>
  fetchAPI(`management/users/${id}/activate/`, "POST");

export const suspendUser = (id: number | string) =>
  fetchAPI(`management/users/${id}/deactivate/`, "POST");

export const updateUser = (id: number | string, data: any) =>
  fetchAPI(`management/users/${id}/`, "PATCH", data);

// desks
export const getDesks = () => fetchAPI("management/desks/");

export const updateDeskStatus = (id: number | string, data: any) =>
  fetchAPI(`management/desks/${id}/set-status/`, "PATCH", data);

// bookings
export const bookingData = () =>
  fetchAPI("bookings/bookings/booking/data/csv/");

export const bookDesks = (data: any) =>
  fetchAPI("bookings/bookings/user/book/", "POST", data);

export const userBookedDesks = () =>
  fetchAPI("bookings/bookings/user/history/");

export const getAllBookings = () => fetchAPI("bookings/bookings/");

// analytics
export const getBookingTrends = () =>
  fetchAPI("analytics/analytics/booking_trends/");

export const getDashboardStats = () =>
  fetchAPI("analytics/analytics/dashboard_stats/");

export const getDeskUtilization = () =>
  fetchAPI("analytics/analytics/desk_utilization/");

export const getWeeklyTrends = () =>
  fetchAPI("analytics/analytics/weekly_trends/");
