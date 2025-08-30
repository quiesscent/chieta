import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Calendar, Clock, Wifi } from "lucide-react";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    deskId: string;
    date: string;
    time: string;
    type: 'desk' | 'office';
  } | null;
}

export const BookingConfirmationModal = ({ 
  isOpen, 
  onClose, 
  bookingDetails 
}: BookingConfirmationModalProps) => {
  if (!bookingDetails) return null;

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-success">
            <div className="bg-gradient-to-r from-success to-success/80 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <span>Booking Confirmed!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Success Message */}
          <div className="text-center animate-fade-in">
            <p className="text-muted-foreground">
              Your {bookingDetails.type} has been successfully reserved.
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-gradient-card rounded-lg p-4 space-y-4 border border-success/20 animate-slide-up">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-primary">Booking Details</h4>
              <Badge className="bg-success text-success-foreground">
                Reserved
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    {bookingDetails.type === 'office' ? 'Office' : 'Desk'} {bookingDetails.deskId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bookingDetails.type === 'office' ? 'Executive Suite' : 'Open Floor Plan'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{formatDate(bookingDetails.date)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(bookingDetails.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{bookingDetails.time}</p>
                  <p className="text-sm text-muted-foreground">Start time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Check-in Instructions */}
          <div className="bg-primary/5 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start space-x-3">
              <Wifi className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h5 className="font-medium text-primary mb-1">Check-in Instructions</h5>
                <p className="text-sm text-muted-foreground">
                  Connect to the office WiFi network when you arrive to automatically check in to your reserved {bookingDetails.type}.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-primary hover:shadow-custom-md"
          >
            Got it, thanks!
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-xs text-center text-muted-foreground bg-muted/20 rounded-lg p-3">
          <p>You can view and manage your bookings from the dashboard.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};