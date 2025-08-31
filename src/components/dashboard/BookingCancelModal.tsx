import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface BookingCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  onCancel: (bookingId: string) => void;
}

export const BookingCancelModal = ({
  isOpen,
  onClose,
  booking,
  onCancel
}: BookingCancelModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (!booking) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onCancel(booking.id);
    handleClose();
  };

  const handleClose = () => {
    setIsLoading(false);
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Cancel Booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Booking Info */}
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h4 className="font-semibold text-destructive mb-2">Booking to Cancel</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Desk:</strong> {booking.deskId}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time || "09:00"}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel this booking?
            </p>
            <p className="text-sm font-medium text-destructive">
              This action cannot be undone.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              variant="destructive"
              onClick={handleCancel}
              className="flex-1"
              loading={isLoading}
              disabled={isLoading}
            >
              Yes, Cancel Booking
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Keep Booking
            </Button>
          </div>

          {/* Cancellation Policy */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Cancellation Policy:</p>
            <ul className="space-y-1">
              <li>• Bookings can be cancelled at any time</li>
              <li>• No penalties for cancellations</li>
              <li>• Desk becomes immediately available to others</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};