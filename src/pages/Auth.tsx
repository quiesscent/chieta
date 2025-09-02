import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import chietaLogo from "@/assets/chieta-logo.jpeg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Sample credentials for demo
    const validCredentials = {
      user: { email: "user@demo.com", password: "user123" },
      admin: { email: "admin@demo.com", password: "admin123" }
    };

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLogin) {
      // Check credentials
      if (
        (formData.email === validCredentials.user.email && formData.password === validCredentials.user.password) ||
        (formData.email === validCredentials.admin.email && formData.password === validCredentials.admin.password)
      ) {
        const isAdmin = formData.email === validCredentials.admin.email;
        
        toast({
          title: "Successfully Logged In",
          description: `Welcome ${isAdmin ? 'Admin' : 'User'}!`,
        });

        // Store user type in localStorage for demo purposes
        localStorage.setItem('userType', isAdmin ? 'admin' : 'user');
        localStorage.setItem('userEmail', formData.email);
        
        navigate(isAdmin ? '/admin' : '/dashboard');
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please use the demo credentials provided.",
          variant: "destructive"
        });
      }
    } else {
      // Handle registration
      toast({
        title: "Registration Successful!",
        description: "Please log in with your new account.",
      });
      setIsLogin(true);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
      isLogin ? 'bg-background' : 'bg-primary/5'
    }`}>
      <div className="w-full max-w-md">
        <Card className={`shadow-custom-xl animate-scale-in transition-all duration-300 ${
          isLogin ? 'bg-card' : 'bg-secondary/50 backdrop-blur-sm'
        }`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-2 rounded-lg animate-bounce-in">
                <img src={chietaLogo} alt="CHIETA Logo" className="h-26 w-auto" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary animate-fade-in">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {isLogin 
                ? "Sign in to access your Chieta Desk System dashboard" 
                : "Join Chieta Desk System to manage your workspace"
              }
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    className="border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40"
                  />
                </div>
              )}

              <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@company.com"
                  disabled={isSubmitting}
                  className="border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40"
                />
              </div>

              <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className="border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40"
                  />
                </div>
              )}

              <Button 
                type="submit" 
                loading={isSubmitting}
                disabled={isSubmitting}
                className={`w-full animate-slide-up ${
                  isLogin 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                    : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                }`}
                size="lg"
                style={{ animationDelay: '0.5s' }}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Demo credentials */}
            {isLogin && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg animate-fade-in border border-primary/20" style={{ animationDelay: '0.6s' }}>
                <p className="text-sm font-semibold text-primary mb-2">Demo Credentials:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>User: user@demo.com / user123</div>
                  <div>Admin: admin@demo.com / admin123</div>
                </div>
              </div>
            )}

             {/* <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isSubmitting}
                className="text-primary hover:underline font-medium transition-all duration-300 hover:text-primary/80"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div> */}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
