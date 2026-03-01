import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAdminFinancialState, useGetAdminDashboardData } from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminConsoleLayout from '../components/admin/AdminConsoleLayout';
import FinancialOverviewCards from '../components/admin/financial/FinancialOverviewCards';
import PaymentProcessorsPanel from '../components/admin/payments/PaymentProcessorsPanel';
import FeeConfigurationPanel from '../components/admin/fees/FeeConfigurationPanel';
import AdminTransactionsPanel from '../components/admin/transactions/AdminTransactionsPanel';
import EmployeePaymentsPanel from '../components/admin/employees/EmployeePaymentsPanel';
import TransferPanel from '../components/admin/transfers/TransferPanel';
import AdminRevenueInflowPanel from '../components/admin/payments/AdminRevenueInflowPanel';
import AdminAccessLinksPanel from '../components/admin/AdminAccessLinksPanel';
import { Variant_completed_comingSoon_inProgress } from '../backend';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: financialState, isLoading: isFinancialLoading, error: financialError, refetch: refetchFinancial } = useGetAdminFinancialState();
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetAdminDashboardData();
  const { actor } = React.useContext(React.createContext<any>(null)) ?? {};

  const [activeTab, setActiveTab] = React.useState('overview');
  const [initializationAttempted, setInitializationAttempted] = React.useState(false);
  const [initPending, setInitPending] = React.useState(false);
  const [initError, setInitError] = React.useState(false);

  const isAuthenticated = !!identity;

  React.useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: '/' });
    }
  }, [identity, isInitializing, navigate]);

  const getStatusBadgeVariant = (status: Variant_completed_comingSoon_inProgress) => {
    switch (status) {
      case Variant_completed_comingSoon_inProgress.completed: return 'default';
      case Variant_completed_comingSoon_inProgress.inProgress: return 'secondary';
      case Variant_completed_comingSoon_inProgress.comingSoon: return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: Variant_completed_comingSoon_inProgress) => {
    switch (status) {
      case Variant_completed_comingSoon_inProgress.completed: return 'Completed';
      case Variant_completed_comingSoon_inProgress.inProgress: return 'In Progress';
      case Variant_completed_comingSoon_inProgress.comingSoon: return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  if (isInitializing || !identity) {
    return (
      <AdminConsoleLayout title="Admin Dashboard" subtitle="Initializing...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminConsoleLayout>
    );
  }

  return (
    <AdminConsoleLayout
      title="Admin Dashboard"
      subtitle="Comprehensive platform management and business operations"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isFinancialLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          ) : financialError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Failed to load financial data. Please try again.</span>
                <Button variant="outline" size="sm" onClick={() => refetchFinancial()} className="ml-4">
                  <RefreshCw className="h-4 w-4 mr-2" />Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : financialState ? (
            <FinancialOverviewCards financialState={financialState} />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No financial data available.</AlertDescription>
            </Alert>
          )}
          <AdminAccessLinksPanel />
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          {isDashboardLoading ? (
            <Skeleton className="h-96" />
          ) : dashboardData ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {dashboardData.adminSections.map((section) => (
                  <div key={section.section} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{section.section}</h3>
                      <Badge variant={getStatusBadgeVariant(section.status)}>
                        {getStatusLabel(section.status)}
                      </Badge>
                    </div>
                    {section.details && (
                      <p className="text-sm text-muted-foreground">{section.details.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No status data available.</AlertDescription>
            </Alert>
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
          <TransferPanel />
        </TabsContent>
      </Tabs>
    </AdminConsoleLayout>
  );
}
