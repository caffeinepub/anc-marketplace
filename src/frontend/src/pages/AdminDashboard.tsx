import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useIsStripeConfigured, useSetStripeConfiguration } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Settings, Package, Rocket, Briefcase, Truck, Puzzle, Users, MessageSquare, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import type { StripeConfiguration } from '../backend';
import type { Product, Lesson, VirtualMeeting, Activity, B2BService, DropshippingPartner, AppIntegration, Variant_disconnected_connected } from '../types';
import UserRoleManagement from '../components/admin/UserRoleManagement';
import AssistantKnowledgeBaseAdmin from '../components/admin/assistant/AssistantKnowledgeBaseAdmin';
import UnansweredQuestionsAdmin from '../components/admin/assistant/UnansweredQuestionsAdmin';

const ConnectionStatus = {
  connected: { __kind__: 'connected' as const },
  disconnected: { __kind__: 'disconnected' as const },
};

export default function AdminDashboard() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: isStripeConfigured } = useIsStripeConfigured();
  const setStripeConfig = useSetStripeConfiguration();
  const navigate = useNavigate();

  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [allowedCountries, setAllowedCountries] = useState('US,CA,GB');

  if (!identity) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>Please log in to access the admin dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isAdminLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You do not have permission to access this page. Admin access required.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const handleStripeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeSecretKey.trim()) {
      toast.error('Please enter a Stripe secret key');
      return;
    }

    try {
      const config: StripeConfiguration = {
        secretKey: stripeSecretKey.trim(),
        allowedCountries: allowedCountries.split(',').map((c) => c.trim()),
      };
      await setStripeConfig.mutateAsync(config);
      toast.success('Stripe configuration saved successfully');
      setStripeSecretKey('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save Stripe configuration');
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform settings and content</p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <MessageSquare className="h-4 w-4 mr-2" />
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="questions">
            <HelpCircle className="h-4 w-4 mr-2" />
            Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Payment Configuration</CardTitle>
              <CardDescription>
                {isStripeConfigured
                  ? 'Stripe is configured and ready to process payments'
                  : 'Configure Stripe to enable payment processing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStripeSetup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripeKey">Stripe Secret Key</Label>
                  <Input
                    id="stripeKey"
                    type="password"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                    placeholder="sk_test_..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
                  <Input
                    id="countries"
                    value={allowedCountries}
                    onChange={(e) => setAllowedCountries(e.target.value)}
                    placeholder="US,CA,GB"
                  />
                </div>
                <Button type="submit" disabled={setStripeConfig.isPending}>
                  {setStripeConfig.isPending ? 'Saving...' : 'Save Configuration'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserRoleManagement />
        </TabsContent>

        <TabsContent value="knowledge">
          <AssistantKnowledgeBaseAdmin />
        </TabsContent>

        <TabsContent value="questions">
          <UnansweredQuestionsAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}
