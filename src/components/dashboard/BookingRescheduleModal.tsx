import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";

interface BookingRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  onReschedule: (bookingId: string, newDate: string, newTime: string) => void;
}

export const BookingRescheduleModal = ({
  isOpen,
  onClose,
  booking,
  onReschedule
}: BookingRescheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
    "17:00", "17:30"
  ];

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !booking) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onReschedule(booking.id, selectedDate, selectedTime);
    handleClose();
  };

  const handleClose = () => {
    setSelectedDate("");
    setSelectedTime("");
    setIsLoading(false);
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <Calendar className="h-5 w-5 mr-2" />
            Reschedule Booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Booking Info */}
          <div className="p-4 bg-secondary/20 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">Current Booking</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Desk:</strong> {booking.deskId}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Date:</strong> {booking.date}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Time:</strong> {booking.time || "09:00"}
            </p>
          </div>

          {/* Date Selection */}
          <div>
            <Label htmlFor="reschedule-date" className="text-sm font-medium mb-2 block">
              New Date
            </Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={formatDate(today)}>
                  Today ({formatDisplayDate(formatDate(today))})
                </SelectItem>
                <SelectItem value={formatDate(tomorrow)}>
                  Tomorrow ({formatDisplayDate(formatDate(tomorrow))})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div>
            <Label htmlFor="reschedule-time" className="text-sm font-medium mb-2 block">
              New Time
            </Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new time" />
              </SelectTrigger>
              <SelectContent className="max-h-48 overflow-y-auto">
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button 
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedTime || isLoading}
              className="flex-1"
              loading={isLoading}
            >
              Reschedule Booking
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          {/* Policy Note */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Rescheduling Policy:</p>
            <ul className="space-y-1">
              <li>• Bookings can only be rescheduled to today or tomorrow</li>
              <li>• Office hours: 8:00 AM - 6:00 PM</li>
              <li>• Changes are effective immediately</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};