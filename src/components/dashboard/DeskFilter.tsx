import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DeskFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  deskCounts: {
    all: number;
    available: number;
    reserved: number;
    booked: number;
    'checked-in': number;
    inactive: number;
  };
}

export const DeskFilter = ({ selectedFilter, onFilterChange, deskCounts }: DeskFilterProps) => {
  const filters = [
    { key: 'all', label: 'All Desks', count: deskCounts.all },
    { key: 'available', label: 'Available', count: deskCounts.available },
    { key: 'reserved', label: 'Reserved', count: deskCounts.reserved },
    { key: 'booked', label: 'Booked', count: deskCounts.booked },
    { key: 'checked-in', label: 'Checked In', count: deskCounts['checked-in'] },
    { key: 'inactive', label: 'Inactive', count: deskCounts.inactive },
  ];

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={selectedFilter === filter.key ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
        >
          <span className="whitespace-nowrap">{filter.label}</span>
          <Badge 
            variant="secondary" 
            className="ml-0.5 sm:ml-1 text-xs bg-white/20 text-current px-1 py-0"
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};