import React, { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAdminDashboardData,
  useIsCallerAdmin,
  useInitializeAccessControl,
  useSetOwnerPrincipal,
  useIsStripeConfigured,
  useSetStripeConfiguration,
} from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Settings, Users, BookOpen, MessageSquare, Map, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import UserRoleManagement from '../components/admin/UserRoleManagement';
import AssistantKnowledgeBaseAdmin from '../components/admin/assistant/AssistantKnowledgeBaseAdmin';
import UnansweredQuestionsAdmin from '../components/admin/assistant/UnansweredQuestionsAdmin';
import MarketplaceRoadmapAdmin from '../components/admin/MarketplaceRoadmapAdmin';
import type { AdminPageSection } from '../backend';
import { Variant_completed_comingSoon_inProgress } from '../backend';

type TabValue = 'settings' | 'users' | 'knowledge' | 'questions' | 'roadmap';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tab?: string };
  const { identity, loginStatus } = useInternetIdentity();
  
  const [activeTab, setActiveTab] = useState<TabValue>('settings');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [allowedCountries, setAllowedCountries] = useState('US,CA,GB');

  const { data: isAdmin, isLoading: isAdminLoading, error: adminError } = useIsCallerAdmin();
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetAdminDashboardData();
  const { data: isStripeConfigured, isLoading: stripeConfigLoading } = useIsStripeConfigured();
  const setStripeConfig = useSetStripeConfiguration();
  const initializeAccess = useInitializeAccessControl();
  const setOwner = useSetOwnerPrincipal();

  const isAuthenticated = !!identity;
  const isLoading = isAdminLoading || dashboardLoading;

  // Sync tab with URL search param
  useEffect(() => {
    if (search.tab && ['settings', 'users', 'knowledge', 'questions', 'roadmap'].includes(search.tab)) {
      setActiveTab(search.tab as TabValue);
    }
  }, [search.tab]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    navigate({ to: '/admin', search: (prev: any) => ({ ...prev, tab: value }) });
  };

  const handleStripeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setStripeConfig.mutateAsync({
        secretKey: stripeSecretKey,
        allowedCountries: allowedCountries.split(',').map(c => c.trim()),
      });
      setStripeSecretKey('');
    } catch (error) {
      console.error('Failed to configure Stripe:', error);
    }
  };

  const handleInitializeAccess = async () => {
    try {
      await initializeAccess.mutateAsync();
    } catch (error) {
      console.error('Failed to initialize access control:', error);
    }
  };

  const handleSetOwner = async () => {
    try {
      await setOwner.mutateAsync();
    } catch (error) {
      console.error('Failed to set owner principal:', error);
    }
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-primary/20 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-primary">Admin Dashboard</CardTitle>
            <CardDescription>Please log in to access the admin dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if admin needs initialization
  const needsInitialization = adminError && 
    (String(adminError).includes('not initialized') || String(adminError).includes('No admin'));

  // Show initialization UI
  if (needsInitialization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-primary/20 shadow-lg">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Initialize Admin Access</CardTitle>
                <CardDescription className="text-base mt-1">
                  Set up admin access control for the first time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-primary/30 bg-primary/5">
              <AlertCircle className="h-5 w-5 text-primary" />
              <AlertDescription className="text-base ml-2">
                This is a one-time setup. You will become the admin and owner of this application.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <Button
                onClick={handleInitializeAccess}
                disabled={initializeAccess.isPending}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {initializeAccess.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Initialize Access Control
                  </>
                )}
              </Button>

              <Button
                onClick={handleSetOwner}
                disabled={setOwner.isPending}
                variant="outline"
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {setOwner.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting Owner...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    Set Owner Principal
                  </>
                )}
              </Button>
            </div>

            {(initializeAccess.isError || setOwner.isError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {String(initializeAccess.error || setOwner.error)}
                </AlertDescription>
              </Alert>
            )}

            {(initializeAccess.isSuccess || setOwner.isSuccess) && (
              <Alert className="border-primary bg-primary/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  Admin access initialized successfully! Refreshing...
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-lg">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
                <CardDescription className="text-base mt-1">
                  You do not have permission to access this page
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })} variant="outline" className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSectionStatusBadge = (status: Variant_completed_comingSoon_inProgress) => {
    switch (status) {
      case Variant_completed_comingSoon_inProgress.completed:
        return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
      case Variant_completed_comingSoon_inProgress.inProgress:
        return <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20">In Progress</Badge>;
      case Variant_completed_comingSoon_inProgress.comingSoon:
        return <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const getSectionIcon = (section: AdminPageSection) => {
    const iconClass = "h-5 w-5";
    switch (section) {
      case 'businessDetails': return <Settings className={iconClass} />;
      case 'marketplace': return <Map className={iconClass} />;
      case 'assistants': return <MessageSquare className={iconClass} />;
      case 'b2b': return <Users className={iconClass} />;
      case 'affiliate': return <Users className={iconClass} />;
      case 'funding': return <BookOpen className={iconClass} />;
      case 'startups': return <BookOpen className={iconClass} />;
      default: return <Settings className={iconClass} />;
    }
  };

  const getSectionName = (section: AdminPageSection): string => {
    switch (section) {
      case 'businessDetails': return 'Business Details';
      case 'marketplace': return 'Marketplace';
      case 'assistants': return 'Assistants';
      case 'b2b': return 'B2B Services';
      case 'affiliate': return 'Affiliate Program';
      case 'funding': return 'Funding';
      case 'startups': return 'Startup Programs';
      default: return String(section);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground text-lg mt-1">Manage your application settings and data</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="settings" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Questions</span>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Roadmap</span>
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Admin Sections Status */}
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  Platform Status
                </CardTitle>
                <CardDescription className="text-base">Current development status of platform sections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {dashboardData?.adminSections.map((section) => (
                    <div
                      key={String(section.section)}
                      className="flex items-start justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                          {getSectionIcon(section.section)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base mb-1">{getSectionName(section.section)}</h3>
                          {section.details && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{section.details.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        {getSectionStatusBadge(section.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stripe Configuration */}
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Stripe Configuration</CardTitle>
                <CardDescription className="text-base">
                  {isStripeConfigured
                    ? 'Stripe is configured and ready to process payments'
                    : 'Configure Stripe to enable payment processing'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isStripeConfigured ? (
                  <Alert className="border-primary bg-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <AlertDescription className="text-base ml-2">
                      Stripe payment processing is active
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleStripeSetup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripeKey" className="text-base">Stripe Secret Key</Label>
                      <Input
                        id="stripeKey"
                        type="password"
                        value={stripeSecretKey}
                        onChange={(e) => setStripeSecretKey(e.target.value)}
                        placeholder="sk_test_..."
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countries" className="text-base">Allowed Countries (comma-separated)</Label>
                      <Input
                        id="countries"
                        value={allowedCountries}
                        onChange={(e) => setAllowedCountries(e.target.value)}
                        placeholder="US,CA,GB"
                        required
                        className="h-11"
                      />
                    </div>
                    <Button type="submit" disabled={setStripeConfig.isPending} className="h-11 px-6">
                      {setStripeConfig.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Configuring...
                        </>
                      ) : (
                        'Configure Stripe'
                      )}
                    </Button>
                    {setStripeConfig.isError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{String(setStripeConfig.error)}</AlertDescription>
                      </Alert>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserRoleManagement />
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge">
            <AssistantKnowledgeBaseAdmin />
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <UnansweredQuestionsAdmin />
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap">
            <MarketplaceRoadmapAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
