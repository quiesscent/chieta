import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Settings, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeskManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  desk: {
    id: string;
    type: 'desk' | 'office';
    status: string;
    currentUser?: string;
  } | null;
  onStatusUpdate: (deskId: string, newStatus: string) => void;
}

export const DeskManagementModal = ({ 
  isOpen, 
  onClose, 
  desk,
  onStatusUpdate 
}: DeskManagementModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Reset selected status when modal opens
  useState(() => {
    if (desk) {
      setSelectedStatus(desk.status);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'unavailable':
        return 'bg-destructive text-destructive-foreground';
      case 'booked':
        return 'bg-warning text-warning-foreground';
      case 'checked-in':
        return 'bg-primary text-primary-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleStatusUpdate = async () => {
    if (!desk || selectedStatus === desk.status) {
      onClose();
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onStatusUpdate(desk.id, selectedStatus);
    
    toast({
      title: "Status Updated",
      description: `${desk.type === 'office' ? 'Office' : 'Desk'} ${desk.id} status changed to ${selectedStatus}`,
    });
    
    setIsLoading(false);
    onClose();
  };

  if (!desk) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-primary">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>Manage {desk.type === 'office' ? 'Office' : 'Desk'} {desk.id}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Current Status</Label>
            <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  {desk.type === 'office' ? (
                    <Users className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {desk.type === 'office' ? 'Office' : 'Desk'} {desk.id}
                  </p>
                  {desk.currentUser && (
                    <p className="text-sm text-muted-foreground">
                      Occupied by: {desk.currentUser}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(desk.status)}>
                {desk.status}
              </Badge>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Update Status</Label>
            <Select 
              value={selectedStatus} 
              onValueChange={setSelectedStatus}
              disabled={isLoading}
            >
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                {desk.status === 'booked' && (
                  <SelectItem value="booked">Booked</SelectItem>
                )}
                {desk.status === 'checked-in' && (
                  <SelectItem value="checked-in">Checked In</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {selectedStatus && selectedStatus !== desk.status && (
              <div className="text-sm text-muted-foreground">
                Status will be changed from <strong>{desk.status}</strong> to <strong>{selectedStatus}</strong>
              </div>
            )}
          </div>

          {/* Status Descriptions */}
          <div className="bg-muted/20 rounded-lg p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-2">Status Definitions:</p>
            <ul className="space-y-1">
              <li><strong>Available:</strong> Ready for booking</li>
              <li><strong>Unavailable:</strong> Temporarily out of service</li>
              <li><strong>Inactive:</strong> Permanently disabled</li>
              <li><strong>Booked:</strong> Reserved by a user</li>
              <li><strong>Checked In:</strong> Currently occupied</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              loading={isLoading}
              className="flex-1 bg-gradient-primary"
              disabled={!selectedStatus}
            >
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};