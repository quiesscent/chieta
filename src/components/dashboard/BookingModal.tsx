import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  deskId: string | null;
  deskType?: 'desk' | 'office';
  onConfirm: (deskId: string, date: string, time: string, type: 'desk' | 'office') => void;
}

export const BookingModal = ({ isOpen, onClose, deskId, deskType = 'desk', onConfirm }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
    "06:00 PM"
  ];

  const handleConfirm = async () => {
    if (deskId && selectedDate && selectedTime) {
      setIsLoading(true);
      
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onConfirm(deskId, selectedDate, selectedTime, deskType);
      
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setIsLoading(false);
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
            <div className="bg-gradient-primary p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>Book {deskType === 'office' ? 'Office' : 'Desk'} {deskId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Label className="text-base font-medium flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Select Date</span>
            </Label>
            <Select value={selectedDate} onValueChange={setSelectedDate} disabled={isLoading}>
              <SelectTrigger className="border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40">
                <SelectValue placeholder="Choose a date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={formatDate(today)}>
                  Today - {formatDisplayDate(today)}
                </SelectItem>
                <SelectItem value={formatDate(tomorrow)}>
                  Tomorrow - {formatDisplayDate(tomorrow)}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Label className="text-base font-medium flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Select Time</span>
            </Label>
            <Select value={selectedTime} onValueChange={setSelectedTime} disabled={isLoading}>
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
                <p><strong>{deskType === 'office' ? 'Office' : 'Desk'}:</strong> {deskId}</p>
                <p><strong>Date:</strong> {selectedDate === formatDate(today) ? 'Today' : 'Tomorrow'}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
              disabled={!selectedDate || !selectedTime}
              loading={isLoading}
              className="flex-1 bg-gradient-primary hover:shadow-custom-md"
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3 animate-fade-in">
          <p className="font-medium mb-1">Booking Policy:</p>
          <ul className="space-y-1">
            <li>• Bookings can only be made for today or tomorrow</li>
            <li>• Connect to office WiFi to automatically check in</li>
            <li>• Cancel bookings at least 2 hours in advance</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};