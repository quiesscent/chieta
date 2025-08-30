import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-office.jpg";

export const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern office workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/80 to-primary-light/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Book Your Perfect
            <span className="block text-secondary bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 mt-2 inline-block">
              Workspace
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline your office desk booking experience with our intuitive platform. 
            Reserve, manage, and optimize your workspace effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold shadow-custom-lg hover:shadow-custom-xl transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50"
              onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Calendar className="h-8 w-8 text-white mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Easy Booking</h3>
              <p className="text-white/80">Book desks instantly with our intuitive calendar interface</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <MapPin className="h-8 w-8 text-white mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Floor Plans</h3>
              <p className="text-white/80">Interactive office layouts with real-time availability</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Users className="h-8 w-8 text-white mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Team Management</h3>
              <p className="text-white/80">Comprehensive admin tools for office management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};