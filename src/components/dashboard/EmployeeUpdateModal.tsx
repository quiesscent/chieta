import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  loginFrequency: number;
  status: string;
}

interface EmployeeUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee;
  onUpdate: (employeeId: string, updatedData: Partial<Employee>) => void;
}

export const EmployeeUpdateModal = ({
  isOpen,
  onClose,
  employee,
  onUpdate
}: EmployeeUpdateModalProps) => {
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Update form data when employee changes
  useState(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
      });
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!employee || !validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUpdate(employee.id, formData);
    
    toast({
      title: "Employee Updated",
      description: `${formData.name}'s information has been updated successfully.`,
    });
    
    setIsLoading(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleClose = () => {
    setFormData({
      name: employee?.name || "",
      email: employee?.email || "",
    });
    setErrors({});
    onClose();
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <Edit className="h-5 w-5 mr-2" />
            Update Employee Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                Full Name {errors.name && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={`border-primary/20 focus:border-primary transition-all duration-300 ${
                  errors.name 
                    ? "border-destructive focus:border-destructive animate-shake" 
                    : "hover:border-primary/40"
                }`}
                placeholder="Enter employee name"
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
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`border-primary/20 focus:border-primary transition-all duration-300 ${
                  errors.email 
                    ? "border-destructive focus:border-destructive animate-shake" 
                    : "hover:border-primary/40"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1 animate-fade-in">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Current Information Display */}
          <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">Current Information</h4>
            <div className="text-sm space-y-1">
              <p><strong>ID:</strong> {employee.id}</p>
              <p><strong>Status:</strong> <span className={`capitalize ${employee.status === 'active' ? 'text-success' : 'text-muted-foreground'}`}>{employee.status}</span></p>
              <p><strong>Login Frequency:</strong> {employee.loginFrequency} times/month</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-primary hover:shadow-custom-md"
              loading={isLoading}
              disabled={isLoading || !formData.name.trim() || !formData.email.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Updating..." : "Update Employee"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>

          {/* Note */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Note:</p>
            <p>Updating employee information will send a notification email to the employee about the changes.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};