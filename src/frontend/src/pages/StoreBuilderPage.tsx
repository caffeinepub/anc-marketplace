import { useState } from 'react';
import { useGetStoreBuilderConfig, useUpdateStoreBuilderConfig, useListStoreTemplates, useGetGlobalDomainPurchaseLink, useCreateStoreBuilderCheckoutSession } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Palette, Globe, ExternalLink, Info, CheckCircle2, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { PRICING_MODEL, STORE_BUILDER_PRICING } from '../lib/pricingCopy';

export default function StoreBuilderPage() {
  const { identity } = useInternetIdentity();
  const { data: config, isLoading: configLoading } = useGetStoreBuilderConfig();
  const { data: templates = [], isLoading: templatesLoading } = useListStoreTemplates();
  const { data: domainLink } = useGetGlobalDomainPurchaseLink();
  const updateConfig = useUpdateStoreBuilderConfig();
  const createCheckout = useCreateStoreBuilderCheckoutSession();

  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const hasActiveSubscription = config?.subscriptionActive || false;

  const handleSubscribe = async () => {
    try {
      const session = await createCheckout.mutateAsync();
      if (!session?.url) throw new Error('Stripe session missing url');
      window.location.href = session.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
    }
  };

  const handleSaveCustomization = async () => {
    if (!brandName.trim()) {
      toast.error('Please enter a brand name');
      return;
    }

    try {
      await updateConfig.mutateAsync({
        subscriptionActive: hasActiveSubscription,
        selectedTemplateId: selectedTemplate,
        customization: {
          brandName: brandName.trim(),
          tagline: tagline.trim(),
          primaryColor,
          assets: [],
        },
        domainPurchaseLink: domainLink || null,
      });
      toast.success('Store customization saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save customization');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>Please log in to access Store Builder.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (configLoading || templatesLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading Store Builder...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Store Builder</h1>
          <p className="text-muted-foreground">
            {STORE_BUILDER_PRICING.description}
          </p>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Optional Upgrade</AlertTitle>
          <AlertDescription>
            {PRICING_MODEL.faqMonthlyFees}
          </AlertDescription>
        </Alert>

        {!hasActiveSubscription ? (
          <Card>
            <CardHeader>
              <CardTitle>Subscribe to Store Builder</CardTitle>
              <CardDescription>
                Unlock standalone website/app conversion for {PRICING_MODEL.standaloneWebsiteSubscription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {STORE_BUILDER_PRICING.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleSubscribe} disabled={createCheckout.isPending} className="w-full">
                {createCheckout.isPending ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Subscribe for {PRICING_MODEL.standaloneWebsiteSubscription}</>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">
                <Store className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="customize">
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </TabsTrigger>
              <TabsTrigger value="domain">
                <Globe className="h-4 w-4 mr-2" />
                Domain
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Choose a Template</CardTitle>
                  <CardDescription>Select a template for your store</CardDescription>
                </CardHeader>
                <CardContent>
                  {templates.length === 0 ? (
                    <p className="text-center py-12 text-muted-foreground">
                      No templates available yet
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all ${
                            selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <CardHeader>
                            <img
                              src={template.previewImage}
                              alt={template.name}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <CardTitle>{template.name}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Badge>{template.type_.__kind__}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customize">
              <Card>
                <CardHeader>
                  <CardTitle>Customize Your Store</CardTitle>
                  <CardDescription>Set up your brand identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Your Brand Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Your Brand Tagline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveCustomization} disabled={updateConfig.isPending}>
                    {updateConfig.isPending ? 'Saving...' : 'Save Customization'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domain">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Domain</CardTitle>
                  <CardDescription>Connect your own domain name</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Purchase and connect a custom domain to your store for a professional web presence.
                  </p>
                  {domainLink && (
                    <Button asChild>
                      <a href={domainLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Purchase Domain
                      </a>
                    </Button>
                  )}
                  {!domainLink && (
                    <p className="text-sm text-muted-foreground">
                      Domain purchase link not configured yet. Contact support for assistance.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
