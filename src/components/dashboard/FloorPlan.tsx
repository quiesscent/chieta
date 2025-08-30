import { useState } from "react";
import floorPlanImage from "@/assets/office-floorplan.jpg";

interface Desk {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  status: 'available' | 'unavailable' | 'booked' | 'inactive';
}

interface FloorPlanProps {
  onDeskClick: (deskId: string, status: string) => void;
  userBookings?: Array<{ deskId: string; status: string }>;
}

export const FloorPlan = ({ onDeskClick, userBookings = [] }: FloorPlanProps) => {
  // Sample desk layout - in a real app, this would come from your backend
  const [desks] = useState<Desk[]>([
    // Row 1
    { id: "D-01", x: 15, y: 20, status: 'available' },
    { id: "D-02", x: 25, y: 20, status: 'unavailable' },
    { id: "D-03", x: 35, y: 20, status: 'available' },
    { id: "D-04", x: 45, y: 20, status: 'available' },
    { id: "D-05", x: 55, y: 20, status: 'unavailable' },
    { id: "D-06", x: 65, y: 20, status: 'available' },
    { id: "D-07", x: 75, y: 20, status: 'inactive' },
    { id: "D-08", x: 85, y: 20, status: 'available' },

    // Row 2
    { id: "D-09", x: 15, y: 35, status: 'available' },
    { id: "D-10", x: 25, y: 35, status: 'available' },
    { id: "D-11", x: 35, y: 35, status: 'unavailable' },
    { id: "D-12", x: 45, y: 35, status: 'available' },
    { id: "D-13", x: 55, y: 35, status: 'available' },
    { id: "D-14", x: 65, y: 35, status: 'unavailable' },
    { id: "D-15", x: 75, y: 35, status: 'booked' },
    { id: "D-16", x: 85, y: 35, status: 'available' },

    // Row 3
    { id: "D-17", x: 15, y: 50, status: 'available' },
    { id: "D-18", x: 25, y: 50, status: 'available' },
    { id: "D-19", x: 35, y: 50, status: 'available' },
    { id: "D-20", x: 45, y: 50, status: 'inactive' },
    { id: "D-21", x: 55, y: 50, status: 'available' },
    { id: "D-22", x: 65, y: 50, status: 'unavailable' },
    { id: "D-23", x: 75, y: 50, status: 'available' },
    { id: "D-24", x: 85, y: 50, status: 'available' },

    // Row 4
    { id: "D-25", x: 15, y: 65, status: 'available' },
    { id: "D-26", x: 25, y: 65, status: 'available' },
    { id: "D-27", x: 35, y: 65, status: 'unavailable' },
    { id: "D-28", x: 45, y: 65, status: 'available' },
    { id: "D-29", x: 55, y: 65, status: 'available' },
    { id: "D-30", x: 65, y: 65, status: 'available' },
    { id: "D-31", x: 75, y: 65, status: 'unavailable' },
    { id: "D-32", x: 85, y: 65, status: 'available' },
  ]);

  const getDeskStatus = (desk: Desk) => {
    // Check if this desk is booked by the current user
    const userBooking = userBookings.find(booking => 
      booking.deskId === desk.id && 
      (booking.status === 'reserved' || booking.status === 'checked-in')
    );
    
    if (userBooking) {
      return userBooking.status === 'checked-in' ? 'checked-in' : 'booked';
    }
    
    return desk.status;
  };

  const getDeskColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-desk-available hover:bg-green-600 border-green-600';
      case 'unavailable':
        return 'bg-desk-unavailable border-red-600';
      case 'booked':
        return 'bg-desk-booked border-orange-600';
      case 'checked-in':
        return 'bg-blue-500 border-blue-600';
      case 'inactive':
        return 'bg-desk-inactive border-gray-500';
      default:
        return 'bg-gray-300 border-gray-400';
    }
  };

  const getDeskCursor = (status: string) => {
    return status === 'available' || status === 'booked' ? 'cursor-pointer' : 'cursor-not-allowed';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Floor plan image */}
      <div className="relative overflow-x-auto pb-4">
        <div className="min-w-[800px] relative">
          <img
            src={floorPlanImage}
            alt="Office floor plan"
            className="w-full h-auto rounded-lg shadow-custom-sm"
          />
          
          {/* Desk markers */}
          {desks.map((desk) => {
            const status = getDeskStatus(desk);
            return (
              <button
                key={desk.id}
                className={`absolute w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-125 hover:shadow-custom-lg hover:z-10 focus:scale-125 focus:shadow-custom-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center text-xs font-bold text-white shadow-md animate-bounce-in interactive-element ${getDeskColor(status)} ${getDeskCursor(status)}`}
                style={{
                  left: `${desk.x}%`,
                  top: `${desk.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${Math.random() * 0.5}s`
                }}
                onClick={() => onDeskClick(desk.id, status)}
                title={`Desk ${desk.id} - ${status}`}
                disabled={status === 'unavailable' || status === 'inactive'}
              >
                {desk.id.split('-')[1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-desk-available border-2 border-green-600"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-desk-unavailable border-2 border-red-600"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-desk-booked border-2 border-orange-600"></div>
          <span>Your Booking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-600"></div>
          <span>Checked In</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-desk-inactive border-2 border-gray-500"></div>
          <span>Inactive</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-muted-foreground text-sm animate-fade-in">
        <p className="mb-2">
          Click on available desks (green) to book them. Orange desks are your current bookings.
        </p>
        {userBookings.some(b => b.status === 'reserved') && (
          <p className="animate-pulse-soft text-warning font-medium bg-warning/10 px-4 py-2 rounded-lg inline-block">
            Connect to office WiFi to automatically check in to your reserved desks.
          </p>
        )}
        <div className="mt-2 text-xs text-muted-foreground/60">
          💡 <span className="hidden sm:inline">Tap and hold on mobile or </span>
          Hover over desks for more details
        </div>
      </div>
    </div>
  );
};