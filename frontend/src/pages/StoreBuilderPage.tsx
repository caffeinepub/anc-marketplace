import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Store,
  Smartphone,
  Globe,
  CheckCircle,
  Zap,
  Loader2,
  Lock,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { toast } from "sonner";

export default function StoreBuilderPage() {
  const { identity } = useInternetIdentity();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionActive] = useState(false);

  const handleSubscribe = async () => {
    if (!identity) {
      toast.error("Please log in to subscribe");
      return;
    }
    setIsSubscribing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubscribing(false);
    toast.info("Subscription checkout coming soon. Contact us to get started.");
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Store Builder</h1>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Optional Upgrade
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Convert your marketplace store into a standalone website or mobile app
          </p>
        </div>

        {/* Pricing Card */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Store Builder Subscription</CardTitle>
                <CardDescription>
                  Everything you need to build a standalone online presence
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-foreground">$10</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Free marketplace access is included</strong> — Store Builder is an
                optional $10/month upgrade for sellers who want a standalone website or app.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Standalone website conversion",
                "Mobile app builder",
                "Custom domain support",
                "Advanced branding tools",
                "Professional templates",
                "Priority support",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {subscriptionActive ? (
              <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Subscription Active
              </Badge>
            ) : (
              <Button
                className="w-full"
                onClick={handleSubscribe}
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processing...</>
                ) : !identity ? (
                  <><Lock className="h-4 w-4 mr-2" />Login to Subscribe</>
                ) : (
                  "Subscribe for $10/month"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Website Builder */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Standalone Website</CardTitle>
                <CardDescription>
                  Convert your store into a full website with custom domain
                </CardDescription>
              </div>
              {!subscriptionActive && (
                <Badge variant="secondary" className="ml-auto">Requires Subscription</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { step: "1", label: "Choose a template", desc: "Select from professional website templates" },
                { step: "2", label: "Customize branding", desc: "Add your logo, colors, and content" },
                { step: "3", label: "Connect domain", desc: "Link your custom domain name" },
                { step: "4", label: "Go live", desc: "Publish your standalone website" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="w-full mt-4"
              variant="outline"
              disabled={!subscriptionActive}
              onClick={() => toast.info("Website builder coming soon!")}
            >
              {subscriptionActive ? "Build Website" : "Subscribe to Unlock"}
            </Button>
          </CardContent>
        </Card>

        {/* App Builder */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Standalone App</CardTitle>
                <CardDescription>
                  Build a native mobile app for iOS and Android
                </CardDescription>
              </div>
              {!subscriptionActive && (
                <Badge variant="secondary" className="ml-auto">Requires Subscription</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { step: "1", label: "Configure app settings", desc: "Set app name, icon, and splash screen" },
                { step: "2", label: "Design app screens", desc: "Customize the look and feel of your app" },
                { step: "3", label: "Test on devices", desc: "Preview on iOS and Android simulators" },
                { step: "4", label: "Submit to stores", desc: "Publish to App Store and Google Play" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="w-full mt-4"
              variant="outline"
              disabled={!subscriptionActive}
              onClick={() => toast.info("App builder coming soon!")}
            >
              {subscriptionActive ? "Build App" : "Subscribe to Unlock"}
            </Button>
          </CardContent>
        </Card>

        {/* Store Templates Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Available Templates
            </CardTitle>
            <CardDescription>
              Professional templates to get you started quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "E-Commerce Classic",
                  type: "ecommerce",
                  img: "/assets/generated/template-ecom-1-thumb.dim_800x600.png",
                },
                {
                  name: "E-Commerce Modern",
                  type: "ecommerce",
                  img: "/assets/generated/template-ecom-2-thumb.dim_800x600.png",
                },
                {
                  name: "Service Business",
                  type: "service",
                  img: "/assets/generated/template-service-1-thumb.dim_800x600.png",
                },
                {
                  name: "Professional Services",
                  type: "service",
                  img: "/assets/generated/template-service-2-thumb.dim_800x600.png",
                },
              ].map((template) => (
                <div
                  key={template.name}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={template.img}
                    alt={template.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium">{template.name}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {template.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
