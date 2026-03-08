import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lock } from "lucide-react";
import React, { useState } from "react";
import AdminConsoleLayout from "../components/admin/AdminConsoleLayout";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

import AdminAccessLinksPanel from "../components/admin/AdminAccessLinksPanel";
import MarketplaceRoadmapAdmin from "../components/admin/MarketplaceRoadmapAdmin";
import UserRoleManagement from "../components/admin/UserRoleManagement";
import AllAccountsPanel from "../components/admin/accounts/AllAccountsPanel";
import SalesReportsPanel from "../components/admin/analytics/SalesReportsPanel";
import AssistantKnowledgeBaseAdmin from "../components/admin/assistant/AssistantKnowledgeBaseAdmin";
import EmployeePaymentsPanel from "../components/admin/employees/EmployeePaymentsPanel";
import FeeConfigurationPanel from "../components/admin/fees/FeeConfigurationPanel";
import FinancialOverviewCards from "../components/admin/financial/FinancialOverviewCards";
import StripeDepositCard from "../components/admin/financial/StripeDepositCard";
import AdminMessagingPanel from "../components/admin/messaging/AdminMessagingPanel";
// Admin panel components
import PaymentProcessorsPanel from "../components/admin/payments/PaymentProcessorsPanel";
import PaymentsPanel from "../components/admin/payments/PaymentsPanel";
import AdminTransactionsPanel from "../components/admin/transactions/AdminTransactionsPanel";
import TransferPanel from "../components/admin/transfers/TransferPanel";

export default function AdminCenterPage() {
  const { identity } = useInternetIdentity();
  const {
    data: isAdmin,
    isLoading: adminLoading,
    isFetched: adminFetched,
  } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState("overview");

  const isAuthenticated = !!identity;

  // Show loading while actor is initializing or admin check is in progress
  const showLoading = adminLoading;

  // Only show lock screen after we've confirmed the user is NOT admin
  // (isFetched ensures we don't flash the lock screen prematurely)
  const showLockScreen = isAuthenticated && adminFetched && !isAdmin;

  return (
    <RequireAuthenticatedRegisteredUser>
      <AdminConsoleLayout
        title="Admin Center"
        subtitle="Manage your marketplace, payments, and users"
      >
        {showLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Verifying access...
            </span>
          </div>
        ) : showLockScreen ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lock className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Admin Access Required
            </h2>
            <p className="text-muted-foreground max-w-md">
              You don't have admin privileges to access this page. Please
              contact an administrator.
            </p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap gap-1 h-auto mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="messaging">Messaging</TabsTrigger>
              <TabsTrigger value="assistant">Assistant</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <MarketplaceRoadmapAdmin />
                <UserRoleManagement />
                <AdminAccessLinksPanel />
              </div>
            </TabsContent>

            <TabsContent value="financial">
              <div className="space-y-6">
                <FinancialOverviewCards />
                <StripeDepositCard />
                <FeeConfigurationPanel />
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="space-y-6">
                <PaymentProcessorsPanel />
                <PaymentsPanel />
              </div>
            </TabsContent>

            <TabsContent value="transfer">
              <TransferPanel />
            </TabsContent>

            <TabsContent value="transactions">
              <AdminTransactionsPanel />
            </TabsContent>

            <TabsContent value="accounts">
              <AllAccountsPanel />
            </TabsContent>

            <TabsContent value="analytics">
              <SalesReportsPanel />
            </TabsContent>

            <TabsContent value="employees">
              <EmployeePaymentsPanel />
            </TabsContent>

            <TabsContent value="messaging">
              <AdminMessagingPanel />
            </TabsContent>

            <TabsContent value="assistant">
              <AssistantKnowledgeBaseAdmin />
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <AdminAccessLinksPanel />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </AdminConsoleLayout>
    </RequireAuthenticatedRegisteredUser>
  );
}
