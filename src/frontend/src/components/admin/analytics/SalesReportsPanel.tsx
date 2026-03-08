import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, TrendingUp } from "lucide-react";
import React from "react";
import { useGetAdminCenterAnalytics } from "../../../hooks/useQueries";
import SalesMetricsCards from "./SalesMetricsCards";

export default function SalesReportsPanel() {
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useGetAdminCenterAnalytics();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Reports & Analytics
            </CardTitle>
            <CardDescription>
              Comprehensive marketplace sales performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales Reports & Analytics
          </CardTitle>
          <CardDescription>
            Comprehensive marketplace sales performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load sales analytics. Please try again.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales Reports & Analytics
          </CardTitle>
          <CardDescription>
            Comprehensive marketplace sales performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No analytics data available.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SalesMetricsCards analytics={analytics} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Reports & Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive marketplace sales performance metrics
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-1">Average Transaction</p>
              <p className="text-xl font-bold">
                ${(analytics.averageTransactionAmountCents / 100).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-1">Failed/Success Ratio</p>
              <p className="text-xl font-bold">
                {(analytics.failedToSuccessRatio * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-1">Attempts per Success</p>
              <p className="text-xl font-bold">
                {analytics.attemptsPerSuccessfulTransaction.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-1">Success Rate</p>
              <p className="text-xl font-bold">
                {analytics.totalTransactions > 0
                  ? (
                      (analytics.successfulPayments /
                        analytics.totalTransactions) *
                      100
                    ).toFixed(1)
                  : "0.0"}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
