import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetMerchantFunnelPartner,
  useSetMerchantFunnelPartner,
  useIsCallerAdmin,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, TrendingUp, Settings, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FunnelsPage() {
  const { identity } = useInternetIdentity();
  const { data: funnelPartner, isLoading } = useGetMerchantFunnelPartner();
  const { data: isAdmin } = useIsCallerAdmin();
  const setFunnelPartner = useSetMerchantFunnelPartner();

  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    partnerName: '',
    partnerLink: '',
  });

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Marketing Funnels</CardTitle>
            <CardDescription>Please log in to access the Funnels page</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The Funnels page allows you to connect with marketing funnel partners to advertise your business. Please log in to continue.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleOpenConfig = () => {
    if (funnelPartner) {
      setPartnerForm({
        partnerName: funnelPartner.partnerName,
        partnerLink: funnelPartner.partnerLink,
      });
    }
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = async () => {
    if (!partnerForm.partnerName || !partnerForm.partnerLink) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      new URL(partnerForm.partnerLink);
    } catch {
      toast.error('Please enter a valid URL for the partner link');
      return;
    }

    try {
      await setFunnelPartner.mutateAsync({
        partnerName: partnerForm.partnerName,
        partnerLink: partnerForm.partnerLink,
      });
      toast.success('Funnel partner configuration updated successfully');
      setConfigDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update funnel partner configuration');
    }
  };

  const handleOpenPartnerLink = () => {
    if (funnelPartner?.partnerLink) {
      window.open(funnelPartner.partnerLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading funnel configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasPartnerConfigured = funnelPartner && funnelPartner.partnerName && funnelPartner.partnerLink;

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Marketing Funnels</h1>
            <p className="text-muted-foreground">
              Connect with funnel partners to market and advertise your business
            </p>
          </div>
          {isAdmin && (
            <Button onClick={handleOpenConfig} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          )}
        </div>

        {hasPartnerConfigured ? (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{funnelPartner.partnerName}</CardTitle>
                    <CardDescription className="mt-1">Marketing Funnel Partner</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Use this funnel partner to create marketing campaigns, build sales funnels, and advertise your products and services to reach more customers.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleOpenPartnerLink} className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Funnel Partner
                </Button>
                {isAdmin && (
                  <Button onClick={handleOpenConfig} variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Funnel Partner Connected</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                A funnel partner has not been configured yet. {isAdmin ? 'Configure one now to enable marketing funnel capabilities for your sellers and businesses.' : 'Please contact an administrator to set up a funnel partner.'}
              </p>
              {isAdmin && (
                <Button onClick={handleOpenConfig}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Funnel Partner
                </Button>
              )}
              {!isAdmin && (
                <Alert className="max-w-md mx-auto mt-4">
                  <AlertTitle>Administrator Access Required</AlertTitle>
                  <AlertDescription>
                    Only administrators can configure funnel partners. Please contact your administrator for assistance.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Configuration Dialog (Admin Only) */}
        {isAdmin && (
          <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure Funnel Partner</DialogTitle>
                <DialogDescription>
                  Set up or update your marketing funnel partner configuration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="partnerName">Partner Name *</Label>
                  <Input
                    id="partnerName"
                    value={partnerForm.partnerName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, partnerName: e.target.value })}
                    placeholder="e.g., ClickFunnels, Kartra, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="partnerLink">Partner Link *</Label>
                  <Input
                    id="partnerLink"
                    value={partnerForm.partnerLink}
                    onChange={(e) => setPartnerForm({ ...partnerForm, partnerLink: e.target.value })}
                    placeholder="https://your-funnel-partner.com"
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the URL where users can access the funnel partner platform
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveConfig} disabled={setFunnelPartner.isPending}>
                  {setFunnelPartner.isPending && (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save Configuration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
