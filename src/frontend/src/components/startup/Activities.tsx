import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { useGetUserActivities, useCompleteActivity } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function Activities() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: activities = [], isLoading } = useGetUserActivities(principal);
  const completeActivity = useCompleteActivity();

  const completedCount = activities.filter((a) => a.isCompleted).length;
  const progressPercentage = activities.length > 0 ? (completedCount / activities.length) * 100 : 0;

  const handleComplete = async (activityId: string) => {
    try {
      await completeActivity.mutateAsync(activityId);
      toast.success('Activity marked as complete!');
    } catch (error) {
      toast.error('Failed to mark activity as complete');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading activities...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Workflow</CardTitle>
              <CardDescription>Complete real-world startup tasks to build your business foundation</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {completedCount} / {activities.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Completion Progress</span>
              <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">How Activities Work</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>Click on an activity to access external tools and resources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>Complete the task using the provided platform (e.g., business registration, planning tools)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>Return here and mark the activity as complete to track your progress</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Activities Available Yet</h3>
              <p className="text-muted-foreground mb-4">
                Your activity workflow will be populated soon. Check back later for startup tasks.
              </p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className={`hover:shadow-md transition-shadow ${activity.isCompleted ? 'bg-muted/30' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${activity.isCompleted ? 'bg-primary/10' : 'bg-muted'}`}>
                      {activity.isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl">{activity.title}</CardTitle>
                        {activity.isCompleted && <Badge variant="default">Completed</Badge>}
                      </div>
                      <CardDescription className="text-base">{activity.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline">
                      <a href={activity.resourceLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Tool
                      </a>
                    </Button>
                    {!activity.isCompleted && (
                      <Button
                        onClick={() => handleComplete(activity.id)}
                        disabled={completeActivity.isPending}
                        size="sm"
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
