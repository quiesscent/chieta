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
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Book Your Perfect
            <span className="block text-secondary bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 mt-1 sm:mt-2 inline-block max-w-full">
              Workspace
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Streamline your office desk booking experience with our intuitive platform. 
            Reserve, manage, and optimize your workspace effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-custom-lg hover:shadow-custom-xl transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50"
              onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white mx-auto mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Easy Booking</h3>
              <p className="text-sm sm:text-base text-white/80">Book desks instantly with our intuitive calendar interface</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-white mx-auto mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Floor Plans</h3>
              <p className="text-sm sm:text-base text-white/80">Interactive office layouts with real-time availability</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 animate-slide-up sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.6s' }}>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white mx-auto mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Team Management</h3>
              <p className="text-sm sm:text-base text-white/80">Comprehensive admin tools for office management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-1 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};