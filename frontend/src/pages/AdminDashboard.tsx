import React from "react";
import { useGetAdminDashboardData } from "../hooks/useQueries";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";
import AdminConsoleLayout from "../components/admin/AdminConsoleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransferPanel from "../components/admin/transfers/TransferPanel";

export default function AdminDashboard() {
  const {
    data: dashboardData,
    isLoading,
    refetch,
    isFetching,
  } = useGetAdminDashboardData();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "inProgress":
        return (
          <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
        );
      case "comingSoon":
        return (
          <Badge className="bg-gray-100 text-gray-800">Coming Soon</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <RequireAuthenticatedRegisteredUser>
      <AdminConsoleLayout
        title="Admin Dashboard"
        subtitle="Overview of marketplace status and roadmap"
      >
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Admin Sections */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Platform Sections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData?.adminSections.map((section) => (
                  <Card key={section.section}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base capitalize">
                          {section.section}
                        </CardTitle>
                        {getStatusBadge(section.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {section.details && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">
                            v{section.details.version}
                          </span>{" "}
                          — {section.details.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Marketplace Roadmap */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Marketplace Roadmap
              </h2>
              <div className="space-y-4">
                {dashboardData?.marketplaceRoadmap.map((item) => (
                  <Card key={item.roadmapId}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Number(item.progressPercentage)}%
                          </span>
                          {item.completed && (
                            <Badge className="bg-green-100 text-green-800">
                              Done
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Progress
                        value={Number(item.progressPercentage)}
                        className="h-2 mb-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {item.notes}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Transfer Panel */}
            <TransferPanel />
          </div>
        )}
      </AdminConsoleLayout>
    </RequireAuthenticatedRegisteredUser>
  );
}
