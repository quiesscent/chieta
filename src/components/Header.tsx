import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import chietaLogo from "@/assets/chieta-logo.jpeg";
import {
  User,
  Mail,
  Building,
  Calendar,
  MapPin,
  TrendingUp,
  ArrowLeft,
  Edit,
  Save,
  BarChart3,
  Wifi,
  WifiOff,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isConnectedToWifi, setIsConnectedToWifi] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate WiFi connection check
  useEffect(() => {
    const allowedIPs = ["105.163.156.44", "62.8.71.171"];

    const checkwifi = async () => {
      try {
        // Fetch public IP
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();

        // Compare the api
        const connected = allowedIPs.includes(data.ip);
        setIsConnectedToWifi(connected);
      } catch (error) {
        console.error("Failed to check Wifi/IP:", error);
        setIsConnectedToWifi(false);
      }
    };

    checkwifi();
    const interval = setInterval(checkwifi, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isConnectedToWifi) {
    }
  }, [isConnectedToWifi]);

  const handleLogout = () => {
    localStorage.removeItem("chieta_user_token");
    localStorage.removeItem("chieta_user_refresh");

    toast({
      title: "Successfully Logged Out",
      description: "See you next time!",
    });
    navigate("/");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-border shadow-custom-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg flex items-center">
                <button onClick={() => navigate("/dashboard")}>
                  <img
                    src={chietaLogo}
                    alt="Chieta Logo"
                    className="h-10 w-15 mr-2"
                  />{" "}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* WiFi Status */}
              <div className="hidden sm:flex items-center space-x-2">
                {isConnectedToWifi ? (
                  <div className="flex items-center space-x-1 text-success">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm font-medium">Office WiFi</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-warning">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-sm font-medium">No WiFi</span>
                  </div>
                )}
              </div>

              {/* Mobile WiFi Status */}
              <div className="sm:hidden">
                {isConnectedToWifi ? (
                  <Wifi className="h-4 w-4 text-success" />
                ) : (
                  <WifiOff className="h-4 w-4 text-warning" />
                )}
              </div>

              <button onClick={() => navigate("/calendar")}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </Button>
              </button>

              <button onClick={() => navigate("/profile")}>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" className="sm:hidden p-2">
                  <User className="h-4 w-4" />
                </Button>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="sm:hidden p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
