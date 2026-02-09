import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetStoreBuilderConfig, useUpdateStoreBuilderConfig, useListStoreTemplates, useCreateStoreBuilderCheckoutSession } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Store, Palette, Globe, Info, ExternalLink, Monitor, Smartphone, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export default function StoreBuilderPage() {
  const { identity } = useInternetIdentity();
  const { data: config, isLoading: configLoading } = useGetStoreBuilderConfig();
  const { data: templates = [], isLoading: templatesLoading } = useListStoreTemplates();
  const updateConfig = useUpdateStoreBuilderConfig();
  const createCheckout = useCreateStoreBuilderCheckoutSession();

  const [isProcessing, setIsProcessing] = useState(false);

  const isAuthenticated = !!identity;
  const isSubscribed = config?.subscriptionActive || false;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const session = await createCheckout.mutateAsync();
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = session.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Store Builder</CardTitle>
            <CardDescription>Please log in to access Store Builder</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The Store Builder allows you to convert your marketplace store into a standalone website or app. Please log in to continue.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (configLoading || templatesLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Store Builder...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Store Builder</h1>
          <p className="text-muted-foreground">
            Convert your marketplace store into a standalone website or mobile app
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Optional Upgrade</AlertTitle>
          <AlertDescription>
            Store Builder is an <strong>optional $10/month subscription</strong> that lets you convert your marketplace store into a standalone website or app. 
            You can continue selling on the marketplace for free with just a $5 per-sale service fee.
          </AlertDescription>
        </Alert>

        {isSubscribed ? (
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Store Builder Active</CardTitle>
                    <CardDescription>Your subscription is active</CardDescription>
                  </div>
                </div>
                <Badge variant="default">Subscribed</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                You have access to all Store Builder features. Choose a template and customize your standalone store.
              </p>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Store className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-base">Choose Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Select from professional templates designed for e-commerce and services
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Palette className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-base">Customize Design</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Brand your store with custom colors, logos, and content
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Globe className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-base">Launch Website</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Deploy your standalone store and connect a custom domain
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Template selection and customization features are coming soon. Your subscription ensures early access when available.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Upgrade to Store Builder</CardTitle>
                  <CardDescription>$10/month - Cancel anytime</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">What's included:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Standalone Website</p>
                      <p className="text-sm text-muted-foreground">
                        Convert your marketplace store into an independent website
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Mobile App Conversion</p>
                      <p className="text-sm text-muted-foreground">
                        Turn your store into a mobile app for iOS and Android
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Professional Templates</p>
                      <p className="text-sm text-muted-foreground">
                        Choose from beautifully designed templates for any business
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Custom Branding</p>
                      <p className="text-sm text-muted-foreground">
                        Add your logo, colors, and brand identity
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Custom Domain Support</p>
                      <p className="text-sm text-muted-foreground">
                        Connect your own domain name to your store
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Remember:</strong> You don't need Store Builder to sell on the marketplace. 
                  This is only for creating a standalone website or app version of your store.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSubscribe}
                disabled={isProcessing}
                size="lg"
                className="w-full"
              >
                {isProcessing ? 'Processing...' : 'Subscribe for $10/month'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure payment powered by Stripe. Cancel anytime from your account settings.
              </p>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Website & App Builder Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Website & App Builder</h2>
            <p className="text-muted-foreground">
              Build standalone websites and mobile apps with our guided builder tools
            </p>
          </div>

          {!isSubscribed && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Subscription Required</AlertTitle>
              <AlertDescription>
                The Website & App Builder features require an active Store Builder subscription ($10/month). 
                Subscribe above to unlock these powerful tools.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Standalone Website Builder */}
            <Card className={!isSubscribed ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Standalone Website</CardTitle>
                    <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create a fully independent website for your business with our step-by-step builder.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Build Process:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                    <li>Pick a professional template that fits your business</li>
                    <li>Customize branding with your logo, colors, and content</li>
                    <li>Preview your website across desktop and mobile devices</li>
                    <li>Launch your site and connect a custom domain</li>
                  </ol>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={!isSubscribed}
                  >
                    {isSubscribed ? 'Start Building Website' : 'Subscribe to Unlock'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Standalone App Builder */}
            <Card className={!isSubscribed ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Standalone App</CardTitle>
                    <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Transform your business into a native mobile app for iOS and Android platforms.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Build Process:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                    <li>Choose an app template optimized for mobile</li>
                    <li>Customize app branding, icons, and splash screens</li>
                    <li>Preview your app on iOS and Android simulators</li>
                    <li>Launch to app stores with guided submission</li>
                  </ol>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={!isSubscribed}
                  >
                    {isSubscribed ? 'Start Building App' : 'Subscribe to Unlock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {isSubscribed && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Website and App Builder tools are currently in development. As a subscriber, you'll get early access 
                as soon as these features launch. We'll notify you when they're ready!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
