import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import floorplan from "@/assets/plan.png";
interface Desk {
  id: string;
  x: number;
  y: number;
  type: "regular" | "executive";
  isActive: boolean;
  isBooked: boolean;
  bookedBy?: string;
  section: string;
  floor: string;
}

import { ReactSVGPanZoom, TOOL_NONE } from "react-svg-pan-zoom";

interface FloorPlanProps {
  onDeskSelect: (deskId: string) => void;
  selectedDesk: string | null;
  currentBooking: { deskId: string; date: string } | null;
}

const FloorPlan = ({
  onDeskSelect,
  selectedDesk,
  currentBooking,
}: FloorPlanProps) => {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [hoveredDesk, setHoveredDesk] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<string>("open-floor");

  const floors = [
    { id: "open-floor", name: "Open Floor", icon: "🏢" },
    { id: "executive-suite", name: "Executive Suite", icon: "👔" },
  ];

  // Initialize desk layout
  useEffect(() => {
    const generateDesks = (): Desk[] => {
      const deskLayout: Desk[] = [];

      // Open Floor desks (53 total)
      // Row 1 (top) - 12 desks
      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 155,
          y: 292,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 300,
          y: 285,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 502,
          y: 304,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 502,
          y: 255,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 502,
          y: 200,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      // top plan
      for (let i = 0; i < 3; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 547 + i * 26,
          y: 210,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 3; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 547 + i * 26,
          y: 243,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 3; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 547 + i * 26,
          y: 304,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 3; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 547 + i * 26,
          y: 274,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 559 + i * 26,
          y: 336,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 559 + i * 26,
          y: 366,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 3; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 547 + i * 26,
          y: 210,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      // top plan col 2
      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 639 + i * 26,
          y: 210,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 639 + i * 26,
          y: 243,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 639 + i * 26,
          y: 274,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 639 + i * 26,
          y: 304,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 639 + i * 26,
          y: 336,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 639 + i * 26,
          y: 366,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      // column 3
      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 698 + i * 26,
          y: 210,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 698 + i * 26,
          y: 243,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 698 + i * 26,
          y: 274,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 698 + i * 26,
          y: 304,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 698 + i * 26,
          y: 336,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 698 + i * 26,
          y: 366,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      // column 4
      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 781 + i * 26,
          y: 210,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 781 + i * 26,
          y: 243,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 781 + i * 26,
          y: 274,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 781 + i * 26,
          y: 304,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 781 + i * 26,
          y: 336,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 2; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 781 + i * 26,
          y: 366,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      // single rooms

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 839,
          y: 466,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 200,
          y: 440,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 190,
          y: 485,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 125,
          y: 470,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 87,
          y: 450,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 35,
          y: 420,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 230,
          y: 370,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      for (let i = 0; i < 1; i++) {
        deskLayout.push({
          id: `OF-R1-${i + 1}`,
          x: 165,
          y: 370,
          type: "regular",
          isActive: true,
          isBooked: Math.random() > 0.7,
          section: "Open Floor - North",
          floor: "open-floor",
        });
      }

      // for (let i = 0; i < 10; i++) {
      //   deskLayout.push({
      //     id: `OF-R1-${i + 1}`,
      //     x: 547 + i * 30,
      //     y: 400,
      //     type: "regular",
      //     isActive: true,
      //     isBooked: Math.random() > 0.7,
      //     section: "Open Floor - North",
      //     floor: "open-floor",
      //   });
      // }

      // for (let i = 0; i < 10; i++) {
      //   deskLayout.push({
      //     id: `OF-R1-${i + 1}`,
      //     x: 547 + i * 30,
      //     y: 300,
      //     type: "regular",
      //     isActive: true,
      //     isBooked: Math.random() > 0.7,
      //     section: "Open Floor - North",
      //     floor: "open-floor",
      //   });
      // }

      // for (let i = 0; i < 10; i++) {
      //   deskLayout.push({
      //     id: `OF-R1-${i + 1}`,
      //     x: 547 + i * 30,
      //     y: 350,
      //     type: "regular",
      //     isActive: true,
      //     isBooked: Math.random() > 0.7,
      //     section: "Open Floor - North",
      //     floor: "open-floor",
      //   });
      // }

      // for (let i = 0; i < 10; i++) {
      //   deskLayout.push({
      //     id: `OF-R1-${i + 1}`,
      //     x: 547 + i * 30,
      //     y: 450,
      //     h: 30,
      //     w: 20,
      //     type: "regular",
      //     isActive: true,
      //     isBooked: Math.random() > 0.7,
      //     section: "Open Floor - North",
      //     floor: "open-floor",
      //   });
      // }

      // Row 2 - 11 desks
      // for (let i = 0; i < 11; i++) {
      //   deskLayout.push({
      //     id: `OF-R2-${i + 1}`,
      //     x: 130 + i * 60,
      //     y: 200,
      //     type: "regular",
      //     isActive: true,
      //     isBooked: Math.random() > 0.7,
      //     section: "Open Floor - North",
      //     floor: "open-floor",
      //   });
      // }

      // Row 3 - 10 desks
      // for (let i = 0; i < 10; i++) {
      //   deskLayout.push({
      //     id: `OF-R3-${i + 1}`,
      //     x: 160 + i * 60,
      //     y: 280,
      //     type: "regular",
      //     isActive: true,
      //     isBooked: Math.random() > 0.7,
      //     section: "Open Floor - Central",
      //     floor: "open-floor",
      //   });
      // }

      // Row 4 - 10 desks
      // for (let i = 0; i < 1; i++) {
      //   deskLayout.push({
      //     id: `OF-R4-${i + 1}`,
      //     x: 160 + i * 60,
      //     y: 30,
      //     type: "regular",
      //     isActive: true,
      //     isBooked: Math.random() > 0.7,
      //     section: "Open Floor - Central",
      //     floor: "open-floor",
      //   });
      // }

      // Row 5 - 10 desks
      // for (let i = 0; i < 10; i++) {
      //   deskLayout.push({
      //     id: `OF-R5-${i + 1}`,
      //     x: 160 + i * 60,
      //     y: 440,
      //     type: "regular",
      //     isActive: true,
      //     isBooked: Math.random() > 0.7,
      //     section: "Open Floor - South",
      //     floor: "open-floor",
      //   });
      // }

      // Executive suite desks (12 total) - arranged in a more premium layout
      // for (let i = 0; i < 6; i++) {
      //   deskLayout.push({
      //     id: `EX-R1-${i + 1}`,
      //     x: 200 + i * 100,
      //     y: 180,
      //     type: "executive",
      //     isActive: Math.random() > 0.2,
      //     isBooked: Math.random() > 0.8,
      //     section: "Executive Suite - North",
      //     floor: "executive-suite",
      //   });
      // }

      // for (let i = 0; i < 6; i++) {
      //   deskLayout.push({
      //     id: `EX-R2-${i + 1}`,
      //     x: 200 + i * 100,
      //     y: 360,
      //     type: "executive",
      //     isActive: Math.random() > 0.2,
      //     isBooked: Math.random() > 0.8,
      //     section: "Executive Suite - South",
      //     floor: "executive-suite",
      //   });
      // }

      return deskLayout;
    };

    setDesks(generateDesks());
  }, []);

  const Viewer = useRef(null);
  const [value, setValue] = useState(null);
  const [tool, setTool] = useState("auto");

  // Filter desks by active floor
  const currentFloorDesks = desks.filter((desk) => desk.floor === activeFloor);

  const handleDeskClick = (desk: Desk) => {
    if (desk.isActive && !desk.isBooked) {
      onDeskSelect(desk.id);
    }
  };

  const getDeskColor = (desk: Desk) => {
    if (!desk.isActive) return "#E5E7EB";
    if (desk.isBooked || currentBooking?.deskId === desk.id) return "#EF4444";
    if (selectedDesk === desk.id) return "#F59E0B";
    return "#10B981";
  };

  const getDeskStroke = (desk: Desk) => {
    if (selectedDesk === desk.id) return "#D97706";
    if (hoveredDesk === desk.id && desk.isActive && !desk.isBooked)
      return "#059669";
    return "#374151";
  };

  const stats = {
    total: currentFloorDesks.length,
    active: currentFloorDesks.filter((d) => d.isActive).length,
    booked: currentFloorDesks.filter((d) => d.isBooked).length,
    available: currentFloorDesks.filter((d) => d.isActive && !d.isBooked)
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Legend and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm text-gray-600">
              Available ({stats.available})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">
              Booked ({stats.booked})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-600">Inactive</span>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {stats.active} of {stats.total} desks active
        </Badge>
      </div>

      {/* Floor Plan SVG */}
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <ReactSVGPanZoom
          ref={Viewer}
          width={900}
          height={400}
          tool={tool}
          onChangeTool={setTool}
          value={value}
          onChangeValue={setValue}
          detectAutoPan={false}
        >
          <TooltipProvider>
            <svg
              width="900"
              height="600"
              viewBox="0 0 100% 100%"
              className="h-auto min-w-[900px]"
            >
              {/* Background Image */}
              <image
                href={floorplan} // your image file
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Render Current Floor Desks */}
              {currentFloorDesks.map((desk) => (
                <Tooltip key={desk.id}>
                  <TooltipTrigger asChild>
                    <g
                      onClick={() => handleDeskClick(desk)}
                      onMouseEnter={() => setHoveredDesk(desk.id)}
                      onMouseLeave={() => setHoveredDesk(null)}
                      className={`cursor-pointer transition-all duration-200 ${
                        desk.isActive && !desk.isBooked ? "hover:scale-110" : ""
                      }`}
                      style={{ transformOrigin: `${desk.x}px ${desk.y}px` }}
                    >
                      {/* Desk */}
                      <rect
                        x={desk.x}
                        y={desk.y}
                        width={19}
                        height={15}
                        fill={getDeskColor(desk)}
                        stroke={getDeskStroke(desk)}
                        strokeWidth={selectedDesk === desk.id ? "3" : "2"}
                        rx="6"
                        className="transition-all duration-200"
                      />

                      {/* Chair */}
                      {/*<rect
                      x={desk.x}
                      y={desk.y}
                      width={24}
                      height={15}
                      fill={desk.isActive ? "#6B7280" : "#D1D5DB"}
                      rx="10"
                    />*/}

                      {/* Desk ID */}
                      {/*<text
                      x={desk.x}
                      y={desk.y}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      className="fill-white text-xs font-semibold pointer-events-none"
                      style={{
                        fontSize: desk.type === "executive" ? "11px" : "9px",
                      }}
                    >
                      {desk.id}
                    </text>*/}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-semibold">{desk.id}</p>
                      <p className="text-sm text-gray-600">{desk.section}</p>
                      <p className="text-sm">
                        Status:{" "}
                        {!desk.isActive
                          ? "Inactive"
                          : desk.isBooked
                            ? "Booked"
                            : "Available"}
                      </p>
                      {desk.type === "executive" && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Executive
                        </Badge>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </svg>
          </TooltipProvider>
        </ReactSVGPanZoom>
      </div>
    </div>
  );
};

export default FloorPlan;
