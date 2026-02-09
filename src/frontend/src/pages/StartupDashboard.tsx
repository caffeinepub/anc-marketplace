import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, BookOpen, Video, CheckSquare, CreditCard } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import ClassesLessons from '../components/startup/ClassesLessons';
import VirtualMeetings from '../components/startup/VirtualMeetings';
import Activities from '../components/startup/Activities';
import BusinessCredit from '../components/startup/BusinessCredit';

export default function StartupDashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>Please log in to access the Startup Dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (userProfile && userProfile.activeRole !== 'startUpMember') {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>
            You need a Startup Program membership to access this dashboard. Please subscribe to the Startup Program plan.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate({ to: '/store' })}>View Plans</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Startup Program Dashboard</h1>
        <p className="text-muted-foreground">Your journey to business success starts here</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <BookOpen className="h-5 w-5 text-primary mb-2" />
            <CardTitle className="text-sm font-medium">Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Video className="h-5 w-5 text-primary mb-2" />
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CheckSquare className="h-5 w-5 text-primary mb-2" />
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CreditCard className="h-5 w-5 text-primary mb-2" />
            <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Progress</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            Classes & Lessons
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Video className="h-4 w-4 mr-2" />
            Virtual Meetings
          </TabsTrigger>
          <TabsTrigger value="activities">
            <CheckSquare className="h-4 w-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="credit">
            <CreditCard className="h-4 w-4 mr-2" />
            Business Credit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <ClassesLessons />
        </TabsContent>

        <TabsContent value="meetings">
          <VirtualMeetings />
        </TabsContent>

        <TabsContent value="activities">
          <Activities />
        </TabsContent>

        <TabsContent value="credit">
          <BusinessCredit />
        </TabsContent>
      </Tabs>
    </div>
  );
}
