import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, Users, TrendingUp, FileText, HelpCircle, BookOpen, ExternalLink } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function B2BDashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>Please log in to access the B2B Dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (userProfile && userProfile.activeRole !== 'b2bMember') {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>
            You need a B2B membership to access this dashboard. Please subscribe to the B2B Services plan.
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
        <h1 className="text-4xl font-bold mb-2">B2B Services Dashboard</h1>
        <p className="text-muted-foreground">Manage your business services and client relationships</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle>Quick Links</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" onClick={() => navigate({ to: '/sellers-businesses-faq' })} className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Sellers & Businesses FAQ
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/sellers-businesses-blog' })} className="gap-2">
              <BookOpen className="h-4 w-4" />
              Business Blog
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <Briefcase className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Manage your ongoing projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">0</div>
            <p className="text-sm text-muted-foreground">No active projects yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Clients</CardTitle>
            <CardDescription>Track your client relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">0</div>
            <p className="text-sm text-muted-foreground">No clients yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Your earnings overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">$0.00</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to B2B Services</CardTitle>
          <CardDescription>Get started with your business services platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your B2B dashboard provides tools for managing client relationships, tracking projects, and growing your business.
            Features will be populated as you start using the platform.
          </p>
          <div className="flex gap-3">
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              Create Project
            </Button>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Add Client
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
