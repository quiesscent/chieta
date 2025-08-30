import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "per user/month",
      description: "Perfect for small teams getting started with desk booking",
      features: [
        "Up to 25 users",
        "Basic desk booking",
        "Floor plan view",
        "Email support",
        "Mobile app access",
        "Basic analytics"
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$19",
      period: "per user/month",
      description: "Advanced features for growing organizations",
      features: [
        "Up to 100 users",
        "Advanced booking system",
        "WiFi check-in",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "Admin dashboard",
        "Reporting tools"
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for large organizations",
      features: [
        "Unlimited users",
        "Custom features",
        "Dedicated support",
        "API access",
        "SSO integration",
        "Custom branding",
        "Advanced security",
        "24/7 support"
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
            Choose the perfect plan for your organization. All plans include core booking features 
            with no hidden fees or setup costs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-custom-lg animate-slide-up ${
                plan.popular 
                  ? 'border-primary ring-2 ring-primary/20 shadow-custom-md' 
                  : 'border-border hover:border-primary/30'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-bl-lg">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-semibold">Most Popular</span>
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-primary mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-sm sm:text-base text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-success/10 rounded-full p-0.5 sm:p-1 shrink-0">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                      </div>
                      <span className="text-sm sm:text-base text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full text-sm sm:text-base ${
                    plan.popular 
                      ? 'bg-gradient-primary hover:shadow-custom-md' 
                      : 'variant-outline hover:bg-primary hover:text-primary-foreground'
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-4 sm:px-0">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground px-4 sm:px-0">
            <span className="whitespace-nowrap">✓ 99.9% uptime guarantee</span>
            <span className="whitespace-nowrap">✓ GDPR compliant</span>
            <span className="whitespace-nowrap">✓ 24/7 monitoring</span>
            <span className="whitespace-nowrap">✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};