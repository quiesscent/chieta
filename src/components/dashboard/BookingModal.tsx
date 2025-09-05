import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin } from "lucide-react";
import { bookDesks, getProfile } from "@/services/apiClient";
import { useToast } from "@/hooks/use-toast";
import { resolvePath } from "react-router-dom";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  deskId: any;
  status: string;
  deskType?: string;
  deskName: string | null;
  onConfirm: (
    deskId: string,
    date: string,
    time: string,
    type: "desk" | "office",
  ) => void;
  isBoardRoom?: boolean; // Add prop for board room
}

export const BookingModal = ({
  isOpen,
  onClose,
  deskId,
  status,
  deskName,
  deskType = "desk",
  onConfirm,
  isBoardRoom = false,
}: BookingModalProps) => {
  // For board room, allow any date from today onwards
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch Profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const formatDisplayDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const timeSlots = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
  ];

  const handleConfirm = async () => {
    if (deskId && selectedDate && selectedTime) {
      setIsLoading(true);

      const data = {
        desk_name: deskId.name,
        selected_date: selectedDate,
        selected_time: selectedTime,
      };

      console.log(data);

      try {
        const res = await bookDesks(data);
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log(resolvePath);

        onConfirm(deskId.id, selectedDate, selectedTime, deskId?.isBooked);
        setIsLoading(false);
      } catch (err) {
        onClose();
        toast({
          title: "You can not have two bookings at once",
          description: err.message.error,
          variant: "destructive",
        });
      }

      // Reset form
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  const handleClose = () => {
    setSelectedDate("");
    setSelectedTime("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-primary">
            <span>Book {deskId?.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div
            className="space-y-3 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Label className="text-base font-medium flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Select Date</span>
            </Label>
            {deskId?.type === "office" || isBoardRoom ? (
              <input
                type="date"
                min={formatDate(today)}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1 w-full border-primary/20 focus:border-primary"
                disabled={isLoading}
              />
            ) : deskId?.type === "Open Floor Plan" ? (
              <Select
                value={selectedDate}
                onValueChange={setSelectedDate}
                disabled={isLoading}
              >
                <SelectTrigger className="border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40">
                  <SelectValue placeholder="Choose a date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={formatDate(today)}>
                    Today - {formatDisplayDate(today)}
                  </SelectItem>
                  <SelectItem
                    value={formatDate(new Date(today.getTime() + 86400000))}
                  >
                    Tomorrow -{" "}
                    {formatDisplayDate(new Date(today.getTime() + 86400000))}
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              // Calendar for other desk types (non-open floor, non-office, non-boardroom)
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1 w-full border-primary/20 focus:border-primary"
                disabled={isLoading}
              />
            )}
          </div>

          {/* Time Selection */}
          <div
            className="space-y-3 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Label className="text-base font-medium flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Select Time</span>
            </Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              disabled={isLoading}
            >
              <SelectTrigger className="border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40">
                <SelectValue placeholder="Choose a time" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-gradient-card rounded-lg p-4 space-y-2 animate-fade-in border border-primary/10">
              <h4 className="font-medium text-primary">Booking Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>{deskType === "office" ? "Office" : "Desk"}:</strong>{" "}
                  {deskId.name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDisplayDate(new Date(selectedDate))}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className="flex space-x-3 pt-4 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime || isLoading}
              variant="default"
              className="flex-1 font-medium py-2 px-4 rounded-lg shadow-md"
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3 animate-fade-in">
          <p className="font-medium mb-1">Booking Policy:</p>
          <ul className="space-y-1">
            {isBoardRoom ? (
              <>
                <li>
                  • Bookings can be made for any future date from today onwards
                </li>
                <li>• Connect to office WiFi to automatically check in</li>
                <li>• Cancel bookings at least 2 hours in advance</li>
              </>
            ) : (
              <>
                <li>• Bookings can only be made for today or tomorrow</li>
                <li>• Connect to office WiFi to automatically check in</li>
                <li>• Cancel bookings at least 2 hours in advance</li>
              </>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
