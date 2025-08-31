import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Calendar,
  Activity,
  UserCheck,
  UserX,
  Eye
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  loginFrequency: number;
  status: string;
  joinDate?: string;
  lastLogin?: string;
  totalBookings?: number;
}

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee;
  onStatusUpdate: (employeeId: string, newStatus: string) => void;
}

export const EmployeeDetailsModal = ({
  isOpen,
  onClose,
  employee,
  onStatusUpdate
}: EmployeeDetailsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!employee) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onStatusUpdate(employee.id, newStatus);
    
    toast({
      title: "Employee Status Updated",
      description: `${employee.name} has been ${newStatus === 'active' ? 'activated' : 'suspended'}.`,
    });
    
    setIsLoading(false);
    onClose();
  };

  // Mock additional data for demo
  const mockData = {
    joinDate: "2023-06-15",
    lastLogin: "2024-01-15 09:30:00",
    totalBookings: Math.floor(Math.random() * 50) + 10,
    department: "Engineering",
    position: "Software Developer",
    recentActivity: [
      { action: "Checked in", desk: "OP-15", time: "09:30", date: "2024-01-15" },
      { action: "Booked desk", desk: "OP-22", time: "14:20", date: "2024-01-14" },
      { action: "Checked out", desk: "OP-08", time: "18:00", date: "2024-01-14" },
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <Eye className="h-5 w-5 mr-2" />
            Employee Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Employee Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-3 rounded-lg">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{mockData.position}</p>
                <p className="text-xs text-muted-foreground">{mockData.department}</p>
              </div>
            </div>
            <Badge 
              variant={employee.status === 'active' ? 'default' : 'secondary'}
              className="w-fit"
            >
              {employee.status === 'active' ? 'Active' : 'Suspended'}
            </Badge>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined: {mockData.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-primary">Activity Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-secondary/20 rounded-lg">
                  <div className="text-lg font-bold text-primary">{employee.loginFrequency}</div>
                  <div className="text-xs text-muted-foreground">Monthly Logins</div>
                </div>
                <div className="text-center p-3 bg-secondary/20 rounded-lg">
                  <div className="text-lg font-bold text-primary">{mockData.totalBookings}</div>
                  <div className="text-xs text-muted-foreground">Total Bookings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="font-semibold text-primary mb-3">Recent Activity</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mockData.recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-primary p-1.5 rounded">
                      <Activity className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      {activity.desk !== "-" && (
                        <p className="text-xs text-muted-foreground">
                          Desk {activity.desk}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <p>{activity.date}</p>
                    <p>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last Login */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Last Login:</strong> {new Date(mockData.lastLogin).toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
            {employee.status === 'active' ? (
              <Button 
                variant="destructive"
                onClick={() => handleStatusUpdate('inactive')}
                className="flex-1"
                loading={isLoading}
                disabled={isLoading}
              >
                <UserX className="h-4 w-4 mr-2" />
                Suspend Employee
              </Button>
            ) : (
              <Button 
                onClick={() => handleStatusUpdate('active')}
                className="flex-1"
                loading={isLoading}
                disabled={isLoading}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Activate Employee
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};