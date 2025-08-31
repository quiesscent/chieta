import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloorPlan } from "@/components/dashboard/FloorPlan";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { DeskCard } from "@/components/dashboard/DeskCard";
import { DeskFilter } from "@/components/dashboard/DeskFilter";
import { BookingConfirmationModal } from "@/components/dashboard/BookingConfirmationModal";
import { BookingRescheduleModal } from "@/components/dashboard/BookingRescheduleModal";
import { BookingCancelModal } from "@/components/dashboard/BookingCancelModal";
import { CheckInModal } from "@/components/dashboard/CheckInModal";
import { Footer } from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import { downloadCSV, prepareBookingHistoryData } from "@/utils/csvExport";
import chietaLogo from "@/assets/chieta-logo.png";
import { 
  Calendar, 
  MapPin, 
  Users, 
  TrendingUp, 
  LogOut,
  User,
  Wifi,
  WifiOff
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null);
  const [selectedDeskType, setSelectedDeskType] = useState<'desk' | 'office'>('desk');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isConnectedToWifi, setIsConnectedToWifi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("open-floor");
  const [activeBookingTab, setActiveBookingTab] = useState("current");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userBookings, setUserBookings] = useState([
    { id: "1", deskId: "OP-15", date: "2024-01-15", time: "09:30", status: "checked-in", type: "desk" },
    { id: "2", deskId: "OP-22", date: "2024-01-16", time: "10:00", status: "reserved", type: "desk" },
    { id: "3", deskId: "E-02", date: "2024-01-17", time: "14:00", status: "reserved", type: "office" },
    { id: "4", deskId: "OP-08", date: "2024-01-14", time: "09:00", status: "completed", type: "desk" },
    { id: "5", deskId: "OP-33", date: "2024-01-13", time: "13:30", status: "completed", type: "desk" },
    { id: "6", deskId: "E-01", date: "2024-01-12", time: "11:00", status: "cancelled", type: "office" },
  ]);
  
  // Sample desk data for open floor plan - Updated to match OP format
  const openFloorDesks = [
    { id: "OP-01", type: "desk" as const, status: "available" as const },
    { id: "OP-02", type: "desk" as const, status: "unavailable" as const },
    { id: "OP-03", type: "desk" as const, status: "available" as const },
    { id: "OP-04", type: "desk" as const, status: "reserved" as const },
    { id: "OP-05", type: "desk" as const, status: "available" as const },
    { id: "OP-06", type: "desk" as const, status: "checked-in" as const },
    { id: "OP-07", type: "desk" as const, status: "inactive" as const },
    { id: "OP-08", type: "desk" as const, status: "available" as const },
    { id: "OP-09", type: "desk" as const, status: "available" as const },
    { id: "OP-10", type: "desk" as const, status: "booked" as const },
    { id: "OP-11", type: "desk" as const, status: "available" as const },
    { id: "OP-12", type: "desk" as const, status: "available" as const },
    { id: "OP-13", type: "desk" as const, status: "reserved" as const },
    { id: "OP-14", type: "desk" as const, status: "available" as const },
    { id: "OP-15", type: "desk" as const, status: "checked-in" as const },
    { id: "OP-16", type: "desk" as const, status: "available" as const },
    { id: "OP-17", type: "desk" as const, status: "available" as const },
    { id: "OP-18", type: "desk" as const, status: "inactive" as const },
    { id: "OP-19", type: "desk" as const, status: "available" as const },
    { id: "OP-20", type: "desk" as const, status: "available" as const },
    { id: "OP-21", type: "desk" as const, status: "unavailable" as const },
    { id: "OP-22", type: "desk" as const, status: "reserved" as const },
    { id: "OP-23", type: "desk" as const, status: "available" as const },
    { id: "OP-24", type: "desk" as const, status: "available" as const },
    { id: "OP-25", type: "desk" as const, status: "available" as const },
    { id: "OP-26", type: "desk" as const, status: "booked" as const },
    { id: "OP-27", type: "desk" as const, status: "available" as const },
    { id: "OP-28", type: "desk" as const, status: "inactive" as const },
    { id: "OP-29", type: "desk" as const, status: "available" as const },
    { id: "OP-30", type: "desk" as const, status: "available" as const },
    { id: "OP-31", type: "desk" as const, status: "available" as const },
    { id: "OP-32", type: "desk" as const, status: "unavailable" as const },
    { id: "OP-33", type: "desk" as const, status: "available" as const },
    { id: "OP-34", type: "desk" as const, status: "available" as const },
    { id: "OP-35", type: "desk" as const, status: "available" as const },
    { id: "OP-36", type: "desk" as const, status: "available" as const },
    { id: "OP-37", type: "desk" as const, status: "available" as const },
    { id: "OP-38", type: "desk" as const, status: "available" as const },
    { id: "OP-39", type: "desk" as const, status: "available" as const },
    { id: "OP-40", type: "desk" as const, status: "booked" as const },
    { id: "OP-41", type: "desk" as const, status: "available" as const },
    { id: "OP-42", type: "desk" as const, status: "available" as const },
    { id: "OP-43", type: "desk" as const, status: "available" as const },
    { id: "OP-44", type: "desk" as const, status: "unavailable" as const },
    { id: "OP-45", type: "desk" as const, status: "available" as const },
    { id: "OP-46", type: "desk" as const, status: "available" as const },
    { id: "OP-47", type: "desk" as const, status: "available" as const },
    { id: "OP-48", type: "desk" as const, status: "available" as const },
    { id: "OP-49", type: "desk" as const, status: "unavailable" as const },
    { id: "OP-50", type: "desk" as const, status: "available" as const },
    { id: "OP-51", type: "desk" as const, status: "available" as const },
    { id: "OP-52", type: "desk" as const, status: "available" as const },
  ];

  // Sample executive office data
  const executiveOffices = [
    { id: "E-01", type: "office" as const, status: "available" as const, capacity: 1 },
    { id: "E-02", type: "office" as const, status: "reserved" as const, capacity: 2 },
    { id: "E-03", type: "office" as const, status: "available" as const, capacity: 1 },
    { id: "E-04", type: "office" as const, status: "checked-in" as const, capacity: 2 },
    { id: "E-05", type: "office" as const, status: "available" as const, capacity: 4 },
    { id: "E-06", type: "office" as const, status: "unavailable" as const, capacity: 1 },
    { id: "E-07", type: "office" as const, status: "available" as const, capacity: 2 },
    { id: "E-08", type: "office" as const, status: "inactive" as const, capacity: 1 },
  ];
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulate WiFi connection check
  useEffect(() => {
    // Random simulation of office WiFi connection
    const checkWifi = () => {
      const connected = Math.random() > 0.3; // 70% chance of being connected
      setIsConnectedToWifi(connected);
    };

    checkWifi();
    const interval = setInterval(checkWifi, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDeskCardClick = (deskId: string, status: string) => {
    if (status === 'available') {
      const desk = [...openFloorDesks, ...executiveOffices].find(d => d.id === deskId);
      setSelectedDesk(deskId);
      setSelectedDeskType(desk?.type || 'desk');
      setIsBookingModalOpen(true);
    } else if (status === 'reserved' || status === 'booked') {
      // Check if this is user's booking and they're on WiFi
      const userBooking = userBookings.find(b => b.deskId === deskId && (b.status === 'reserved' || b.status === 'booked'));
      if (userBooking && isConnectedToWifi) {
        // Auto check-in
        setUserBookings(prev => 
          prev.map(b => 
            b.id === userBooking.id 
              ? { ...b, status: 'checked-in' }
              : b
          )
        );
        toast({
          title: "Checked In Successfully!",
          description: `You're now checked in at ${deskId}`,
        });
      } else if (userBooking && !isConnectedToWifi) {
        toast({
          title: "Not Connected to Office WiFi",
          description: "Please connect to office WiFi to check in",
          variant: "destructive"
        });
      }
    }
  };

  const handleBookingConfirm = (deskId: string, date: string, time: string, type: 'desk' | 'office') => {
    const newBooking = {
      id: Date.now().toString(),
      deskId,
      date,
      time,
      status: 'reserved' as const,
      type
    };
    
    setUserBookings(prev => [...prev, newBooking]);
    
    // Set booking details for confirmation modal
    setBookingDetails({
      deskId,
      date,
      time,
      type
    });
    
    setIsBookingModalOpen(false);
    setSelectedDesk(null);
    setIsConfirmationModalOpen(true);
  };

  const handleBookingReschedule = (bookingId: string, newDate: string, newTime: string) => {
    setUserBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, date: newDate, time: newTime }
          : booking
      )
    );
    
    toast({
      title: "Booking Rescheduled",
      description: "Your booking has been successfully rescheduled.",
    });
  };

  const handleBookingCancel = (bookingId: string) => {
    const booking = userBookings.find(b => b.id === bookingId);
    setUserBookings(prev => prev.filter(b => b.id !== bookingId));
    
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
    setUserBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'checked-in' }
          : booking
      )
    );
    setIsCheckInModalOpen(false);
  };

  const handleDownloadCSV = () => {
    const csvData = prepareBookingHistoryData(userBookings);
    downloadCSV(csvData, `chieta-desk-bookings-${new Date().toISOString().split('T')[0]}`);
    toast({
      title: "Download Complete",
      description: "Your booking history has been downloaded as CSV.",
    });
  };

  // Filter functions
  const getCurrentDesks = () => {
    return activeTab === "open-floor" ? openFloorDesks : executiveOffices;
  };

  const getFilteredDesks = () => {
    const currentDesks = getCurrentDesks();
    if (selectedFilter === 'all') return currentDesks;
    return currentDesks.filter(desk => desk.status === selectedFilter);
  };

  const getDeskCounts = () => {
    const currentDesks = getCurrentDesks();
    return {
      all: currentDesks.length,
      available: currentDesks.filter(d => d.status === 'available').length,
      reserved: currentDesks.filter(d => d.status === 'reserved').length,
      booked: currentDesks.filter(d => d.status === 'booked').length,
      'checked-in': currentDesks.filter(d => d.status === 'checked-in').length,
      inactive: currentDesks.filter(d => d.status === 'inactive').length,
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    toast({
      title: "Successfully Logged Out",
      description: "See you next time!",
    });
    navigate('/');
  };

  const stats = [
    {
      title: "Total Bookings",
      value: userBookings.length.toString(),
      icon: Calendar,
      description: "This month"
    },
    {
      title: "Available Desks",
      value: "24",
      icon: MapPin,
      description: "Right now"
    },
    {
      title: "Unavailable Desks",
      value: "8",
      icon: Users,
      description: "Currently occupied"
    },
    {
      title: "Office Visits",
      value: "12",
      icon: TrendingUp,
      description: "This month"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-custom-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <div className="bg-gradient-primary p-1.5 sm:p-2 rounded-lg">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-primary truncate">Chieta Desk System</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">User Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* WiFi Status */}
              <div className="hidden sm:flex items-center space-x-2">
                {isConnectedToWifi ? (
                  <div className="flex items-center space-x-1 text-success">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm font-medium">Office WiFi</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-warning">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-sm font-medium">No WiFi</span>
                  </div>
                )}
              </div>

              {/* Mobile WiFi Status */}
              <div className="sm:hidden">
                {isConnectedToWifi ? (
                  <Wifi className="h-4 w-4 text-success" />
                ) : (
                  <WifiOff className="h-4 w-4 text-warning" />
                )}
              </div>

              <Link to="/profile">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" className="sm:hidden p-2">
                  <User className="h-4 w-4" />
                </Button>
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="sm:hidden p-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Welcome back, User!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your desk bookings and check your office visit analytics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title}
              className="animate-fade-in hover:shadow-custom-md transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-3 sm:p-4 lg:pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {stat.description}
                    </p>
                  </div>
                  <div className="bg-gradient-primary p-2 sm:p-3 rounded-lg shrink-0">
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                {userBookings.filter(b => b.status === 'checked-in').length > 0 ? (
                  <div className="space-y-3">
                    {userBookings.filter(b => b.status === 'checked-in').map((booking) => (
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
                              Desk {booking.deskId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.date} at {booking.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default">
                          Currently Checked In
                        </Badge>
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
                {userBookings.filter(b => b.status === 'reserved').length > 0 ? (
                  <div className="space-y-3">
                    {userBookings.filter(b => b.status === 'reserved').map((booking) => (
                      <div 
                        key={booking.id}
                        className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-3 lg:space-y-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-500 p-2 rounded-lg">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary">
                              Desk {booking.deskId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.date} at {booking.time}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:items-center">
                          <Badge variant="secondary" className="w-fit">
                            Reserved {isConnectedToWifi ? '• Can Check In' : '• Need WiFi'}
                          </Badge>
                           <div className="flex space-x-2">
                             {booking.status === 'reserved' && (
                               <Button 
                                 size="sm" 
                                 variant="default"
                                 onClick={() => handleReservedBookingClick(booking)}
                                 className="text-xs bg-gradient-primary"
                               >
                                 Check In
                               </Button>
                             )}
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
                    {!isConnectedToWifi && (
                      <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <p className="text-sm text-warning-foreground">
                          <strong>Connect to office WiFi</strong> to automatically check in to your reserved desks.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No upcoming bookings. Book a desk from the floor plan below!
                  </p>
                )}
              </TabsContent>

                <TabsContent value="history" className="space-y-3 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                  <h3 className="text-lg font-semibold text-primary">Booking History</h3>
                  <Button 
                    onClick={handleDownloadCSV}
                    variant="outline" 
                    size="sm"
                    className="self-start sm:self-auto"
                  >
                    Download CSV
                  </Button>
                </div>
                {userBookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {userBookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map((booking) => (
                      <div 
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-secondary/10 rounded-lg space-y-2 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            booking.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary">
                              Desk {booking.deskId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.date} at {booking.time}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={booking.status === 'completed' ? 'outline' : 'destructive'}
                        >
                          {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
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

        {/* Floor Plan and Desk Management */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="open-floor">Open Floor Plan</TabsTrigger>
            <TabsTrigger value="executive-suite">Executive Suite</TabsTrigger>
          </TabsList>
          
          <TabsContent value="open-floor" className="space-y-6">
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Open Floor Plan
                </CardTitle>
                <p className="text-muted-foreground">
                  Interactive floor plan and available desks
                </p>
              </CardHeader>
              <CardContent>
                <FloorPlan onDeskClick={handleDeskCardClick} userBookings={userBookings} />
              </CardContent>
            </Card>

            {/* Desk Cards for Open Floor */}
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Available Desks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeskFilter 
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                  deskCounts={getDeskCounts()}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {getFilteredDesks().map((desk) => (
                    <DeskCard
                      key={desk.id}
                      desk={desk}
                      onClick={handleDeskCardClick}
                    />
                  ))}
                </div>
                {getFilteredDesks().length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No desks match the selected filter.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="executive-suite" className="space-y-6">
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Executive Suite Offices
                </CardTitle>
                <p className="text-muted-foreground">
                  Private offices with enhanced amenities
                </p>
              </CardHeader>
              <CardContent>
                <DeskFilter 
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                  deskCounts={getDeskCounts()}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {getFilteredDesks().map((office) => (
                    <DeskCard
                      key={office.id}
                      desk={office}
                      onClick={handleDeskCardClick}
                    />
                  ))}
                </div>
                {getFilteredDesks().length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No offices match the selected filter.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

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

      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        booking={selectedBooking}
        onCheckIn={handleCheckIn}
      />

      <Footer />
    </div>
  );
};

export default UserDashboard;