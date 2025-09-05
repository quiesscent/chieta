import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { bookingData, getAllBookings } from "@/services/apiClient";

interface BookingEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  deskId: string;
  type: "desk" | "office";
  status: "reserved" | "checked-in" | "completed";
}

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const navigate = useNavigate();

  // Mock booking events data
  const [bookings] = useState<BookingEvent[]>([
    {
      id: "1",
      title: "Desk D-01 Booking",
      date: new Date(2024, 11, 15),
      time: "09:00",
      deskId: "D-01",
      type: "desk",
      status: "reserved",
    },
    {
      id: "2",
      title: "Office O-05 Meeting",
      date: new Date(2024, 11, 18),
      time: "14:30",
      deskId: "O-05",
      type: "office",
      status: "checked-in",
    },
    {
      id: "3",
      title: "Desk D-12 Booking",
      date: new Date(2025, 8, 20),
      time: "08:00",
      deskId: "D-12",
      type: "desk",
      status: "completed",
    },
    {
      id: "4",
      title: "Desk D-08 Booking",
      date: new Date(2025, 8, 4),
      time: "10:00",
      deskId: "D-08",
      type: "desk",
      status: "reserved",
    },
  ]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1),
    );
  };

  const [allBookings, setDesks] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  useEffect(() => {
    const fetchDesks = async () => {
      try {
        setIsLoading(true);
        const data = await getAllBookings();
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

  function formatToJsDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    return `new Date(${year}, ${month - 1}, ${day})`;
  }

  const getBookingsForDate = (date: Date) => {
    return allBookings.filter((booking) => {
      const bookingDate = new Date(booking.checkin_date);
      return isSameDay(bookingDate, date);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reserved":
        return "bg-warning text-warning-foreground";
      case "active":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Calendar Section */}
          <div className="w-full">
            <Card className="shadow-custom-md w-full">
              <CardContent className="w-full">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  className="w-full"
                  modifiers={{
                    hasBooking: (date) => getBookingsForDate(date).length > 0,
                  }}
                  modifiersClassNames={{
                    hasBooking: "bg-primary/10 text-primary font-semibold",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Booking Details Section */}
          <div className="space-y-4">
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary">
                  {selectedDate
                    ? format(selectedDate, "MMMM d, yyyy")
                    : "Select a date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-3">
                    {getBookingsForDate(selectedDate).length > 0 ? (
                      getBookingsForDate(selectedDate).map((booking) => (
                        <div
                          key={booking.id}
                          className="p-3 bg-secondary/20 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-primary">
                                Booked by: {booking.user.username}
                              </p>
                              <p className="font-medium text-primary">
                                Date: {booking.checkin_date}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Time: {booking.checkin_time}
                              </p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              Status: {booking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{booking.type === "desk" ? "🪑" : "🏢"}</span>
                            <span>{booking.desk.name}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No bookings for this date.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Click on a date to view bookings.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
