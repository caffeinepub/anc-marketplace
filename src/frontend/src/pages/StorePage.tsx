import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useListProducts, useAddToCart, useCreateCheckoutSession, useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Rocket, Users, Check } from 'lucide-react';
import { toast } from 'sonner';
import { AccessRole, type ShoppingItem } from '../backend';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StorePage() {
  const { identity } = useInternetIdentity();
  const { data: products = [], isLoading } = useListProducts();
  const { data: userProfile } = useGetCallerUserProfile();
  const addToCart = useAddToCart();
  const createCheckout = useCreateCheckoutSession();
  const [selectedPlan, setSelectedPlan] = useState<'startup' | 'b2b' | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const isAuthenticated = !!identity;

  const plans = [
    {
      id: 'startup',
      name: 'Startup Program',
      price: 9900,
      icon: Rocket,
      features: [
        'Business registration guidance',
        'Business planning templates',
        'Mentor matching system',
        'Certification tracking',
        'Partner resources access',
        'Progress analytics',
      ],
    },
    {
      id: 'b2b',
      name: 'B2B Services',
      price: 19900,
      icon: Users,
      features: [
        'Service marketplace access',
        'Client relationship tools',
        'Project tracking',
        'Communication platform',
        'Analytics dashboard',
        'Provider network access',
      ],
    },
  ];

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart.mutateAsync(productId);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyProduct = async (product: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      return;
    }

    try {
      const items: ShoppingItem[] = [
        {
          productName: product.name,
          productDescription: product.description,
          priceInCents: BigInt(product.priceCents),
          quantity: BigInt(1),
          currency: 'usd',
        },
      ];

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const session = await createCheckout.mutateAsync({
        items,
        successUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/payment-failure`,
      });

      window.location.href = session.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
    }
  };

  const handlePlanPurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase a plan');
      return;
    }

    if (!selectedPlan || !email || !fullName) {
      toast.error('Please fill in all fields');
      return;
    }

    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) return;

    try {
      const items: ShoppingItem[] = [
        {
          productName: plan.name,
          productDescription: `Access to ${plan.name}`,
          priceInCents: BigInt(plan.price),
          quantity: BigInt(1),
          currency: 'usd',
        },
      ];

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const session = await createCheckout.mutateAsync({
        items,
        successUrl: `${baseUrl}/payment-success?plan=${selectedPlan}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}`,
        cancelUrl: `${baseUrl}/payment-failure`,
      });

      window.location.href = session.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
    }
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">ANC Store</h1>
        <p className="text-lg text-muted-foreground">Products, services, and programs for your business success</p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="plans">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    {product.image && (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${(Number(product.priceCents) / 100).toFixed(2)}</span>
                      <Badge variant={Number(product.inStock) > 0 ? 'default' : 'secondary'}>
                        {Number(product.inStock) > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={Number(product.inStock) === 0 || addToCart.isPending}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handleBuyProduct(product)}
                      disabled={Number(product.inStock) === 0 || createCheckout.isPending}
                    >
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const hasAccess = userProfile?.activeRole === (plan.id === 'startup' ? AccessRole.startUpMember : AccessRole.b2bMember);

              return (
                <Card key={plan.id} className={hasAccess ? 'border-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-center">{plan.name}</CardTitle>
                    <CardDescription className="text-center text-3xl font-bold mt-2">
                      ${(plan.price / 100).toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {hasAccess ? (
                      <Button className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => setSelectedPlan(plan.id as 'startup' | 'b2b')}>
                        Get Started
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>Enter your details to proceed with the {selectedPlan && plans.find((p) => p.id === selectedPlan)?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>
              Cancel
            </Button>
            <Button onClick={handlePlanPurchase} disabled={createCheckout.isPending}>
              {createCheckout.isPending ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
