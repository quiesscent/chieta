import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Wifi, 
  BarChart3, 
  Clock,
  Shield,
  Smartphone
} from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: Calendar,
      title: "Smart Desk Booking",
      description: "Book desks instantly with our intuitive calendar system. Choose from today or tomorrow with real-time availability updates.",
    },
    {
      icon: MapPin,
      title: "Interactive Floor Plans",
      description: "Visual office layouts with color-coded desk status. Green for available, red for unavailable, orange for booked, grey for inactive.",
    },
    {
      icon: Wifi,
      title: "WiFi Check-in System",
      description: "Automatic check-in when connected to office WiFi. Your booking status updates from 'reserved' to 'checked in' seamlessly.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Comprehensive analytics for both users and admins. Track office visits, booking patterns, and space utilization.",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Admin dashboard to manage employees, desk statuses, and view real-time user activity logs.",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Live desk availability and booking status updates. Never double-book or lose your reservation.",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Role-based access control with separate user and admin dashboards for optimal security and functionality.",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Fully responsive design that works perfectly on desktop, tablet, and mobile devices for booking on-the-go.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Everything You Need for Workspace Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools necessary for efficient 
            desk booking and office space management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className="relative overflow-hidden group hover:shadow-custom-lg transition-all duration-300 animate-fade-in border-primary/10 hover:border-primary/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg font-semibold text-primary">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card rounded-2xl p-8 shadow-custom-md">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Ready to Transform Your Workspace?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join companies worldwide who have streamlined their office management 
              with our intuitive desk booking platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:shadow-custom-md transition-all duration-300"
              >
                Request Demo
              </button>
              <button 
                onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};