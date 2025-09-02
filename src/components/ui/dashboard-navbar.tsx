import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, User, LayoutDashboard, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface DashboardNavbarProps {
  userName: string;
  userRole: 'user' | 'admin';
  onLogout: () => void;
}

export const DashboardNavbar = ({ userName, userRole, onLogout }: DashboardNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = userRole === 'admin' ? [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Calendar", path: "/calendar", icon: Calendar },
  ] : [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Calendar", path: "/calendar", icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="bg-secondary p-1.5 sm:p-2 rounded-lg">
              <img 
                src={require("@/assets/chieta-logo.jpeg")} 
                alt="Chieta Logo" 
                className="h-5 w-5 sm:h-6 sm:w-6" 
              />
            </div>
            <span className="text-lg sm:text-xl font-bold text-primary truncate">
              Chieta Desk System
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
            <div className="flex items-center space-x-3 pl-4 border-l border-border">
              <span className="text-sm text-muted-foreground hidden lg:block">
                Welcome, {userName}
              </span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary p-2"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
              <div className="pt-3 border-t border-border">
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  Welcome, {userName}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};