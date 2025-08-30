import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloorPlan } from "@/components/dashboard/FloorPlan";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { useToast } from "@/hooks/use-toast";
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
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConnectedToWifi, setIsConnectedToWifi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([
    { id: "1", deskId: "D-15", date: "2024-01-15", status: "checked-in" },
    { id: "2", deskId: "D-22", date: "2024-01-14", status: "completed" },
  ]);
  
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

  const handleDeskClick = (deskId: string, status: string) => {
    if (status === 'available') {
      setSelectedDesk(deskId);
      setIsBookingModalOpen(true);
    } else if (status === 'booked') {
      // Check if this is user's booking and they're on WiFi
      const userBooking = userBookings.find(b => b.deskId === deskId && b.status === 'reserved');
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

  const handleBookingConfirm = (deskId: string, date: string, time: string) => {
    const newBooking = {
      id: Date.now().toString(),
      deskId,
      date,
      status: 'reserved' as const
    };
    
    setUserBookings(prev => [...prev, newBooking]);
    
    toast({
      title: "Booking Made Successfully",
      description: `Desk ${deskId} booked for ${date} at ${time}`,
    });
    
    setIsBookingModalOpen(false);
    setSelectedDesk(null);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">DeskFlow</h1>
                <p className="text-sm text-muted-foreground">User Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* WiFi Status */}
              <div className="flex items-center space-x-2">
                {isConnectedToWifi ? (
                  <div className="flex items-center space-x-1 text-success">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm font-medium">Office WiFi</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-warning">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-sm font-medium">No Office WiFi</span>
                  </div>
                )}
              </div>

              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Welcome back, User!
          </h2>
          <p className="text-muted-foreground">
            Manage your desk bookings and check your office visit analytics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title}
              className="animate-fade-in hover:shadow-custom-md transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Bookings */}
        <Card className="mb-8 shadow-custom-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">
              Your Current Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBookings.length > 0 ? (
              <div className="space-y-3">
                {userBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-primary p-2 rounded-lg">
                        <MapPin className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">
                          Desk {booking.deskId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        booking.status === 'checked-in' ? 'default' :
                        booking.status === 'reserved' ? 'secondary' :
                        'outline'
                      }
                    >
                      {booking.status === 'checked-in' ? 'Checked In' :
                       booking.status === 'reserved' ? 'Reserved' :
                       'Completed'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No current bookings. Select a desk from the floor plan to book!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Floor Plan */}
        <Card className="shadow-custom-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">
              Office Floor Plan
            </CardTitle>
            <p className="text-muted-foreground">
              Click on available desks (green) to book them. Orange desks are your bookings.
            </p>
          </CardHeader>
          <CardContent>
            <FloorPlan onDeskClick={handleDeskClick} userBookings={userBookings} />
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedDesk(null);
        }}
        deskId={selectedDesk}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
};

export default UserDashboard;