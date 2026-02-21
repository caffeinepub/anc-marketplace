import React from 'react';
import { useGetAdminDashboardData, useGetCallerUserProfile, useGetAdminFinancialState, useInitializeAccessControl } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import AdminConsoleLayout from '../components/admin/AdminConsoleLayout';
import FinancialOverviewCards from '../components/admin/financial/FinancialOverviewCards';
import PaymentProcessorsPanel from '../components/admin/payments/PaymentProcessorsPanel';
import AdminRevenueInflowPanel from '../components/admin/payments/AdminRevenueInflowPanel';
import FeeConfigurationPanel from '../components/admin/fees/FeeConfigurationPanel';
import AdminTransactionsPanel from '../components/admin/transactions/AdminTransactionsPanel';
import EmployeePaymentsPanel from '../components/admin/employees/EmployeePaymentsPanel';
import TransfersStubPanel from '../components/admin/transfers/TransfersStubPanel';
import UserRoleManagement from '../components/admin/UserRoleManagement';
import MarketplaceRoadmapAdmin from '../components/admin/MarketplaceRoadmapAdmin';
import AdminAccessLinksPanel from '../components/admin/AdminAccessLinksPanel';
import RoleApplicationsPanel from '../components/admin/RoleApplicationsPanel';
import AllAccountsPanel from '../components/admin/accounts/AllAccountsPanel';
import SalesReportsPanel from '../components/admin/analytics/SalesReportsPanel';
import AdminMessagingPanel from '../components/admin/messaging/AdminMessagingPanel';
import AdminDropdownMenu from '../components/admin/AdminDropdownMenu';

export default function AdminCenterPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: dashboardData, isLoading: dataLoading, error: dataError, refetch: refetchData } = useGetAdminDashboardData();
  const { data: financialState, isLoading: financialLoading } = useGetAdminFinancialState();
  const initializeAccessControl = useInitializeAccessControl();

  const isAuthenticated = !!identity;
  const [initializationAttempted, setInitializationAttempted] = React.useState(false);
  const [initializationComplete, setInitializationComplete] = React.useState(false);

  // Trigger access control initialization when actor is ready
  React.useEffect(() => {
    if (isAuthenticated && actor && !initializationAttempted && !initializeAccessControl.isPending) {
      console.log('[AdminCenterPage] Starting access control initialization', {
        principal: identity?.getPrincipal().toString(),
        timestamp: new Date().toISOString()
      });
      
      setInitializationAttempted(true);
      
      initializeAccessControl.mutate(undefined, {
        onSuccess: () => {
          console.log('[AdminCenterPage] Access control initialized successfully');
          setInitializationComplete(true);
        },
        onError: (error: any) => {
          console.error('[AdminCenterPage] Access control initialization error:', error);
          
          // Check if error is "already initialized" - this is actually success
          if (error?.message?.includes('already initialized')) {
            console.log('[AdminCenterPage] Access control already initialized - treating as success');
            setInitializationComplete(true);
          } else {
            console.error('[AdminCenterPage] Unexpected initialization error:', {
              error,
              message: error?.message,
              stack: error?.stack
            });
          }
        }
      });
    }
  }, [isAuthenticated, actor, initializationAttempted, initializeAccessControl, identity]);

  // Show loading while initializing identity
  if (isInitializing) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Loading authentication..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminConsoleLayout>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Authentication Required"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in with Internet Identity to access the Admin Center.
          </AlertDescription>
        </Alert>
      </AdminConsoleLayout>
    );
  }

  // Show loading while actor is being created or access control is initializing
  if (!actor || (initializeAccessControl.isPending && !initializationComplete)) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Initializing..."
      >
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {!actor ? 'Connecting to backend...' : 'Setting up admin permissions...'}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Principal: {identity?.getPrincipal().toString().slice(0, 30)}...
          </p>
        </div>
      </AdminConsoleLayout>
    );
  }

  // Initialization error (only show if it's not "already initialized")
  if (initializeAccessControl.isError && !initializationComplete) {
    const error = initializeAccessControl.error as any;
    const errorMessage = error?.message || 'Unknown error occurred';
    
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Initialization Error"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Failed to initialize access control.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('[AdminCenterPage] Retry button clicked');
                  setInitializationAttempted(false);
                  setInitializationComplete(false);
                  initializeAccessControl.reset();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
            <div className="mt-2 p-3 bg-destructive/10 rounded text-sm">
              <p className="font-semibold mb-1">Error Details:</p>
              <p className="font-mono text-xs">{errorMessage}</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Your Principal:</p>
              <p className="font-mono break-all">{identity?.getPrincipal().toString()}</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>If you are an owner admin, this error should not occur. Please contact support.</p>
            </div>
          </AlertDescription>
        </Alert>
      </AdminConsoleLayout>
    );
  }

  // Data loading error
  if (dataError) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Data Loading Failed"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load dashboard data. Please try again.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchData()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </AdminConsoleLayout>
    );
  }

  // Show loading while fetching initial data
  if (profileLoading || dataLoading || financialLoading) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Loading dashboard data..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminConsoleLayout>
    );
  }

  // Success - show initialization confirmation briefly if just completed
  const showInitSuccess = initializationComplete && initializationAttempted;

  return (
    <AdminConsoleLayout
      title="Admin Center"
      subtitle="Manage your business operations and settings"
    >
      <div className="space-y-6">
        {showInitSuccess && (
          <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-emerald-800 dark:text-emerald-200">
              Admin access initialized successfully. Welcome to the Admin Center!
            </AlertDescription>
          </Alert>
        )}

        {/* Admin Actions Dropdown Menu */}
        <div className="flex justify-end">
          <AdminDropdownMenu />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-10 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="transfers">Transfers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {financialState && <FinancialOverviewCards financialState={financialState} />}
            
            <Card>
              <CardHeader>
                <CardTitle>Admin Access Links</CardTitle>
                <CardDescription>
                  Share these links to provide access to your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminAccessLinksPanel />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Role Management</CardTitle>
                <CardDescription>
                  Overview of user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserRoleManagement />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Applications</CardTitle>
                <CardDescription>
                  Review and manage pending role applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoleApplicationsPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <AllAccountsPanel />
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <SalesReportsPanel />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <AdminMessagingPanel />
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Roadmap</CardTitle>
                <CardDescription>
                  Track the progress of marketplace features and initiatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketplaceRoadmapAdmin />
              </CardContent>
            </Card>

            {dashboardData && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Page Sections Status</CardTitle>
                  <CardDescription>
                    Current status of various admin sections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.adminSections.map((section) => (
                      <div
                        key={section.section}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <p className="font-medium capitalize">
                            {section.section.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          {section.details && (
                            <p className="text-sm text-muted-foreground">
                              {section.details.notes}
                            </p>
                          )}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            section.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                              : section.status === 'inProgress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          }`}
                        >
                          {section.status === 'completed'
                            ? 'Completed'
                            : section.status === 'inProgress'
                              ? 'In Progress'
                              : 'Coming Soon'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentProcessorsPanel />
            <AdminRevenueInflowPanel />
          </TabsContent>

          <TabsContent value="fees" className="space-y-6">
            <FeeConfigurationPanel />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <AdminTransactionsPanel />
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <EmployeePaymentsPanel />
          </TabsContent>

          <TabsContent value="transfers" className="space-y-6">
            <TransfersStubPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminConsoleLayout>
  );
}
