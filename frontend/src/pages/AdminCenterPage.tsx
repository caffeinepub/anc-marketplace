import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LayoutDashboard, Users, DollarSign, BarChart2, Settings,
  ArrowRightLeft, CreditCard, MessageSquare, BookOpen,
  ShieldCheck, RefreshCw, AlertCircle, Loader2,
} from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import FinancialOverviewCards from '../components/admin/financial/FinancialOverviewCards';
import AdminTransactionsPanel from '../components/admin/transactions/AdminTransactionsPanel';
import AllAccountsPanel from '../components/admin/accounts/AllAccountsPanel';
import SalesReportsPanel from '../components/admin/analytics/SalesReportsPanel';
import FeeConfigurationPanel from '../components/admin/fees/FeeConfigurationPanel';
import EmployeePaymentsPanel from '../components/admin/employees/EmployeePaymentsPanel';
import AdminMessagingPanel from '../components/admin/messaging/AdminMessagingPanel';
import AssistantKnowledgeBaseAdmin from '../components/admin/assistant/AssistantKnowledgeBaseAdmin';
import UnansweredQuestionsAdmin from '../components/admin/assistant/UnansweredQuestionsAdmin';
import RoleApplicationsPanel from '../components/admin/RoleApplicationsPanel';
import UserRoleManagement from '../components/admin/UserRoleManagement';
import MarketplaceRoadmapAdmin from '../components/admin/MarketplaceRoadmapAdmin';
import AdminAccessLinksPanel from '../components/admin/AdminAccessLinksPanel';
import PaymentsPanel from '../components/admin/payments/PaymentsPanel';
import TransferPanel from '../components/admin/transfers/TransferPanel';
import {
  useGetAdminFinancialState,
  useGetTransactionLedger,
} from '../hooks/useQueries';

export default function AdminCenterPage() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('overview');
  const [initAttempts, setInitAttempts] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const { data: financialState, isLoading: financialLoading } = useGetAdminFinancialState();
  const { data: transactions = [] } = useGetTransactionLedger();

  // Auto-initialize access control
  useEffect(() => {
    if (!actor || actorFetching || isInitializing || initAttempts >= 3) return;

    const initialize = async () => {
      setIsInitializing(true);
      setInitError(null);
      try {
        await actor.initializeAccessControl();
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (!msg.includes('already initialized') && !msg.includes('Unauthorized')) {
          setInitError(msg);
          setInitAttempts((prev) => prev + 1);
          setIsInitializing(false);
          return;
        }
      }
      setInitAttempts((prev) => prev + 1);
      setIsInitializing(false);
    };

    initialize();
  }, [actor, actorFetching, initAttempts, isInitializing]);

  const handleRetry = () => {
    setInitAttempts(0);
    setInitError(null);
    queryClient.invalidateQueries();
  };

  if (actorFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-slate-600 font-medium">Loading Admin Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur border-b border-slate-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h1 className="text-white font-bold text-lg">Admin Center</h1>
              <p className="text-slate-400 text-xs">ANC Electronics & Services</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {identity && (
              <Badge variant="outline" className="text-emerald-400 border-emerald-600 text-xs hidden sm:flex">
                {identity.getPrincipal().toString().slice(0, 12)}...
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {initError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Initialization warning: {initError}
              <Button variant="link" size="sm" onClick={handleRetry} className="ml-2 p-0 h-auto">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="bg-slate-800/60 border border-slate-700 h-auto flex-wrap gap-1 p-1 min-w-max">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />Overview
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />Payments
              </TabsTrigger>
              <TabsTrigger
                value="transfers"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />Transfer
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <DollarSign className="w-3.5 h-3.5 mr-1.5" />Transactions
              </TabsTrigger>
              <TabsTrigger
                value="accounts"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <Users className="w-3.5 h-3.5 mr-1.5" />Accounts
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <BarChart2 className="w-3.5 h-3.5 mr-1.5" />Analytics
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <Users className="w-3.5 h-3.5 mr-1.5" />Employees
              </TabsTrigger>
              <TabsTrigger
                value="messaging"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />Messaging
              </TabsTrigger>
              <TabsTrigger
                value="assistant"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />Assistant
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 text-xs px-3 py-1.5"
              >
                <Settings className="w-3.5 h-3.5 mr-1.5" />Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <FinancialOverviewCards financialState={financialState} isLoading={financialLoading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white/95">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">Recent Deposits & Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No transactions yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.slice(0, 5).map((txn) => (
                        <div key={txn.id} className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 truncate max-w-[60%]">{txn.source}</span>
                          <span className="font-semibold text-emerald-700">
                            ${(Number(txn.amountCents) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <MarketplaceRoadmapAdmin />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <UserRoleManagement />
              <RoleApplicationsPanel />
            </div>
            <AdminAccessLinksPanel />
          </TabsContent>

          {/* Payments Tab — no gate, renders immediately */}
          <TabsContent value="payments">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  External Payments
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Send payments to Stripe, employees, partners, suppliers, or pay bills.
                </p>
              </div>
              <PaymentsPanel />
            </div>
          </TabsContent>

          {/* Transfer Tab — renders immediately */}
          <TabsContent value="transfers">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                  Internal Transfers
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Transfer between Available Balance, Business Credit, and Payroll Savings.
                </p>
              </div>
              <TransferPanel />
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <AdminTransactionsPanel />
            </div>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <AllAccountsPanel />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <SalesReportsPanel />
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <EmployeePaymentsPanel />
            </div>
          </TabsContent>

          {/* Messaging Tab */}
          <TabsContent value="messaging">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <AdminMessagingPanel />
            </div>
          </TabsContent>

          {/* Assistant Tab */}
          <TabsContent value="assistant" className="space-y-4">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <AssistantKnowledgeBaseAdmin />
            </div>
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <UnansweredQuestionsAdmin />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm space-y-4">
              <FeeConfigurationPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
