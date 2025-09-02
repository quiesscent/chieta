import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { format, addMonths, subMonths, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useNavigate } from "react-router-dom";

interface BookingEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  deskId: string;
  type: 'desk' | 'office';
  status: 'reserved' | 'checked-in' | 'completed';
}

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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
      status: "reserved"
    },
    {
      id: "2", 
      title: "Office O-05 Meeting",
      date: new Date(2024, 11, 18),
      time: "14:30",
      deskId: "O-05",
      type: "office",
      status: "checked-in"
    },
    {
      id: "3",
      title: "Desk D-12 Booking",
      date: new Date(2024, 11, 20),
      time: "08:00",
      deskId: "D-12",
      type: "desk",
      status: "completed"
    },
    {
      id: "4",
      title: "Desk D-08 Booking",
      date: new Date(2024, 11, 22),
      time: "10:00",
      deskId: "D-08",
      type: "desk",
      status: "reserved"
    }
  ]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(booking.date, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved':
        return 'bg-warning text-warning-foreground';
      case 'checked-in':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">Calendar</h1>
                <p className="text-sm text-muted-foreground">View your booking schedule</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-custom-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-primary">
                    {format(currentDate, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  className="w-full"
                  modifiers={{
                    hasBooking: (date) => getBookingsForDate(date).length > 0
                  }}
                  modifiersClassNames={{
                    hasBooking: "bg-primary/10 text-primary font-semibold"
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
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-3">
                    {getBookingsForDate(selectedDate).length > 0 ? (
                      getBookingsForDate(selectedDate).map((booking) => (
                        <div key={booking.id} className="p-3 bg-secondary/20 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-primary">{booking.title}</p>
                              <p className="text-sm text-muted-foreground">{booking.time}</p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{booking.type === 'desk' ? '🪑' : '🏢'}</span>
                            <span>{booking.deskId}</span>
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

            {/* Monthly Summary */}
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary">
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Bookings</span>
                    <Badge variant="outline">
                      {bookings.filter(b => isSameMonth(b.date, currentDate)).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reserved</span>
                    <Badge className="bg-warning text-warning-foreground">
                      {bookings.filter(b => 
                        isSameMonth(b.date, currentDate) && b.status === 'reserved'
                      ).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Checked In</span>
                    <Badge className="bg-primary text-primary-foreground">
                      {bookings.filter(b => 
                        isSameMonth(b.date, currentDate) && b.status === 'checked-in'
                      ).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <Badge className="bg-success text-success-foreground">
                      {bookings.filter(b => 
                        isSameMonth(b.date, currentDate) && b.status === 'completed'
                      ).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};