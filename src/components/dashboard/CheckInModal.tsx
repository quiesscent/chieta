import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wifi, WifiOff, CheckCircle, AlertTriangle, MapPin } from "lucide-react";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  onCheckIn: (bookingId: string) => void;
}

export const CheckInModal = ({
  isOpen,
  onClose,
  booking,
  onCheckIn
}: CheckInModalProps) => {
  const [isConnectedToWifi, setIsConnectedToWifi] = useState(false);
  const [isCheckingWifi, setIsCheckingWifi] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { toast } = useToast();

  // Simulate checking WiFi connection
  useEffect(() => {
    if (isOpen) {
      setIsCheckingWifi(true);
      // Simulate random wifi connection check
      setTimeout(() => {
        setIsConnectedToWifi(Math.random() > 0.5);
        setIsCheckingWifi(false);
      }, 2000);
    }
  }, [isOpen]);

  const handleCheckIn = async () => {
    if (!booking || !isConnectedToWifi) return;
    
    setIsCheckingIn(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onCheckIn(booking.id);
    
    toast({
      title: "Check-in Successful",
      description: `You have successfully checked in to ${booking.deskId}.`,
    });
    
    setIsCheckingIn(false);
    onClose();
  };

  const handleClose = () => {
    setIsCheckingWifi(false);
    setIsCheckingIn(false);
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <div className="bg-gradient-primary p-2 rounded-lg mr-3">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            Check In to {booking.deskId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Booking Info */}
          <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">Booking Details</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Desk:</strong> {booking.deskId}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Status:</strong> <Badge variant="secondary">{booking.status}</Badge></p>
            </div>
          </div>

          {/* WiFi Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {isCheckingWifi ? (
                  <div className="animate-spin p-2 bg-secondary/20 rounded-lg">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                  </div>
                ) : isConnectedToWifi ? (
                  <div className="p-2 bg-success/20 rounded-lg">
                    <Wifi className="h-4 w-4 text-success" />
                  </div>
                ) : (
                  <div className="p-2 bg-destructive/20 rounded-lg">
                    <WifiOff className="h-4 w-4 text-destructive" />
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {isCheckingWifi ? "Checking WiFi..." : "Office Network Connection"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isCheckingWifi ? "Detecting office network..." : 
                     isConnectedToWifi ? "Connected to office WiFi" : "Not connected to office WiFi"}
                  </p>
                </div>
              </div>
              {!isCheckingWifi && (
                <div className="flex items-center">
                  {isConnectedToWifi ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                </div>
              )}
            </div>

            {!isCheckingWifi && !isConnectedToWifi && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm text-destructive">
                    <p className="font-medium">Unable to check in</p>
                    <p>You must be connected to the office WiFi network to check in to your booking.</p>
                  </div>
                </div>
              </div>
            )}

            {!isCheckingWifi && isConnectedToWifi && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  <div className="text-sm text-success">
                    <p className="font-medium">Ready to check in</p>
                    <p>You are connected to the office network and can proceed with check-in.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {isConnectedToWifi && !isCheckingWifi && (
              <Button 
                onClick={handleCheckIn}
                variant="default"
                className="flex-1 font-medium py-2 px-4 rounded-lg shadow-md"
                loading={isCheckingIn}
                disabled={isCheckingIn}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isCheckingIn ? "Checking In..." : "Check In Now"}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isCheckingIn}
            >
              {isConnectedToWifi && !isCheckingWifi ? "Cancel" : "Close"}
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Check-in Instructions:</p>
            <ul className="space-y-1">
              <li>• Ensure you are physically in the office</li>
              <li>• Connect to the office WiFi network</li>
              <li>• Click "Check In Now" to confirm your presence</li>
              <li>• Your booking status will be updated to "Checked In"</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};