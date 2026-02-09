import React from 'react';
import { useGetAdminDashboardData, useUpdateMarketplaceRoadmap } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Map, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function MarketplaceRoadmapAdmin() {
  const { data: dashboardData, isLoading, error } = useGetAdminDashboardData();
  const updateRoadmap = useUpdateMarketplaceRoadmap();

  const handleRefresh = async () => {
    try {
      await updateRoadmap.mutateAsync();
    } catch (error) {
      console.error('Failed to update roadmap:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 shadow-md">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading roadmap data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const errorMessage = String(error);
    const isPermissionError = errorMessage.includes('Permission denied') || errorMessage.includes('Unauthorized');

    return (
      <Card className="border-destructive/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            {isPermissionError ? 'Access Denied' : 'Error Loading Roadmap'}
          </CardTitle>
          <CardDescription>
            {isPermissionError
              ? 'You do not have permission to view the roadmap'
              : 'Failed to load roadmap data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const roadmapItems = dashboardData?.marketplaceRoadmap || [];
  const completedCount = roadmapItems.filter(item => item.completed).length;
  const totalCount = roadmapItems.length;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Marketplace Roadmap</CardTitle>
                <CardDescription className="text-base mt-1">
                  Track development progress and upcoming features
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={updateRoadmap.isPending}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              {updateRoadmap.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold text-primary">{completedCount} of {totalCount} completed</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">{overallProgress}% complete</p>
          </div>
          {updateRoadmap.isSuccess && (
            <Alert className="border-primary bg-primary/5 mt-4">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary">Roadmap updated successfully!</AlertDescription>
            </Alert>
          )}
          {updateRoadmap.isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{String(updateRoadmap.error)}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Roadmap Items */}
      <div className="grid gap-4">
        {roadmapItems.map((item) => (
          <Card key={item.roadmapId} className="border-primary/20 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg mt-0.5 ${item.completed ? 'bg-primary/10' : 'bg-muted'}`}>
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1">{item.name}</CardTitle>
                    <CardDescription className="text-sm">{item.notes}</CardDescription>
                  </div>
                </div>
                <Badge
                  className={
                    item.completed
                      ? 'bg-primary/10 text-primary border-primary/20 flex-shrink-0'
                      : 'bg-muted text-muted-foreground border-muted-foreground/20 flex-shrink-0'
                  }
                >
                  {item.completed ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{Number(item.progressPercentage)}%</span>
                </div>
                <Progress value={Number(item.progressPercentage)} className="h-2" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last updated: {new Date(Number(item.lastUpdated) / 1000000).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roadmapItems.length === 0 && (
        <Card className="border-primary/20 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Map className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No roadmap items available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
