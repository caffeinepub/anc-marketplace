import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetStoreBuilderConfig, useSaveStoreBuilderConfig, useListStoreTemplates, useGetGlobalDomainPurchaseLink, useCreateStoreBuilderCheckoutSession } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wrench, Check, ExternalLink, Palette, Image as ImageIcon, Info } from 'lucide-react';
import { toast } from 'sonner';
import { StoreCustomization, BrandingAsset, AssetType, StoreBuilderConfig } from '../types';
import { STORE_BUILDER_PRICING, PRICING_MODEL } from '@/lib/pricingCopy';

export default function StoreBuilderPage() {
  const { identity } = useInternetIdentity();
  const { data: storeConfig, isLoading } = useGetStoreBuilderConfig();
  const { data: templates = [] } = useListStoreTemplates();
  const { data: globalDomainLink } = useGetGlobalDomainPurchaseLink();
  const saveConfig = useSaveStoreBuilderConfig();
  const createCheckout = useCreateStoreBuilderCheckoutSession();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  const isAuthenticated = !!identity;
  const hasSubscription = storeConfig?.subscriptionActive || false;

  useEffect(() => {
    if (storeConfig) {
      setSelectedTemplateId(storeConfig.selectedTemplateId);
      setBrandName(storeConfig.customization.brandName);
      setTagline(storeConfig.customization.tagline);
      setPrimaryColor(storeConfig.customization.primaryColor);

      const logoAsset = storeConfig.customization.assets.find(a => a.type_.__kind__ === 'logo');
      const bannerAsset = storeConfig.customization.assets.find(a => a.type_.__kind__ === 'banner');
      
      if (logoAsset) setLogoUrl(logoAsset.url);
      if (bannerAsset) setBannerUrl(bannerAsset.url);
    }
  }, [storeConfig]);

  const handleSubscribe = async () => {
    try {
      const session = await createCheckout.mutateAsync();
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = session.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
    }
  };

  const handleSaveCustomization = async () => {
    if (!selectedTemplateId) {
      toast.error('Please select a template first');
      return;
    }

    const assets: BrandingAsset[] = [];
    if (logoUrl) {
      assets.push({
        id: `logo-${Date.now()}`,
        url: logoUrl,
        type_: { __kind__: 'logo' },
      });
    }
    if (bannerUrl) {
      assets.push({
        id: `banner-${Date.now()}`,
        url: bannerUrl,
        type_: { __kind__: 'banner' },
      });
    }

    const customization: StoreCustomization = {
      brandName,
      tagline,
      primaryColor,
      assets,
    };

    try {
      const config: StoreBuilderConfig = {
        subscriptionActive: true,
        selectedTemplateId: selectedTemplateId,
        customization,
        domainPurchaseLink: globalDomainLink || null,
      };
      await saveConfig.mutateAsync(config);
      toast.success('Store customization saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save customization');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>Please log in to access the Store Builder.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert className="mb-6 bg-primary/5 border-primary/20">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Optional upgrade:</strong> The Store Builder is only needed if you want to convert your marketplace store into a standalone website or app. You can continue selling on the marketplace for free with just the $5 per-sale service fee.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="h-8 w-8 text-primary" />
                <CardTitle>Store Builder Subscription</CardTitle>
              </div>
              <CardDescription>
                {STORE_BUILDER_PRICING.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold">What's Included:</h3>
                <ul className="space-y-2">
                  {STORE_BUILDER_PRICING.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${STORE_BUILDER_PRICING.monthlyPrice.toFixed(2)}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Alert>
                <AlertDescription className="text-sm">
                  This is the only monthly fee in our platform. Marketplace selling remains free with just a $5 service fee per sale.
                </AlertDescription>
              </Alert>
              <Button onClick={handleSubscribe} className="w-full" disabled={createCheckout.isPending}>
                {createCheckout.isPending ? 'Processing...' : 'Subscribe Now'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Store Builder</h1>
        <p className="text-muted-foreground">Build and customize your standalone website or app</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Template</CardTitle>
              <CardDescription>Select a template for your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedTemplateId === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Badge variant={template.type_.__kind__ === 'ecommerce' ? 'default' : 'secondary'}>
                      {template.type_.__kind__ === 'ecommerce' ? 'E-commerce' : 'Service'}
                    </Badge>
                  </div>
                  {template.previewImage && (
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded-md mt-2"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding
              </CardTitle>
              <CardDescription>Customize your store's appearance</CardDescription>
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
                  placeholder="Your brand tagline"
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
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Assets
              </CardTitle>
              <CardDescription>Upload your logo and banner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bannerUrl">Banner URL</Label>
                <Input
                  id="bannerUrl"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveCustomization} className="w-full" disabled={saveConfig.isPending}>
            {saveConfig.isPending ? 'Saving...' : 'Save Customization'}
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your store will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 space-y-4" style={{ borderColor: primaryColor }}>
                {logoUrl && (
                  <img src={logoUrl} alt="Logo" className="h-16 object-contain" />
                )}
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                    {brandName || 'Your Brand Name'}
                  </h2>
                  <p className="text-muted-foreground">{tagline || 'Your tagline here'}</p>
                </div>
                {bannerUrl && (
                  <img src={bannerUrl} alt="Banner" className="w-full h-32 object-cover rounded-md" />
                )}
                <div className="flex gap-2">
                  <div className="h-10 w-24 rounded" style={{ backgroundColor: primaryColor }} />
                  <div className="h-10 w-24 rounded bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>

          {globalDomainLink && (
            <Card>
              <CardHeader>
                <CardTitle>Domain Purchase</CardTitle>
                <CardDescription>Get a custom domain for your store</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => window.open(globalDomainLink, '_blank')}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Purchase Domain
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
