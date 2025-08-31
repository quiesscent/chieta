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
  // Detailed floor plan based on uploaded image - OP-1 to OP-52
  const [desks] = useState<Desk[]>([
    // Top Row (OP-1 to OP-9)
    { id: "OP-01", x: 12, y: 15, status: 'available' },
    { id: "OP-02", x: 18, y: 15, status: 'unavailable' },
    { id: "OP-03", x: 24, y: 15, status: 'available' },
    { id: "OP-04", x: 35, y: 15, status: 'available' },
    { id: "OP-05", x: 41, y: 15, status: 'booked' },
    { id: "OP-06", x: 47, y: 15, status: 'available' },
    { id: "OP-07", x: 53, y: 15, status: 'available' },
    { id: "OP-08", x: 75, y: 15, status: 'available' },
    { id: "OP-09", x: 81, y: 15, status: 'inactive' },

    // Second Row (OP-10 to OP-18)
    { id: "OP-10", x: 12, y: 25, status: 'available' },
    { id: "OP-11", x: 18, y: 25, status: 'available' },
    { id: "OP-12", x: 24, y: 25, status: 'unavailable' },
    { id: "OP-13", x: 35, y: 25, status: 'available' },
    { id: "OP-14", x: 41, y: 25, status: 'available' },
    { id: "OP-15", x: 47, y: 25, status: 'available' },
    { id: "OP-16", x: 53, y: 25, status: 'booked' },
    { id: "OP-17", x: 75, y: 25, status: 'available' },
    { id: "OP-18", x: 81, y: 25, status: 'available' },

    // Third Row (OP-19 to OP-27)
    { id: "OP-19", x: 12, y: 40, status: 'available' },
    { id: "OP-20", x: 18, y: 40, status: 'available' },
    { id: "OP-21", x: 24, y: 40, status: 'available' },
    { id: "OP-22", x: 35, y: 40, status: 'unavailable' },
    { id: "OP-23", x: 41, y: 40, status: 'available' },
    { id: "OP-24", x: 47, y: 40, status: 'available' },
    { id: "OP-25", x: 53, y: 40, status: 'available' },
    { id: "OP-26", x: 75, y: 40, status: 'available' },
    { id: "OP-27", x: 81, y: 40, status: 'inactive' },

    // Fourth Row (OP-28 to OP-36)
    { id: "OP-28", x: 12, y: 50, status: 'available' },
    { id: "OP-29", x: 18, y: 50, status: 'available' },
    { id: "OP-30", x: 24, y: 50, status: 'available' },
    { id: "OP-31", x: 35, y: 50, status: 'available' },
    { id: "OP-32", x: 41, y: 50, status: 'unavailable' },
    { id: "OP-33", x: 47, y: 50, status: 'available' },
    { id: "OP-34", x: 53, y: 50, status: 'available' },
    { id: "OP-35", x: 75, y: 50, status: 'available' },
    { id: "OP-36", x: 81, y: 50, status: 'available' },

    // Fifth Row (OP-37 to OP-44)
    { id: "OP-37", x: 12, y: 65, status: 'available' },
    { id: "OP-38", x: 18, y: 65, status: 'available' },
    { id: "OP-39", x: 35, y: 65, status: 'available' },
    { id: "OP-40", x: 41, y: 65, status: 'booked' },
    { id: "OP-41", x: 47, y: 65, status: 'available' },
    { id: "OP-42", x: 53, y: 65, status: 'available' },
    { id: "OP-43", x: 75, y: 65, status: 'available' },
    { id: "OP-44", x: 81, y: 65, status: 'unavailable' },

    // Bottom Row (OP-45 to OP-52)
    { id: "OP-45", x: 12, y: 75, status: 'available' },
    { id: "OP-46", x: 18, y: 75, status: 'available' },
    { id: "OP-47", x: 35, y: 75, status: 'available' },
    { id: "OP-48", x: 41, y: 75, status: 'available' },
    { id: "OP-49", x: 47, y: 75, status: 'unavailable' },
    { id: "OP-50", x: 53, y: 75, status: 'available' },
    { id: "OP-51", x: 75, y: 75, status: 'available' },
    { id: "OP-52", x: 81, y: 75, status: 'available' },
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
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Floor plan using uploaded image as background */}
      <div className="relative bg-secondary/10 rounded-lg p-2 sm:p-4">
        <div className="relative w-full">
          <img
            src="/lovable-uploads/252dba30-18a2-4579-82c1-e978088cdef6.png"
            alt="Office floor plan with desks OP-1 to OP-52"
            className="w-full h-auto rounded-lg shadow-custom-sm"
          />
          
          {/* Desk markers overlaid on the floor plan */}
          {desks.map((desk) => {
            const status = getDeskStatus(desk);
            return (
              <button
                key={desk.id}
                className={`absolute w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 transition-all duration-300 hover:scale-125 hover:shadow-custom-lg hover:z-10 focus:scale-125 focus:shadow-custom-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center text-xs font-bold text-white shadow-md animate-bounce-in interactive-element ${getDeskColor(status)} ${getDeskCursor(status)}`}
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
                <span className="text-xs font-bold">
                  {desk.id.split('-')[1]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Area Labels */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-xs sm:text-sm font-medium text-primary bg-white/90 px-2 py-1 rounded">
          Wellness Room & Server Room
        </div>
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-xs sm:text-sm font-medium text-primary bg-white/90 px-2 py-1 rounded">
          Lockers & Pause Area
        </div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-xs sm:text-sm font-medium text-primary bg-white/90 px-2 py-1 rounded">
          Hot Desking & Focus Booths
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-medium text-primary bg-white/90 px-2 py-1 rounded">
          Meeting Room & Lobby
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-desk-available border-2 border-green-600"></div>
          <span className="whitespace-nowrap">Available</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-desk-unavailable border-2 border-red-600"></div>
          <span className="whitespace-nowrap">Unavailable</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-desk-booked border-2 border-orange-600"></div>
          <span className="whitespace-nowrap">Your Booking</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 border-2 border-blue-600"></div>
          <span className="whitespace-nowrap">Checked In</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-desk-inactive border-2 border-gray-500"></div>
          <span className="whitespace-nowrap">Inactive</span>
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