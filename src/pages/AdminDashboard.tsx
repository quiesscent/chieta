import { useState, useEffect } from "react";
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
// Add desk and log CSV helpers
const prepareDeskData = (desks: any[]) =>
  desks.map((desk) => ({
    "Desk ID": desk.id,
    Type: desk.type,
    Status: desk.status,
    "Current User": desk.currentUser || "",
    "Exported On": new Date().toISOString().split("T")[0],
  }));
const prepareLogData = (logs: any[]) =>
  logs.map((log) => ({
    "Log ID": log.id,
    User: log.user,
    Action: log.action,
    Desk: log.desk,
    Timestamp: log.timestamp,
    "Exported On": new Date().toISOString().split("T")[0],
  }));

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
  Download,
  Calendar,
} from "lucide-react";
import chietaLogo from "@/assets/chieta-logo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import {
  bookingData,
  getDashboardStats,
  getDesks,
  getUsers,
  updateDeskStatus,
} from "@/services/apiClient";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@demo.com",
      loginFrequency: 25,
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@demo.com",
      loginFrequency: 18,
      status: "active",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@demo.com",
      loginFrequency: 12,
      status: "inactive",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@demo.com",
      loginFrequency: 31,
      status: "active",
    },
  ]);

  const [userLogs, setUserLogs] = useState([
    {
      id: "1",
      user: "John Doe",
      action: "Checked in",
      desk: "D-15",
      timestamp: "2024-01-15 09:30:00",
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "Booked desk",
      desk: "D-22",
      timestamp: "2024-01-15 09:15:00",
    },
    {
      id: "3",
      user: "Mike Johnson",
      action: "Logged in",
      desk: "-",
      timestamp: "2024-01-15 08:45:00",
    },
    {
      id: "4",
      user: "Sarah Wilson",
      action: "Checked out",
      desk: "D-08",
      timestamp: "2024-01-15 17:30:00",
    },
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: "", email: "" });
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDeskModalOpen, setIsDeskModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isEmployeeUpdateModalOpen, setIsEmployeeUpdateModalOpen] =
    useState(false);

  // Sample desk data for management
  // const [desks, setDesks] = useState(
  //   Array.from({ length: 32 }, (_, index) => {
  //     const deskNumber = (index + 1).toString().padStart(2, "0");
  //     const statuses = ["available", "unavailable", "booked", "inactive"];
  //     const randomStatus =
  //       statuses[Math.floor(Math.random() * statuses.length)];

  //     return {
  //       id: `D-${deskNumber}`,
  //       type: "desk" as const,
  //       status: randomStatus,
  //       currentUser:
  //         randomStatus === "booked" || randomStatus === "checked-in"
  //           ? employees[Math.floor(Math.random() * employees.length)]?.name
  //           : undefined,
  //     };
  //   }),
  // );

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      const employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        email: newEmployee.email,
        loginFrequency: 0,
        status: "active",
      };

      setEmployees((prev) => [...prev, employee]);
      setNewEmployee({ name: "", email: "" });
      setIsAddingEmployee(false);

      toast({
        title: "Employee Added Successfully",
        description: `${employee.name} has been added to the system.`,
      });
    }
  };

  const handleRemoveEmployee = (id: string) => {
    const employee = employees.find((emp) => emp.id === id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));

    toast({
      title: "Employee Removed",
      description: `${employee?.name} has been removed from the system.`,
    });
  };

  const handleEmployeeStatusUpdate = (
    employeeId: string,
    newStatus: string,
  ) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp,
      ),
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

  const handleDeskStatusUpdate = async (deskId: string, newStatus: string) => {
    // logic
    const data = {
      status: newStatus,
    };
    try {
      const update = await updateDeskStatus(Number(deskId?.id), data);
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chieta_user_token");
    localStorage.removeItem("chieta_user_refresh");
    toast({
      title: "Successfully Logged Out",
      description: "See you next time!",
    });
    navigate("/");
  };

  const handleDownloadAllData = () => {
    downloadCSV(prepareEmployeeHistoryData(employees), "all-employees");
    downloadCSV(prepareDeskData(desks), "all-desks");
    downloadCSV(prepareLogData(userLogs), "all-logs");
    // If bookings data exists, add here
  };

  const handleExport = async () => {
    try {
      const response = await bookingData();
      if (!response.ok) throw new Error("Failed to download");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bookings.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download bookings CSV");
    }
  };

  const stats = [
    {
      title: "Total Employees",
      value: employees.length.toString(),
      icon: Users,
      description: "Active users",
    },
    {
      title: "Active Bookings",
      value: "15",
      icon: MapPin,
      description: "Currently reserved",
    },
    {
      title: "Daily Logins",
      value: "42",
      icon: TrendingUp,
      description: "Today",
    },
    {
      title: "Desk Utilization",
      value: "78%",
      icon: Activity,
      description: "This week",
    },
  ];

  // core logic
  const [isLoading, setIsLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const data = await getUsers();
        setStaff(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch Staff", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
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

  const [chStats, setStats] = useState([]);

  useEffect(() => {
    const fetchDesks = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch Stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDesks();
  }, []);

  // dashboard stats format
  // {
  // "total_employees": 120,
  // "active_bookings": 15,
  // "daily_logins": [
  //   {"day": "2025-08-29", "total": 30},
  //   {"day": "2025-08-30", "total": 28},
  //   {"day": "2025-08-31", "total": 35}
  // ],
  // "desk_utilization_percentage": 64.7,
  // "weekly_utilization": [
  //   {"day": "2025-08-29", "total": 10},
  //   {"day": "2025-08-30", "total": 8},
  //   {"day": "2025-08-31", "total": 15}
  // ]
  // }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-custom-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg flex items-center">
                <button onClick={() => navigate("/admin")}>
                  <img
                    src={chietaLogo}
                    alt="Chieta Logo"
                    className="h-10 w-15 mr-2"
                  />
                </button>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-primary truncate flex items-center">
                  Chieta Desk System
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Administration Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={() => navigate("/calendar")}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </Button>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="sm:hidden p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Download Data Button */}
        <div className="mb-4 flex justify-end">
          <Button
            onClick={handleDownloadAllData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Data
          </Button>
        </div>

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
                  className="font-medium py-2 px-4 rounded-g shadow-md"
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
                        onChange={(e) =>
                          setNewEmployee((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
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
                        onChange={(e) =>
                          setNewEmployee((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
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
                  {staff.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-secondary/10 rounded-lg gap-3 sm:gap-4 min-w-0"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="bg-gradient-primary p-2 rounded-lg shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-primary truncate">
                            {employee?.username}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {employee?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto shrink-0">
                        <Badge
                          variant={employee.is_active ? "default" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {employee.is_active ? "Active" : "Not Active"}
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
                          {/*<Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const csvData = prepareEmployeeHistoryData([
                                employee,
                              ]);
                              downloadCSV(
                                csvData,
                                `${employee.name.replace(/\s+/g, "-").toLowerCase()}-history-${new Date().toISOString().split("T")[0]}`,
                              );
                              toast({
                                title: "Download Complete",
                                description: `${employee.name}'s history has been downloaded.`,
                              });
                            }}
                            className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                          >
                            <Download className="h-3 w-3" />
                          </Button>*/}
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
                          {log.action} {log.desk !== "-" && `at ${log.desk}`}
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
            {/* Desk grid using cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {desks.map((desk) => (
                <Card
                  key={desk.id}
                  className="transition-all duration-300 cursor-pointer hover:shadow-custom-md border-2"
                  onClick={() => handleDeskClick(desk)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div>
                          <h4 className="font-semibold text-primary text-sm">
                            {desk.name}
                          </h4>
                        </div>
                      </div>

                      <Badge
                        className={`text-xs ${
                          desk.status === "available"
                            ? "bg-success text-success-foreground"
                            : desk.status === "unavailable"
                              ? "bg-destructive text-destructive-foreground"
                              : desk.status === "booked"
                                ? "bg-warning text-warning-foreground"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {desk.status.charAt(0).toUpperCase() +
                          desk.status.slice(1)}
                      </Badge>
                    </div>

                    {desk.currentUser && (
                      <div className="text-xs text-muted-foreground">
                        Current user: {desk.currentUser}
                      </div>
                    )}

                    {desk.status === "available" && (
                      <div className="text-xs text-success mt-1">
                        Ready for booking
                      </div>
                    )}
                  </CardContent>
                </Card>
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
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === employeeId ? { ...emp, ...updatedData } : emp,
            ),
          );
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
