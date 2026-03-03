import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Settings, TrendingUp, Loader2, Lock } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";
import { useUpdateFunnelPartner } from "../hooks/useQueries";
import { toast } from "sonner";

const DEFAULT_FUNNEL = {
  partnerName: "ClickFunnels",
  signupLink: "https://clickfunnels.com/signup-flow?aff=anc_marketplace_sellers",
  profileLink: "https://app.clickfunnels.com/my-profile",
};

export default function FunnelsPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const updateFunnel = useUpdateFunnelPartner();

  const [signupLink, setSignupLink] = useState(DEFAULT_FUNNEL.signupLink);
  const [profileLink, setProfileLink] = useState(DEFAULT_FUNNEL.profileLink);
  const [showAdminConfig, setShowAdminConfig] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateFunnel.mutateAsync({
        partnerName: DEFAULT_FUNNEL.partnerName,
        signupLink,
        profileLink,
      });
      toast.success("Funnel partner settings saved");
      setShowAdminConfig(false);
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Marketing Funnels</h1>
          <p className="text-muted-foreground mt-1">
            Grow your business with high-converting sales funnels
          </p>
        </div>

        {/* Main CTA */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>ClickFunnels Partner</CardTitle>
                <CardDescription>
                  Create powerful sales funnels to convert visitors into customers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ANC Marketplace has partnered with ClickFunnels to give you access to
              professional funnel-building tools. Sign up through our affiliate link to
              get started and support the marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="flex-1"
              >
                <a href={signupLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Sign Up for ClickFunnels
                </a>
              </Button>

              {profileLink && (
                <Button variant="outline" asChild className="flex-1">
                  <a href={profileLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    My ClickFunnels Account
                  </a>
                </Button>
              )}
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Using our affiliate link helps support ANC Marketplace at no extra cost to you.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Sales Funnels",
              description: "Build multi-step funnels that guide customers to purchase",
            },
            {
              title: "Landing Pages",
              description: "Create high-converting landing pages for your products",
            },
            {
              title: "Email Sequences",
              description: "Automate follow-up emails to nurture leads",
            },
            {
              title: "Analytics",
              description: "Track funnel performance and optimize conversions",
            },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Config */}
        {identity && isAdmin && (
          <Card className="border-dashed border-2 border-muted-foreground/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Admin Configuration</CardTitle>
                  <Badge variant="secondary" className="text-xs">Admin Only</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminConfig(!showAdminConfig)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {showAdminConfig ? "Hide" : "Configure"}
                </Button>
              </div>
            </CardHeader>
            {showAdminConfig && (
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupLink">Signup Link</Label>
                    <Input
                      id="signupLink"
                      value={signupLink}
                      onChange={(e) => setSignupLink(e.target.value)}
                      placeholder="https://clickfunnels.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileLink">Profile/Account Link</Label>
                    <Input
                      id="profileLink"
                      value={profileLink}
                      onChange={(e) => setProfileLink(e.target.value)}
                      placeholder="https://app.clickfunnels.com/..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to hide the "My Account" button.
                    </p>
                  </div>
                  <Button type="submit" disabled={updateFunnel.isPending}>
                    {updateFunnel.isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
