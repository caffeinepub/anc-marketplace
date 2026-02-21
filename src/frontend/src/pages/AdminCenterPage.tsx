import React from 'react';
import { useGetAdminDashboardData, useGetCallerUserProfile, useGetAdminFinancialState, useInitializeAccessControl } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
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

export default function AdminCenterPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: dashboardData, isLoading: dataLoading, error: dataError, refetch: refetchData } = useGetAdminDashboardData();
  const { data: financialState, isLoading: financialLoading } = useGetAdminFinancialState();
  const initializeAccessControl = useInitializeAccessControl();

  const isAuthenticated = !!identity;
  const [initializationAttempted, setInitializationAttempted] = React.useState(false);
  const [errorDetails, setErrorDetails] = React.useState<string>('');

  // Trigger first-user admin assignment on mount when authenticated
  React.useEffect(() => {
    if (isAuthenticated && !initializationAttempted && !initializeAccessControl.isPending) {
      console.log('[AdminCenterPage] Starting access control initialization', {
        principal: identity?.getPrincipal().toString(),
        timestamp: new Date().toISOString()
      });
      
      setInitializationAttempted(true);
      
      initializeAccessControl.mutate(undefined, {
        onSuccess: () => {
          console.log('[AdminCenterPage] Access control initialized successfully');
        },
        onError: (error: any) => {
          console.error('[AdminCenterPage] Access control initialization failed:', {
            error,
            message: error?.message,
            stack: error?.stack,
            timestamp: new Date().toISOString()
          });
          setErrorDetails(error?.message || 'Unknown error occurred');
        }
      });
    }
  }, [isAuthenticated, initializationAttempted, initializeAccessControl, identity]);

  // Show loading while initializing
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
            You must be logged in to access the Admin Center.
          </AlertDescription>
        </Alert>
      </AdminConsoleLayout>
    );
  }

  // Show loading while initializing access control or checking profile
  if (initializeAccessControl.isPending || profileLoading) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Initializing access control..."
      >
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Setting up admin permissions for principal: {identity?.getPrincipal().toString().slice(0, 20)}...
          </p>
        </div>
      </AdminConsoleLayout>
    );
  }

  // Initialization error
  if (initializeAccessControl.isError) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Initialization Failed"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Failed to initialize access control. Please try again.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('[AdminCenterPage] Retry button clicked');
                  setInitializationAttempted(false);
                  setErrorDetails('');
                  initializeAccessControl.reset();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
            {errorDetails && (
              <div className="mt-2 p-2 bg-destructive/10 rounded text-xs font-mono">
                Error: {errorDetails}
              </div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              Principal: {identity?.getPrincipal().toString()}
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

  // Show loading while fetching data
  if (dataLoading || financialLoading) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Loading dashboard..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminConsoleLayout>
    );
  }

  return (
    <AdminConsoleLayout
      title="Admin Center"
      subtitle="Manage your marketplace operations"
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {financialState && <FinancialOverviewCards financialState={financialState} />}
          <AdminAccessLinksPanel />
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
              <CardDescription>Current development status of marketplace features</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketplaceRoadmapAdmin />
            </CardContent>
          </Card>
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

        <TabsContent value="roles" className="space-y-6">
          <UserRoleManagement />
          <RoleApplicationsPanel />
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <EmployeePaymentsPanel />
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
          <TransfersStubPanel />
        </TabsContent>
      </Tabs>
    </AdminConsoleLayout>
  );
}
