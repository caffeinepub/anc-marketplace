import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useListProducts, useCreateCheckoutSession, useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Wrench, Info } from 'lucide-react';
import { toast } from 'sonner';
import { type ShoppingItem } from '../backend';
import HumanCheckDialog from '../components/security/HumanCheckDialog';
import { getHumanCheckStatus, setHumanCheckVerified } from '../lib/humanCheck';
import { PRICING_MODEL, STORE_BUILDER_PRICING } from '@/lib/pricingCopy';

export default function StorePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: products = [], isLoading } = useListProducts();
  const { data: userProfile } = useGetCallerUserProfile();
  const createCheckout = useCreateCheckoutSession();
  const [showHumanCheck, setShowHumanCheck] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<ShoppingItem[] | null>(null);

  const isAuthenticated = !!identity;

  const initiateCheckout = async (items: ShoppingItem[]) => {
    // Check if human verification is needed
    if (!getHumanCheckStatus()) {
      setPendingCheckout(items);
      setShowHumanCheck(true);
      return;
    }

    // Proceed with checkout
    await proceedWithCheckout(items);
  };

  const proceedWithCheckout = async (items: ShoppingItem[]) => {
    try {
      const session = await createCheckout.mutateAsync(items);
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = session.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to create checkout session');
    }
  };

  const handleHumanCheckSuccess = () => {
    setHumanCheckVerified();
    setShowHumanCheck(false);
    
    if (pendingCheckout) {
      proceedWithCheckout(pendingCheckout);
      setPendingCheckout(null);
    }
  };

  const handleHumanCheckCancel = () => {
    setShowHumanCheck(false);
    setPendingCheckout(null);
    toast.info('Checkout cancelled');
  };

  const handleBuyProduct = async (product: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to make a purchase');
      return;
    }

    const item: ShoppingItem = {
      productName: product.name,
      productDescription: product.description,
      priceInCents: BigInt(product.priceCents),
      quantity: BigInt(1),
      currency: 'usd',
    };

    await initiateCheckout([item]);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Store</h1>
        <p className="text-muted-foreground">
          Browse products and explore our services
        </p>
      </div>

      <Alert className="mb-6 bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Free to sell!</strong> {PRICING_MODEL.shortDescription}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <Info className="h-4 w-4 mr-2" />
            Pricing Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No products available at the moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    {product.image && (
                      <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        ${(Number(product.priceCents) / 100).toFixed(2)}
                      </span>
                      <Badge variant={Number(product.inStock) > 0 ? 'default' : 'secondary'}>
                        {Number(product.inStock) > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleBuyProduct(product)}
                      disabled={Number(product.inStock) === 0 || createCheckout.isPending}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {createCheckout.isPending ? 'Processing...' : 'Buy Now'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Selling</CardTitle>
                <CardDescription>Start selling with no upfront costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">Free</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {PRICING_MODEL.marketplaceBenefit}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold">{PRICING_MODEL.serviceFeePerSale}</span>
                    <span className="text-muted-foreground">per sale</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {PRICING_MODEL.serviceFeeBenefit}
                  </p>
                </div>
                <Alert>
                  <AlertDescription className="text-sm">
                    {PRICING_MODEL.faqMarketplaceCost}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="h-6 w-6 text-primary" />
                  <CardTitle>Store Builder</CardTitle>
                </div>
                <CardDescription>
                  {STORE_BUILDER_PRICING.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-primary">
                      ${STORE_BUILDER_PRICING.monthlyPrice.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {PRICING_MODEL.standaloneWebsiteBenefit}
                  </p>
                </div>
                <div className="space-y-2">
                  {STORE_BUILDER_PRICING.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate({ to: '/store-builder' })}
                >
                  Learn More About Store Builder
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">For Marketplace Sellers:</h3>
                <p className="text-sm text-muted-foreground">
                  {PRICING_MODEL.detailedDescription}
                </p>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Service Fee Details:</h3>
                <p className="text-sm text-muted-foreground">
                  {PRICING_MODEL.faqServiceFee}
                </p>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Monthly Fees:</h3>
                <p className="text-sm text-muted-foreground">
                  {PRICING_MODEL.faqMonthlyFees}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <HumanCheckDialog
        open={showHumanCheck}
        onSuccess={handleHumanCheckSuccess}
        onCancel={handleHumanCheckCancel}
      />
    </div>
  );
}
