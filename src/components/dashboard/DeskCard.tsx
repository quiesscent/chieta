import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Wifi } from "lucide-react";

interface DeskCardProps {
  desk: {
    id: string;
    type: 'desk' | 'office';
    status: 'available' | 'unavailable' | 'reserved' | 'booked' | 'checked-in' | 'inactive';
    capacity?: number;
    bookedBy?: string; // Add bookedBy for display
  };
  onClick: (deskId: string, status: string) => void;
  bookedBy?: string; // Pass bookedBy from parent
}

export const DeskCard = ({ desk, onClick, bookedBy }: DeskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'unavailable':
        return 'bg-destructive text-destructive-foreground';
      case 'reserved':
        return 'bg-warning text-warning-foreground';
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

  const getCardStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-success/20 hover:border-success hover:shadow-custom-md cursor-pointer';
      case 'unavailable':
        return 'border-destructive/20 cursor-not-allowed opacity-60';
      case 'reserved':
      case 'booked':
        return 'border-warning/20 hover:border-warning cursor-pointer';
      case 'checked-in':
        return 'border-primary/20';
      case 'inactive':
        return 'border-muted cursor-not-allowed opacity-60';
      default:
        return 'border-muted';
    }
  };

  const isClickable = desk.status === 'available' || desk.status === 'reserved' || desk.status === 'booked';

  return (
    <Card 
      className={`transition-all duration-300 ${getCardStyle(desk.status)}`}
      onClick={isClickable ? () => onClick(desk.id, desk.status) : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-1.5 rounded-lg">
              {desk.type === 'office' ? (
                <Users className="h-4 w-4 text-primary-foreground" />
              ) : (
                <MapPin className="h-4 w-4 text-primary-foreground" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-primary text-sm">
                {desk.type === 'office' ? `Office ${desk.id}` : `Desk ${desk.id}`}
              </h4>
              {desk.capacity && (
                <p className="text-xs text-muted-foreground">
                  Capacity: {desk.capacity} {desk.capacity === 1 ? 'person' : 'people'}
                </p>
              )}
              {/* Show who booked if reserved/booked */}
              {(desk.status === 'reserved' || desk.status === 'booked') && bookedBy && (
                <p className="text-xs text-warning-foreground mt-1">Booked by: {bookedBy}</p>
              )}
            </div>
          </div>
          
          <Badge className={`text-xs ${getStatusColor(desk.status)}`}>
            {desk.status === 'checked-in' ? 'Checked In' : 
             desk.status === 'reserved' ? 'Reserved' :
             desk.status === 'booked' ? 'Booked' :
             desk.status === 'available' ? 'Available' : 
             desk.status === 'unavailable' ? 'Unavailable' : 'Inactive'}
          </Badge>
        </div>

        {desk.status === 'available' && (
          <div className="flex items-center space-x-1 text-xs text-success">
            <Wifi className="h-3 w-3" />
            <span>Ready to book</span>
          </div>
        )}

        {(desk.status === 'reserved' || desk.status === 'booked') && (
          <div className="text-xs text-muted-foreground">
            Connect to office WiFi to check in
          </div>
        )}

        {desk.status === 'checked-in' && (
          <div className="flex items-center space-x-1 text-xs text-primary">
            <Wifi className="h-3 w-3" />
            <span>Currently in use</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};