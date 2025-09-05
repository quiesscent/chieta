import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";
import {
  getBookingTrends,
  getDeskUtilization,
  getWeeklyTrends,
} from "@/services/apiClient";

const weeklyBookingData = [
  { day: "Mon", bookings: 45, checkins: 38 },
  { day: "Tue", bookings: 52, checkins: 47 },
  { day: "Wed", bookings: 48, checkins: 41 },
  { day: "Thu", bookings: 61, checkins: 55 },
  { day: "Fri", bookings: 55, checkins: 50 },
  { day: "Sat", bookings: 23, checkins: 18 },
  { day: "Sun", bookings: 12, checkins: 8 },
];
const deskUtilizationData = [
  { name: "Occupied", value: 45, color: "#ef4444" },
  { name: "Reserved", value: 23, color: "#f97316" },
  { name: "Available", value: 32, color: "#22c55e" },
];

const monthlyTrendsData = [
  { month: "Jan", bookings: 320, utilization: 65 },
  { month: "Feb", bookings: 380, utilization: 72 },
  { month: "Mar", bookings: 425, utilization: 78 },
  { month: "Apr", bookings: 390, utilization: 71 },
  { month: "May", bookings: 445, utilization: 82 },
  { month: "Jun", bookings: 510, utilization: 89 },
];

const COLORS = ["#ef4444", "#f97316", "#22c55e"];

const statusColors: Record<string, string> = {
  Occupied: "#ef4444", // red
  Reserved: "#f97316", // orange
  Available: "#22c55e", // green
};

export const AnalyticsDashboard = () => {
  const [wkly_trends, setWeeklyTrends] = useState([]);
  const [bking_trends, setBookingTrends] = useState([]);
  const [dsk_utilization, setDeskUtilization] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchBookingTrends = async () => {
      try {
        setIsLoading(true);
        const booking_trends = await getBookingTrends();
        const weekly_trends = await getWeeklyTrends();
        const desk_utilization = await getDeskUtilization();
        setBookingTrends(booking_trends);
        setWeeklyTrends(weekly_trends);
        setDeskUtilization(desk_utilization);
      } catch (err) {
        console.error("Failed to fetch Stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingTrends();
  }, []);

  return (
    <div className="space-y-6">
      {/* Weekly Booking Trends */}
      <Card className="shadow-custom-md">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <BarChart3 className="h-5 w-5 mr-2" />
            Weekly Booking Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 sm:h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wkly_trends}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="bookings"
                  fill="hsl(var(--primary))"
                  name="Bookings"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="checkins"
                  fill="hsl(var(--primary) / 0.6)"
                  name="Check-ins"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desk Utilization */}
        <Card className="shadow-custom-md">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <PieIcon className="h-5 w-5 mr-2" />
              Desk Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dsk_utilization}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deskUtilizationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {dsk_utilization?.map((entry) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: statusColors[entry.name] || "#9ca3af",
                    }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="shadow-custom-md">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <TrendingUp className="h-5 w-5 mr-2" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={bking_trends}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    name="Total Bookings"
                  />
                  <Line
                    type="monotone"
                    dataKey="utilization"
                    stroke="hsl(var(--primary) / 0.6)"
                    strokeWidth={3}
                    dot={{
                      fill: "hsl(var(--primary) / 0.6)",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    name="Utilization %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
