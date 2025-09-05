import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { FloorPlan } from "@/components/dashboard/FloorPlan";
import FloorPlan from "@/components/dashboard/NewFloorPlan";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { DeskCard } from "@/components/dashboard/DeskCard";
import { DeskFilter } from "@/components/dashboard/DeskFilter";
import { BookingConfirmationModal } from "@/components/dashboard/BookingConfirmationModal";
import { BookingRescheduleModal } from "@/components/dashboard/BookingRescheduleModal";
import { BookingCancelModal } from "@/components/dashboard/BookingCancelModal";
import { CheckInModal } from "@/components/dashboard/CheckInModal";
import { Footer } from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import {
  downloadCSV,
  prepareBookingHistoryData,
  prepareAnalyticsData,
} from "@/utils/csvExport";
import chietaLogo from "@/assets/chieta-logo.jpeg";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getDesks, getProfile, userBookedDesks } from "@/services/apiClient";
import Header from "@/components/Header";

interface Desk {
  id: number;
  name: string;
  code: string;
  status: string;
  type: string;
  description: string;
  max_capacity: number;
}
const UserDashboard = () => {
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null);
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
  const [activeTab, setActiveTab] = useState("open-floor");
  const [activeBookingTab, setActiveBookingTab] = useState("current");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await userBookedDesks();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch Bookings", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

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

  const [desks, setDesks] = useState([]);
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

  const { toast } = useToast();
  const navigate = useNavigate();

  const [deskBookings, setDeskBookings] = useState<{
    [deskId: string]: { user: string; status: string } | null;
  }>({});
  const userName = localStorage.getItem("userName") || profile?.username;
  const userType = localStorage.getItem("userType") || profile?.role;

  const [reservedDeskDetails, setReservedDeskDetails] = useState<any>(null);
  const [isReservedDeskModalOpen, setIsReservedDeskModalOpen] = useState(false);

  // Add state for desk status tab
  const [deskStatusTab, setDeskStatusTab] = useState("all");

  // Desk status tab options
  const deskStatusTabs = [
    { label: "All Desks", value: "all" },
    { label: "Available", value: "available" },
    { label: "Reserved", value: "reserved" },
    { label: "Booked", value: "booked" },
    { label: "Inactive", value: "inactive" },
    { label: "Checked-in", value: "checked-in" },
  ];

  // Filter desks by selected tab
  const filteredDesksByTab = () => {
    if (deskStatusTab === "all") return desks;
    return desks.filter((desk) => desk.status === deskStatusTab);
  };

  // Filter desks by selected tab
  const filteredDesksByPlan = () => {
    if (deskStatusTab === "open floor plan") return desks;
    return desks.filter((desk) => desk.type === activeTab);
  };

  const handleDeskCardClick = (deskId: string, status: string) => {
    const desk = desks?.find((d) => d.id === deskId);
    if (status === "reserved") {
      setReservedDeskDetails({
        deskId: desk?.id,
        location: "Open Floor",
        user: deskBookings[deskId]?.user || "Unknown",
        time: userBookings.find((b) => b.deskId === deskId)?.time || "N/A",
        date: userBookings.find((b) => b.deskId === deskId)?.date || "N/A",
      });
      setIsReservedDeskModalOpen(true);
      return;
    }
    if (status === "available") {
      setSelectedDesk(deskId);
      setSelectedDeskType(desk?.type || "desk");
      setIsBookingModalOpen(true);
    }
    // Optionally handle booked, inactive, checked-in as needed
  };

  // --- Desk state management for available/booked lists ---
  const [availableDesks, setAvailableDesks] = useState<
    Array<{ id: string; type: "desk" | "office"; status: string }>
  >(desks?.filter((d) => d.status === "available"));
  const [unavailableDesks, setUnavailableDesks] = useState<
    Array<{ id: string; type: "desk" | "office"; status: string }>
  >(desks?.filter((d) => d.status === "unavailable"));
  const [bookedDesks, setBookedDesks] = useState<
    Array<{ id: string; type: "desk" | "office"; status: string }>
  >(desks?.filter((d) => d.status === "booked"));

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
      [deskId]: { user: userName, status: "booked" },
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

    toast({
      title: "Booking Cancelled",
      description: `Your booking for ${booking?.deskId} has been cancelled.`,
    });
  };

  const handleReservedBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsCheckInModalOpen(true);
  };

  const handleCheckIn = (bookingId: string) => {
    setUserBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "checked-in" }
          : booking,
      ),
    );
    setIsCheckInModalOpen(false);
  };

  const handleDownloadCSV = () => {
    const csvData = prepareBookingHistoryData(userBookings);
    downloadCSV(
      csvData,
      `chieta-desk-bookings-${new Date().toISOString().split("T")[0]}`,
    );
    toast({
      title: "Download Complete",
      description: "Your booking history has been downloaded as CSV.",
    });
  };

  // Handler for meeting room booking modal
  const [isMeetingRoomModalOpen, setIsMeetingRoomModalOpen] = useState(false);
  const [selectedMeetingRoom, setSelectedMeetingRoom] = useState<string | null>(
    null,
  );
  const handleMeetingRoomClick = (roomId: string) => {
    setSelectedMeetingRoom(roomId);
    setIsMeetingRoomModalOpen(true);
  };
  const handleBoardRoomClick = () => {
    setSelectedMeetingRoom("Board Room");
    setIsMeetingRoomModalOpen(true);
  };

  // Filter functions
  const getCurrentDesks = () => {
    return activeTab === "open floor plan" ? desks : filteredDesksByPlan();
  };

  const getFilteredDesks = () => {
    const currentDesks = getCurrentDesks();
    if (selectedFilter === "all") return currentDesks;
    return currentDesks.filter((desk) => desk.status === selectedFilter);
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    toast({
      title: "Successfully Logged Out",
      description: "See you next time!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Welcome back, {profile?.username}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your desk bookings and check your office visit analytics.
          </p>
        </div>

        {/* Floor Plan and Desk Management */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <Card className="shadow-custom-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">
                Floor Plan
              </CardTitle>
              <p className="text-muted-foreground">
                Interactive floor plan and available desks
              </p>
            </CardHeader>
            <CardContent>
              <FloorPlan onDeskClick={handleDeskCardClick} />
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {/* Current Bookings with Tabs */}
      <Card className="mb-8 shadow-custom-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary">
            Your Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeBookingTab} onValueChange={setActiveBookingTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-3 mt-4">
              {history.filter((b) => b.status === "active").length > 0 ? (
                <div className="space-y-3">
                  {history
                    .filter((b) => b.status === "active")
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-500 p-2 rounded-lg">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary">
                              Desk {booking?.deskId?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.checkin_date} at {booking.checkin_time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default">Currently Checked In</Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No current bookings. You're not checked in anywhere.
                </p>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-3 mt-4">
              {history.filter((b) => b.status === "reserved").length > 0 ? (
                <div className="space-y-3">
                  {history
                    .filter((b) => b.status === "reserved")
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className={`flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-3 lg:space-y-0 transition-colors ${
                          booking.status === "reserved"
                            ? "cursor-pointer hover:bg-orange-100 hover:shadow-md"
                            : "cursor-default"
                        }`}
                        onClick={() =>
                          booking.status === "reserved"
                            ? handleReservedBookingClick(booking)
                            : undefined
                        }
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-500 p-2 rounded-lg">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary">
                              Desk {booking?.desk?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking?.checkin_date} at {booking?.checkin_time}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          <strong>Connect to office WiFi</strong> to
                          automatically check in to your reserved desks.
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:items-center">
                          {/* <Badge variant="secondary" className="w-fit">
                            Reserved{" "}
                            {isConnectedToWifi
                              ? "• Can Check In"
                              : "• Need WiFi"}
                          </Badge> */}
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsRescheduleModalOpen(true);
                              }}
                              className="text-xs"
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsCancelModalOpen(true);
                              }}
                              className="text-xs text-destructive hover:text-destructive"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming bookings. Book a desk from the floor plan below!
                </p>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-3 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <h3 className="text-lg font-semibold text-primary">
                  Booking History
                </h3>
                {/*<Button
                  onClick={handleDownloadCSV}
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto"
                >
                  Download CSV
                </Button>*/}
              </div>
              {history.filter(
                (b) => b.status === "completed" || b.status === "cancelled",
              ).length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {history
                    .filter(
                      (b) =>
                        b.status === "completed" || b.status === "cancelled",
                    )
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-secondary/10 rounded-lg space-y-2 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg ${
                              booking.status === "completed"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary">
                              Desk {booking?.desk?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking?.checkin_date} at {booking?.checkin_time}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            booking.status === "completed"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {booking.status === "completed"
                            ? "Completed"
                            : "Cancelled"}
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No booking history yet.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedDesk(null);
        }}
        deskId={selectedDesk}
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

      {/* Booking Modal for Meeting Rooms */}
      <BookingModal
        isOpen={isMeetingRoomModalOpen}
        onClose={() => {
          setIsMeetingRoomModalOpen(false);
          setSelectedMeetingRoom(null);
        }}
        deskId={selectedMeetingRoom}
        deskType="office"
        onConfirm={handleBookingConfirm}
        isBoardRoom={selectedMeetingRoom === "Board Room"}
      />

      {/* Reserved Desk Details Modal */}
      {isReservedDeskModalOpen && reservedDeskDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm animate-fade-in">
            <h3 className="text-lg font-bold mb-2 text-primary">
              Reserved Desk Details
            </h3>
            <p>
              <strong>Desk:</strong> {reservedDeskDetails.deskId}
            </p>
            <p>
              <strong>Location:</strong> {reservedDeskDetails.location}
            </p>
            <p>
              <strong>Reserved By:</strong> {reservedDeskDetails.user}
            </p>
            <p>
              <strong>Date:</strong> {reservedDeskDetails.date}
            </p>
            <p>
              <strong>Time:</strong> {reservedDeskDetails.time}
            </p>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setIsReservedDeskModalOpen(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserDashboard;
