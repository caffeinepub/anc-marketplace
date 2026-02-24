import React from 'react';
import { useGetAdminDashboardData, useGetAdminFinancialState } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
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
  const { actor, isFetching: actorFetching } = useActor();
  const { data: dashboardData, isLoading: dataLoading, error: dataError, refetch: refetchData } = useGetAdminDashboardData();
  const { data: financialState, isLoading: financialLoading, error: financialError, refetch: refetchFinancial } = useGetAdminFinancialState();

  const [actorTimeout, setActorTimeout] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);

  // Timeout mechanism for actor creation - if it takes more than 15 seconds
  React.useEffect(() => {
    if (!actor && actorFetching && !actorTimeout) {
      const timeoutId = setTimeout(() => {
        if (!actor && actorFetching) {
          console.error('[AdminCenterPage] Actor creation timeout after 15 seconds');
          setActorTimeout(true);
        }
      }, 15000);

      return () => clearTimeout(timeoutId);
    } else if (actor) {
      setActorTimeout(false);
    }
  }, [actor, actorFetching, actorTimeout]);

  // Auto-retry on error (up to 3 times)
  React.useEffect(() => {
    if ((dataError || financialError) && retryCount < 3) {
      const errorMessage = ((dataError || financialError) as any)?.message || '';
      
      // Only auto-retry on authorization errors
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Only admins')) {
        console.log(`[AdminCenterPage] Auto-retrying after authorization error (attempt ${retryCount + 1}/3)`);
        
        const retryTimeout = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          refetchData();
          refetchFinancial();
        }, 2000); // Wait 2 seconds before retry

        return () => clearTimeout(retryTimeout);
      }
    }
  }, [dataError, financialError, retryCount, refetchData, refetchFinancial]);

  // Actor creation timeout
  if (actorTimeout) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Connection Timeout"
      >
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Backend Connection Timed Out</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>The connection to the backend is taking longer than expected (over 15 seconds).</p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('[AdminCenterPage] Retry after actor timeout');
                  setActorTimeout(false);
                  setRetryCount(0);
                  window.location.reload();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <p><strong>Possible causes:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Slow internet connection</li>
                <li>Backend canister is busy or unresponsive</li>
                <li>Network connectivity issues</li>
              </ul>
              <p className="mt-2"><strong>Suggestions:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Wait a moment and try again</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </AdminConsoleLayout>
    );
  }

  // Show loading while actor is being created
  if (!actor || actorFetching) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Initializing..."
      >
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Connecting to backend...
          </p>
        </div>
      </AdminConsoleLayout>
    );
  }

  // Data loading error
  if (dataError || financialError) {
    const error = dataError || financialError;
    const errorMessage = (error as any)?.message || 'Unknown error occurred';
    
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Data Loading Failed"
      >
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Failed to Load Dashboard Data</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Unable to load admin dashboard data from the backend.</p>
            {retryCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Auto-retry attempt {retryCount} of 3...
              </p>
            )}
            <div className="mt-2 p-3 bg-destructive/10 rounded text-sm">
              <p className="font-semibold mb-1">Error Details:</p>
              <p className="font-mono text-xs break-all">{errorMessage}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('[AdminCenterPage] Manual retry data loading');
                  setRetryCount(0);
                  refetchData();
                  refetchFinancial();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRetryCount(0);
                  window.location.reload();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <p><strong>Suggestions:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Click Retry to attempt loading again</li>
                <li>Refresh the page to restart the connection</li>
                <li>Clear your browser cache and try again</li>
                <li>The backend may be updating - wait a moment and retry</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </AdminConsoleLayout>
    );
  }

  // Show loading while fetching initial data
  if (dataLoading || financialLoading) {
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

  // If financial state is not available, show error
  if (!financialState) {
    return (
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Data Not Available"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Financial Data Not Available</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Unable to load financial state data from the backend.</p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRetryCount(0);
                  window.location.reload();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </AdminConsoleLayout>
    );
  }

  return (
    <AdminConsoleLayout
      title="Admin Center"
      subtitle="Comprehensive business management and financial oversight"
    >
      <div className="space-y-6">
        {/* Admin Dropdown Menu */}
        <div className="flex justify-end">
          <AdminDropdownMenu />
        </div>

        {/* Financial Overview Cards */}
        <FinancialOverviewCards financialState={financialState} />

        {/* Tabbed Interface */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="transfers">Transfers</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard Overview</CardTitle>
                <CardDescription>
                  Quick access to key administrative functions and system status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AdminAccessLinksPanel />
                <UserRoleManagement />
                <RoleApplicationsPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <MarketplaceRoadmapAdmin />
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
            <SalesReportsPanel />
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <EmployeePaymentsPanel />
          </TabsContent>

          <TabsContent value="transfers" className="space-y-6">
            <TransfersStubPanel />
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <AllAccountsPanel />
            <AdminMessagingPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminConsoleLayout>
  );
}
