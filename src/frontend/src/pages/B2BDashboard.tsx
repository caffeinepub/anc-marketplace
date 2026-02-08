import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Users, BarChart3, MessageSquare, Package, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AccessRole } from '../backend';

export default function B2BDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && userProfile.activeRole !== AccessRole.b2bMember) {
      navigate({ to: '/' });
    }
  }, [userProfile, navigate]);

  const stats = [
    { label: 'Active Projects', value: '12', icon: Briefcase, trend: '+3' },
    { label: 'Total Clients', value: '48', icon: Users, trend: '+8' },
    { label: 'Services Listed', value: '6', icon: Package, trend: '+2' },
    { label: 'Revenue (MTD)', value: '$24.5K', icon: TrendingUp, trend: '+12%' },
  ];

  const recentProjects = [
    { name: 'Website Development', client: 'Tech Corp', status: 'In Progress', value: '$5,000' },
    { name: 'Marketing Campaign', client: 'Retail Inc', status: 'Planning', value: '$3,500' },
    { name: 'IT Consulting', client: 'Finance Ltd', status: 'Completed', value: '$8,000' },
  ];

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">B2B Services Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile?.fullName}! Manage your B2B operations.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">
            <Briefcase className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="h-4 w-4 mr-2" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="services">
            <Package className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Track and manage your active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>{project.status}</Badge>
                      <span className="font-semibold">{project.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>Manage your client relationships and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Client management tools coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Marketplace</CardTitle>
              <CardDescription>List and manage your service offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Service marketplace coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reporting</CardTitle>
              <CardDescription>View detailed analytics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
