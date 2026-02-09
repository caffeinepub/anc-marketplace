import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCircle, Heart, ShoppingCart, MessageSquare, Settings, ShoppingBag, Search, Shield } from 'lucide-react';

export default function CustomerProfileHome() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <Shield className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Please log in to access your customer profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const quickLinks = [
    { to: '/store', icon: ShoppingBag, label: 'Browse Store', description: 'Explore products and services' },
    { to: '/store', icon: Search, label: 'Search', description: 'Find what you need' },
    { to: '/customer-wishlist', icon: Heart, label: 'Wishlist', description: 'View saved items' },
    { to: '/customer-favorites', icon: Heart, label: 'Favorites', description: 'Your favorite sellers' },
    { to: '/customer-purchases', icon: ShoppingCart, label: 'Purchase History', description: 'Track your orders' },
    { to: '/customer-messages', icon: MessageSquare, label: 'Messages', description: 'Contact sellers' },
    { to: '/customer-settings', icon: Settings, label: 'Settings', description: 'Manage your account' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <UserCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Customer Profile</h1>
          </div>
          <p className="text-muted-foreground">Manage your shopping experience and preferences</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{link.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{link.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Welcome to Your Profile</CardTitle>
            <CardDescription>Quick access to all your customer features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              From here, you can manage your wishlist, track purchases, message sellers, and customize your shopping experience.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/store">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Shopping
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/privacy-policy">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
