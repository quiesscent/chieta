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
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={selectedFilter === filter.key ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className="flex items-center space-x-2"
        >
          <span>{filter.label}</span>
          <Badge 
            variant="secondary" 
            className="ml-1 text-xs bg-white/20 text-current"
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};