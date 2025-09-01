import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeskManagementModal } from "@/components/dashboard/DeskManagementModal";
import { EmployeeDetailsModal } from "@/components/dashboard/EmployeeDetailsModal";
import { EmployeeUpdateModal } from "@/components/dashboard/EmployeeUpdateModal";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { Footer } from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import { downloadCSV, prepareEmployeeHistoryData } from "@/utils/csvExport";
import {
  Users,
  MapPin,
  TrendingUp,
  Settings,
  LogOut,
  User,
  Plus,
  Trash2,
  Edit,
  Activity,
  Eye,
  Download
} from "lucide-react";
import chietaLogo from "@/assets/chieta-logo.jpeg";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([
    { id: "1", name: "John Doe", email: "john@demo.com", loginFrequency: 25, status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@demo.com", loginFrequency: 18, status: "active" },
    { id: "3", name: "Mike Johnson", email: "mike@demo.com", loginFrequency: 12, status: "inactive" },
    { id: "4", name: "Sarah Wilson", email: "sarah@demo.com", loginFrequency: 31, status: "active" },
  ]);

  const [userLogs, setUserLogs] = useState([
    { id: "1", user: "John Doe", action: "Checked in", desk: "D-15", timestamp: "2024-01-15 09:30:00" },
    { id: "2", user: "Jane Smith", action: "Booked desk", desk: "D-22", timestamp: "2024-01-15 09:15:00" },
    { id: "3", user: "Mike Johnson", action: "Logged in", desk: "-", timestamp: "2024-01-15 08:45:00" },
    { id: "4", user: "Sarah Wilson", action: "Checked out", desk: "D-08", timestamp: "2024-01-15 17:30:00" },
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: "", email: "" });
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDeskModalOpen, setIsDeskModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isEmployeeUpdateModalOpen, setIsEmployeeUpdateModalOpen] = useState(false);

  // Sample desk data for management
  const [desks, setDesks] = useState(
    Array.from({ length: 32 }, (_, index) => {
      const deskNumber = (index + 1).toString().padStart(2, '0');
      const statuses = ['available', 'unavailable', 'booked', 'inactive'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: `D-${deskNumber}`,
        type: 'desk' as const,
        status: randomStatus,
        currentUser: randomStatus === 'booked' || randomStatus === 'checked-in' 
          ? employees[Math.floor(Math.random() * employees.length)]?.name 
          : undefined
      };
    })
  );

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      const employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        email: newEmployee.email,
        loginFrequency: 0,
        status: "active"
      };
      
      setEmployees(prev => [...prev, employee]);
      setNewEmployee({ name: "", email: "" });
      setIsAddingEmployee(false);
      
      toast({
        title: "Employee Added Successfully",
        description: `${employee.name} has been added to the system.`,
      });
    }
  };

  const handleRemoveEmployee = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    
    toast({
      title: "Employee Removed",
      description: `${employee?.name} has been removed from the system.`,
    });
  };

  const handleEmployeeStatusUpdate = (employeeId: string, newStatus: string) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status: newStatus }
          : emp
      )
    );
  };

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

  const handleDeskClick = (desk: any) => {
    setSelectedDesk(desk);
    setIsDeskModalOpen(true);
  };

  const handleDeskStatusUpdate = (deskId: string, newStatus: string) => {
    setDesks(prev => 
      prev.map(desk => 
        desk.id === deskId 
          ? { ...desk, status: newStatus, currentUser: newStatus === 'available' ? undefined : desk.currentUser }
          : desk
      )
    );
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
      title: "Total Employees",
      value: employees.length.toString(),
      icon: Users,
      description: "Active users"
    },
    {
      title: "Active Bookings",
      value: "15",
      icon: MapPin,
      description: "Currently reserved"
    },
    {
      title: "Daily Logins",
      value: "42",
      icon: TrendingUp,
      description: "Today"
    },
    {
      title: "Desk Utilization",
      value: "78%",
      icon: Activity,
      description: "This week"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-custom-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg flex items-center">
                <img src={chietaLogo} alt="Chieta Logo" className="h-10 w-20 mr-2" />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Admin Profile
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
            Admin Dashboard
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage employees, desk statuses, and monitor system activity.
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Analytics Dashboard */}
          <div className="xl:col-span-2">
            <Card className="shadow-custom-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Employee Management */}
          <Card className="shadow-custom-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-primary">
                  Employee Management
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setIsAddingEmployee(true)}
                  className="bg-gradient-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add Employee Form */}
              {isAddingEmployee && (
                <div className="mb-6 p-4 bg-secondary/20 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Employee Name</Label>
                      <Input
                        id="name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@company.com"
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleAddEmployee}>
                        Add Employee
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingEmployee(false);
                          setNewEmployee({ name: "", email: "" });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Employee List */}
              <div className="overflow-x-auto">
                <div className="space-y-3 min-w-full">
                  {employees.map((employee) => (
                    <div 
                      key={employee.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-secondary/10 rounded-lg gap-3 sm:gap-4 min-w-0"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="bg-gradient-primary p-2 rounded-lg shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-primary truncate">{employee.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {employee.loginFrequency} logins this month
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto shrink-0">
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="whitespace-nowrap">
                          {employee.status}
                        </Badge>
                        <div className="flex gap-1 w-full sm:w-auto shrink-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewEmployee(employee)}
                            className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                          >
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsEmployeeUpdateModalOpen(true);
                            }}
                            className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                          >
                            <Edit className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const csvData = prepareEmployeeHistoryData([employee]);
                              downloadCSV(csvData, `${employee.name.replace(/\s+/g, '-').toLowerCase()}-history-${new Date().toISOString().split('T')[0]}`);
                              toast({
                                title: "Download Complete",
                                description: `${employee.name}'s history has been downloaded.`,
                              });
                            }}
                            className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRemoveEmployee(employee.id)}
                            className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time User Logs */}
          <Card className="shadow-custom-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">
                Real-time User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-primary p-2 rounded-lg">
                        <Activity className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-primary">{log.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.action} {log.desk !== '-' && `at ${log.desk}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desk Management */}
        <Card className="mt-8 shadow-custom-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">
              Desk Status Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 sm:gap-3 lg:gap-4">
              {desks.map((desk) => (
                <div key={desk.id} className="text-center">
                  <div 
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full mx-auto mb-1 sm:mb-2 flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                      desk.status === 'available' ? 'bg-desk-available hover:bg-green-600' :
                      desk.status === 'unavailable' ? 'bg-desk-unavailable hover:bg-red-600' :
                      desk.status === 'booked' ? 'bg-desk-booked hover:bg-orange-600' :
                      'bg-desk-inactive hover:bg-gray-600'
                    }`}
                    onClick={() => handleDeskClick(desk)}
                  >
                    <span className="text-xs sm:text-xs">
                      {desk.id.split('-')[1]}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeskClick(desk)}
                    className="w-full h-6 sm:h-7 text-xs px-1 sm:px-2"
                  >
                    <Settings className="h-2 w-2 sm:h-3 sm:w-3 mr-0 sm:mr-1" />
                    <span className="hidden sm:inline">Manage</span>
                  </Button>
                  {desk.currentUser && (
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-full">
                      {desk.currentUser.split(' ')[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desk Management Modal */}
      <DeskManagementModal
        isOpen={isDeskModalOpen}
        onClose={() => {
          setIsDeskModalOpen(false);
          setSelectedDesk(null);
        }}
        desk={selectedDesk}
        onStatusUpdate={handleDeskStatusUpdate}
      />

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onStatusUpdate={handleEmployeeStatusUpdate}
      />

       <EmployeeUpdateModal
         isOpen={isEmployeeUpdateModalOpen}
         onClose={() => setIsEmployeeUpdateModalOpen(false)}
         employee={selectedEmployee}
         onUpdate={(employeeId, updatedData) => {
           setEmployees(prev => prev.map(emp => 
             emp.id === employeeId ? { ...emp, ...updatedData } : emp
           ));
           toast({
             title: "Employee Updated",
             description: "Employee information has been updated successfully.",
           });
         }}
       />

      <Footer />
    </div>
  );
};

export default AdminDashboard;
