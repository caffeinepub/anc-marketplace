import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, CheckSquare, CreditCard, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AccessRole } from '../backend';
import ClassesLessons from '../components/startup/ClassesLessons';
import VirtualMeetings from '../components/startup/VirtualMeetings';
import Activities from '../components/startup/Activities';
import BusinessCredit from '../components/startup/BusinessCredit';

export default function StartupDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && userProfile.activeRole !== AccessRole.startUpMember) {
      navigate({ to: '/' });
    }
  }, [userProfile, navigate]);

  const sections = [
    {
      id: 'classes',
      title: 'Classes & Lessons',
      icon: BookOpen,
      description: 'Access structured curriculum and learning materials',
    },
    {
      id: 'meetings',
      title: 'Virtual Meetings',
      icon: Video,
      description: 'Join live sessions and workshops',
    },
    {
      id: 'activities',
      title: 'Activities',
      icon: CheckSquare,
      description: 'Complete real-world startup tasks',
    },
    {
      id: 'credit',
      title: 'Business Credit',
      icon: CreditCard,
      description: 'Build your business credit profile',
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Startup Program Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile?.fullName}! Track your startup journey.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-lg mb-2">{section.title}</CardTitle>
                <CardDescription className="text-sm">{section.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <TabsTrigger key={section.id} value={section.id}>
                <Icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{section.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="classes" className="mt-6">
          <ClassesLessons />
        </TabsContent>

        <TabsContent value="meetings" className="mt-6">
          <VirtualMeetings />
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <Activities />
        </TabsContent>

        <TabsContent value="credit" className="mt-6">
          <BusinessCredit />
        </TabsContent>
      </Tabs>
    </div>
  );
}
