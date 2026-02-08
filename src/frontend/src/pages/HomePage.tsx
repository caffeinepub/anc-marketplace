import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Rocket, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: ShoppingBag,
      title: 'E-Commerce Store',
      description: 'Browse and purchase business and industry products with integrated Stripe checkout.',
      image: '/assets/generated/ecommerce-icon.dim_100x100.png',
      action: () => navigate({ to: '/store' }),
    },
    {
      icon: Rocket,
      title: 'Startup Program',
      description: 'Access business registration tools, mentoring, certification tracking, and partner resources.',
      image: '/assets/generated/startup-icon.dim_100x100.png',
      action: () => navigate({ to: '/store' }),
    },
    {
      icon: Users,
      title: 'B2B Services',
      description: 'Manage outsourced services, marketplace listings, client relations, and analytics.',
      image: '/assets/generated/b2b-icon.dim_100x100.png',
      action: () => navigate({ to: '/store' }),
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-12">
        <div className="container relative z-10 text-center mb-8">
          <img 
            src="/assets/Screenshot_20251130-131933_Gmail.png" 
            alt="ANC Electronics N Services Logo" 
            className="h-32 w-auto mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 logo-text">
            ANC Electronics N Services
          </h1>
        </div>
        
        <div className="relative w-full h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/generated/hero-business.dim_1200x600.jpg"
              alt="Business Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
          </div>
          <div className="container relative z-10 text-center">
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 font-light">
              Our mission is your success.
            </p>
            <Button size="lg" onClick={() => navigate({ to: '/store' })} className="text-lg px-8">
              Explore Our Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Business Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to grow your business, from products to services and support programs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                      <img src={feature.image} alt={feature.title} className="h-20 w-20" />
                    </div>
                    <CardTitle className="flex items-center gap-2 justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center mb-4">{feature.description}</CardDescription>
                    <Button variant="outline" className="w-full" onClick={feature.action}>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join ANC Electronics N Services today and unlock access to our comprehensive business platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate({ to: '/store' })}>
                Browse Products
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/store' })}>
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
