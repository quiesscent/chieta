import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Building,
  Calendar,
  MapPin,
  TrendingUp,
  ArrowLeft,
  Edit,
  Save,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "user@demo.com",
    username: "johndoe",
    companyNumber: "EMP-2024-001"
  });

  const [editData, setEditData] = useState(profileData);
  const { toast } = useToast();

  // Sample booking history
  const bookingHistory = [
    { id: "1", desk: "D-15", date: "2024-01-15", status: "checked-in", checkInTime: "09:30" },
    { id: "2", desk: "D-22", date: "2024-01-14", status: "completed", checkInTime: "10:15" },
    { id: "3", desk: "D-08", date: "2024-01-13", status: "completed", checkInTime: "09:00" },
    { id: "4", desk: "D-15", date: "2024-01-12", status: "completed", checkInTime: "08:45" },
    { id: "5", desk: "D-30", date: "2024-01-11", status: "completed", checkInTime: "09:20" },
  ];

  const pendingCheckIns = [
    { id: "6", desk: "D-25", date: "2024-01-16", time: "09:00" },
  ];

  const officeVisitStats = {
    thisMonth: 12,
    thisWeek: 3,
    totalHours: 156,
    averageStay: "6.5 hours"
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!editData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!editData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProfileData(editData);
    setIsEditing(false);
    setIsLoading(false);
    setErrors({});
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const userType = localStorage.getItem('userType');
  const dashboardPath = userType === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-custom-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to={dashboardPath}
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">User Profile</h1>
                <p className="text-sm text-muted-foreground">{profileData.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card className="shadow-custom-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-primary">
                    Profile Information
                  </CardTitle>
                  <Button
                    size="sm"
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    loading={isLoading}
                    disabled={isLoading}
                    className="transition-all duration-300"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    {profileData.name}
                  </h3>
                  <p className="text-muted-foreground">{profileData.username}</p>
                </div>

                {/* Profile Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                      Full Name {errors.name && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={isEditing ? editData.name : profileData.name}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      className={`border-primary/20 focus:border-primary transition-all duration-300 ${
                        errors.name 
                          ? "border-destructive focus:border-destructive animate-shake" 
                          : "hover:border-primary/40"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                      Email Address {errors.email && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={isEditing ? editData.email : profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      className={`border-primary/20 focus:border-primary transition-all duration-300 ${
                        errors.email 
                          ? "border-destructive focus:border-destructive animate-shake" 
                          : "hover:border-primary/40"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="username" className={errors.username ? "text-destructive" : ""}>
                      Username {errors.username && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={isEditing ? editData.username : profileData.username}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      className={`border-primary/20 focus:border-primary transition-all duration-300 ${
                        errors.username 
                          ? "border-destructive focus:border-destructive animate-shake" 
                          : "hover:border-primary/40"
                      }`}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyNumber">Company Number</Label>
                    <Input
                      id="companyNumber"
                      name="companyNumber"
                      value={profileData.companyNumber}
                      disabled
                      className="border-primary/20"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 animate-fade-in">
                    <Button 
                      size="sm" 
                      onClick={handleSave} 
                      className="flex-1"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleCancel} 
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Office Visit Analytics */}
            <Card className="mt-6 shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Visit Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{officeVisitStats.thisMonth}</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{officeVisitStats.thisWeek}</div>
                    <div className="text-sm text-muted-foreground">This Week</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{officeVisitStats.totalHours}</div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <div className="text-lg font-bold text-primary">{officeVisitStats.averageStay}</div>
                    <div className="text-sm text-muted-foreground">Avg. Stay</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking History and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Check-ins */}
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Pending Check-ins
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingCheckIns.length > 0 ? (
                  <div className="space-y-3">
                    {pendingCheckIns.map((booking) => (
                      <div 
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-warning p-2 rounded-lg">
                            <MapPin className="h-4 w-4 text-warning-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary">
                              Desk {booking.desk}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.date} at {booking.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          Pending Check-in
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No pending check-ins.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Booking History */}
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Booking History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookingHistory.map((booking) => (
                    <div 
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-primary p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-primary">
                            Desk {booking.desk}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.date} • Check-in: {booking.checkInTime}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status === 'checked-in' ? 'Checked In' :
                         booking.status === 'completed' ? 'Completed' :
                         booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;