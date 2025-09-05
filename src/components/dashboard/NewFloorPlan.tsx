import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import floorplan from "@/assets/plan.png";
interface Desk {
  id: string;
  x: number;
  y: number;
  height: number;
  width: number;
  status: string;
  code: string;
  name: string;
  x_axis: number;
  y_axis: number;
  description: string;
  max_capacity: number;
  type: "regular" | "executive";
  isActive: boolean;
  isBooked: boolean;
  bookedBy?: string;
  section: string;
  floor: string;
}

import { CheckCircle, User, MapPin, Calendar, Clock, Wifi } from "lucide-react";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { BookingConfirmationModal } from "@/components/dashboard/BookingConfirmationModal";
import { BookingRescheduleModal } from "@/components/dashboard/BookingRescheduleModal";
import { BookingCancelModal } from "@/components/dashboard/BookingCancelModal";

import { useToast } from "@/hooks/use-toast";

import { ReactSVGPanZoom, TOOL_NONE } from "react-svg-pan-zoom";
import { getDesks, getProfile } from "@/services/apiClient";

interface FloorPlanProps {
  onDeskSelect: (deskId: string) => void;
  selectedDesk: string | null;
  currentBooking: { deskId: string; date: string } | null;
}

const FloorPlan = ({
  onDeskSelect,
  selectedDesk,
  currentBooking,
}: FloorPlanProps) => {
  const [hoveredDesk, setHoveredDesk] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<string>("open-floor");
  const [desks, setDesks] = useState([]);
  const floors = [
    { id: "open-floor", name: "Open Floor", icon: "🏢" },
    { id: "executive-suite", name: "Executive Suite", icon: "👔" },
  ];

  // Initialize desk layout
  // useEffect(() => {
  //   const generateDesks = (): Desk[] => {
  //     const deskLayout: Desk[] = [];

  //     let deskCounter = 1;

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 155,
  //         y: 292,
  //         type: "executive",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 300,
  //         y: 285,
  //         type: "executive",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 502,
  //         y: 304,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 502,
  //         y: 255,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 502,
  //         y: 200,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     // top plan
  //     // 1
  //     for (let i = 0; i < 3; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 547 + i * 26,
  //         y: 210,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }
  //     // 2
  //     for (let i = 0; i < 3; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 547 + i * 26,
  //         y: 243,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }
  //     // 3
  //     for (let i = 0; i < 3; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 547 + i * 26,
  //         y: 304,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }
  //     // 4
  //     for (let i = 0; i < 3; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 547 + i * 26,
  //         y: 274,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }
  //     // 1
  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 559 + i * 26,
  //         y: 336,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }
  //     // 2
  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 559 + i * 26,
  //         y: 366,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 3; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 547 + i * 26,
  //         y: 210,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     // top plan col 2
  //     //
  //     //
  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 639 + i * 26,
  //         y: 210,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 639 + i * 26,
  //         y: 243,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 639 + i * 26,
  //         y: 274,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 639 + i * 26,
  //         y: 304,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 639 + i * 26,
  //         y: 336,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 639 + i * 26,
  //         y: 366,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     // column 3
  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 698 + i * 26,
  //         y: 210,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 698 + i * 26,
  //         y: 243,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 698 + i * 26,
  //         y: 274,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 698 + i * 26,
  //         y: 304,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 698 + i * 26,
  //         y: 336,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 698 + i * 26,
  //         y: 366,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     // column 4
  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 781 + i * 26,
  //         y: 210,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 781 + i * 26,
  //         y: 243,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 781 + i * 26,
  //         y: 274,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 781 + i * 26,
  //         y: 304,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 781 + i * 26,
  //         y: 336,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 781 + i * 26,
  //         y: 600,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: false,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 2; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 781 + i * 26,
  //         y: 366,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     // single rooms

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 839,
  //         y: 466,
  //         type: "regular",
  //         isActive: false,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 200,
  //         y: 440,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 190,
  //         y: 485,
  //         type: "regular",
  //         isActive: false,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 125,
  //         y: 470,
  //         type: "regular",
  //         isActive: true,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 230,
  //         y: 370,
  //         type: "regular",
  //         isActive: false,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 165,
  //         y: 370,
  //         type: "regular",
  //         isActive: false,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }

  //     for (let i = 0; i < 1; i++) {
  //       deskLayout.push({
  //         id: `OF-R1-${deskCounter++}`,
  //         x: 85,
  //         y: 450,
  //         type: "regular",
  //         isActive: Math.random() > 0.7,
  //         isBooked: Math.random() > 0.7,
  //         section: "Open Floor - North",
  //         floor: "open-floor",
  //       });
  //     }
  //     return deskLayout;
  //   };

  //   // setDesks(generateDesks());
  // }, []);

  const Viewer = useRef(null);
  const [value, setValue] = useState(null);
  const [tool, setTool] = useState("auto");
  const { toast } = useToast();

  // Filter desks by active floor
  const currentFloorDesks = desks;
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch Profile", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDeskClick = (desk: Desk) => {
    if (desk.status == "reserved" || desk.status == "active") {
      setReservedDeskDetails({
        deskId: desk?.name,
        location: "Open Floor",
        user: desk?.booking?.user?.username,
        time: desk?.booking?.checkin_time,
        date: desk?.booking?.checkin_date,
      });

      // open the modal
      setIsReservedDeskModalOpen(true);
    }

    if (desk?.type === "Executive Room" && profile?.role === "employee") {
      toast({
        title: "Only Executives Can Book This Room",
        description:
          "Kinldy log in as an executive to make a booking to this room.",
        variant: "destructive",
      });
    }
    setSelectedDesk(desk);
    setSelectedDeskType(desk?.type || "desk");
    setIsBookingModalOpen(true);
  };

  const getDeskColor = (desk: Desk) => {
    if (!desk?.status === "availabe") return "#E5E7EB";
    if (desk?.status === "reserved" || currentBooking?.deskId?.id === desk.id)
      return "#EF4444";
    if (selectedDesk?.id === desk.id) return "#F59E0B";
    return "#10B981";
  };

  const getDeskStatusColor = (desk: Desk) => {
    if (!desk?.status === "availabe") return "#E5E7EB";
    if (desk?.status === "reserved" || currentBooking?.deskId?.id === desk.id)
      return "#EF4444";
    if (selectedDesk?.id === desk.id) return "#F59E0B";
    return "#10B981";
  };

  const getDeskStroke = (desk: Desk) => {
    if (selectedDesk?.id === desk.id) return "#D97706";
  };

  const stats = {
    total: desks.length,
    active: desks.filter((d) => d.status === "available").length,
    booked: desks.filter(
      (d) => d.status === "reserved" || d.status === "active",
    ).length,
    available: desks.filter((d) => d?.status == "available").length,
  };

  const [reservedDeskDetails, setReservedDeskDetails] = useState<any>(null);
  const [isReservedDeskModalOpen, setIsReservedDeskModalOpen] = useState(false);
  const [selectedDeskType, setSelectedDeskType] = useState<"desk" | "office">(
    "desk",
  );
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedDesks, setSelectedDesk] = useState([]);

  const [availableDesks, setAvailableDesks] = useState<
    Array<{ id: string; type: "desk" | "office"; status: string }>
  >(desks?.filter((d) => d.status === "available"));
  const [unavailableDesks, setUnavailableDesks] = useState<
    Array<{ id: string; type: "desk" | "office"; status: string }>
  >(desks?.filter((d) => d.status === "unavailable"));
  const [bookedDesks, setBookedDesks] = useState<
    Array<{ id: string; type: "desk" | "office"; status: string }>
  >(desks?.filter((d) => d.status === "booked"));

  // Add user context for bookings
  const [allDesks, setAllDesks] = useState([]);
  const [deskBookings, setDeskBookings] = useState<{
    [deskId: string]: { user: string; status: string } | null;
  }>({});

  useEffect(() => {
    const fetchDesks = async () => {
      try {
        setIsLoading(true);
        const data = await getDesks();
        setDesks(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch Desks", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDesks();
  }, []);

  // Update booking logic to move desk between lists
  const handleBookingConfirm = (
    deskId: string,
    date: string,
    time: string,
    type: "desk" | "office",
  ) => {
    const newBooking = {
      id: Date.now().toString(),
      deskId,
      date,
      time,
      status: "booked" as const,
      type,
    };
    setUserBookings((prev) => [...prev, newBooking]);
    setDeskBookings((prev) => ({
      ...prev,
      [deskId]: { user: "", status: "booked" },
    }));
    setAvailableDesks((prev) => prev.filter((d) => d.id !== deskId));
    setBookedDesks((prev) => [
      ...prev,
      desks?.find((d) => d.id === deskId) || {
        id: deskId,
        type: type as "desk" | "office",
        status: "booked",
      },
    ]);
    setBookingDetails({ deskId, date, time, type });
    setIsBookingModalOpen(false);
    setSelectedDesk(null);
    setIsConfirmationModalOpen(true);
  };

  const handleBookingReschedule = (
    bookingId: string,
    newDate: string,
    newTime: string,
  ) => {
    setUserBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, date: newDate, time: newTime }
          : booking,
      ),
    );

    toast({
      title: "Booking Rescheduled",
      description: "Your booking has been successfully rescheduled.",
    });
  };

  const handleBookingCancel = (bookingId: string) => {
    const booking = userBookings.find((b) => b.id === bookingId);
    setUserBookings((prev) => prev.filter((b) => b.id !== bookingId));
    setDeskBookings((prev) => ({ ...prev, [booking?.deskId!]: null }));
    // Move desk back to available
    if (booking && bookedDesks.find((d) => d.id === booking.deskId)) {
      setBookedDesks((prev) => prev.filter((d) => d.id !== booking.deskId));
      setAvailableDesks((prev) => [
        ...prev,
        desks?.find((d) => d.id === booking.deskId) || {
          id: booking.deskId,
          type: booking.type as "desk" | "office",
          status: "available",
        },
      ]);
    }
    setAllDesks((prev) =>
      prev.map((d) =>
        d.id === booking?.deskId ? { ...d, status: "available" } : d,
      ),
    );
    toast({
      title: "Booking Cancelled",
      description: `Your booking for ${booking?.deskId} has been cancelled.`,
    });
  };

  const handleReservedBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsCheckInModalOpen(true);
  };
  return (
    <div className="space-y-6">
      {/* Legend and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm text-gray-600">
              Available ({stats.available})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">
              Booked ({stats.booked})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-600">Inactive</span>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {stats.active} of {stats.total} desks active
        </Badge>
      </div>

      {/* Floor Plan SVG */}
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <ReactSVGPanZoom
          ref={Viewer}
          width={1200}
          height={400}
          tool={tool}
          onChangeTool={setTool}
          value={value}
          onChangeValue={setValue}
          detectAutoPan={false}
        >
          <TooltipProvider>
            <svg
              width="900"
              height="600"
              viewBox="0 0 100% 100%"
              className="h-auto min-w-[900px]"
            >
              {/* Background Image */}
              <image
                href={floorplan} // your image file
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Render Current Floor Desks */}
              {currentFloorDesks.map((desk) => (
                <Tooltip key={desk.id}>
                  <TooltipTrigger asChild>
                    <g
                      onClick={() => handleDeskClick(desk)}
                      onMouseEnter={() => setHoveredDesk(desk.id)}
                      onMouseLeave={() => setHoveredDesk(null)}
                      className={`cursor-pointer transition-all duration-200 ${
                        desk.status == "available" ? "hover:scale-110" : ""
                      }`}
                      style={{
                        transformOrigin: `${desk.x_axis}px ${desk.y_axis}px`,
                      }}
                    >
                      {/* Desk */}
                      <rect
                        x={desk.x_axis}
                        y={desk.y_axis}
                        width={desk?.height}
                        height={desk?.width}
                        fill={getDeskColor(desk)}
                        stroke={getDeskStroke(desk)}
                        strokeWidth={selectedDesk === desk.id ? "3" : "2"}
                        rx="6"
                        className="transition-all duration-200"
                      />

                      {hoveredDesk === desk.id && (
                        <foreignObject
                          x={desk.x_axis}
                          y={desk.y_axis}
                          width={120}
                          height={60}
                          className="relative"
                        >
                          <div className="bg-white text-xs shadow-lg rounded-md p-2 border border-gray-200 relative">
                            <p className="font-semibold">{desk?.name}</p>
                            <p>
                              Status:{" "}
                              {desk?.status == "available"
                                ? "Available"
                                : "Booked"}
                            </p>
                            {desk.user && <p>User: {desk?.user?.username}</p>}
                          </div>
                        </foreignObject>
                      )}

                      {/* Chair */}
                      {/*<rect
                      x={desk.x}
                      y={desk.y}
                      width={24}
                      height={15}
                      fill={desk.isActive ? "#6B7280" : "#D1D5DB"}
                      rx="10"
                    />*/}

                      {/* Desk ID */}
                      {/*<text
                      x={desk.x}
                      y={desk.y}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      className="fill-white text-xs font-semibold pointer-events-none"
                      style={{
                        fontSize: desk.type === "executive" ? "11px" : "9px",
                      }}
                    >
                      {desk.id}
                    </text>*/}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-semibold">{desk.id}</p>
                      <p className="text-sm text-gray-600">{desk.section}</p>
                      <p className="text-sm">
                        Status:{" "}
                        {!desk.isActive
                          ? "Inactive"
                          : desk.isBooked
                            ? "Booked"
                            : "Available"}
                      </p>
                      {desk.type === "executive" && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Executive
                        </Badge>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </svg>
          </TooltipProvider>
        </ReactSVGPanZoom>
      </div>
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedDesk(null);
        }}
        deskId={selectedDesks}
        deskType={selectedDeskType}
        onConfirm={handleBookingConfirm}
      />

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        bookingDetails={bookingDetails}
      />

      {/* Booking Reschedule Modal */}
      <BookingRescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onReschedule={handleBookingReschedule}
      />

      {/* Booking Cancel Modal */}
      <BookingCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onCancel={handleBookingCancel}
      />

      {/* Reserved Desk Details Modal */}
      {isReservedDeskModalOpen && reservedDeskDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm animate-fade-in">
            <div className="space-y-6 py-4">
              {/* Booking Details */}
              <div className="bg-gradient-card rounded-lg p-4 space-y-4 border border-success/20 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-primary">
                    Booking Details
                  </h4>
                  <Badge className="bg-red-600 text-success-foreground">
                    Reserved
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {reservedDeskDetails.deskId}
                        {/*{bookingDetails.type === "office" ? "Office" : "Desk"}{" "}
                          {bookingDetails.deskId}*/}
                      </p>
                      {/*<p className="text-sm text-muted-foreground">
                          {bookingDetails.type === "office"
                            ? "Executive Suite"
                            : "Open Floor Plan"}
                        </p>*/}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{reservedDeskDetails.date}</p>
                      {/*<p className="text-sm text-muted-foreground">
                          {new Date(bookingDetails.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>*/}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      {reservedDeskDetails.time}
                      <p className="text-sm text-muted-foreground">
                        Start time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      {reservedDeskDetails.user}
                      <p className="text-sm text-muted-foreground">
                        Reserved by
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Action Button */}
              <Button
                onClick={() => setIsReservedDeskModalOpen(false)}
                variant="default"
                className="w-full text-white shadow-md"
              >
                Got it, thanks!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlan;
