import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Settings, CreditCard, FileText, ArrowRight } from 'lucide-react';

export default function AccountPortalPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <AccountPortalContent />
    </RequireAuthenticatedRegisteredUser>
  );
}

function AccountPortalContent() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Account Portal</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Account Overview */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>Your account information and status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{userProfile.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p className="font-medium">{formatDate(userProfile.accountCreated)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Role</p>
                    <p className="font-medium capitalize">
                      {userProfile.activeRole.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No profile information available.</p>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/settings' })}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure voice settings, permissions, and other account preferences.
              </p>
              <Button variant="outline" className="w-full">
                Go to Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Seller Profile */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/seller/profile' })}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle>Seller Profile</CardTitle>
                  <CardDescription>Business settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your store branding, dashboard customization, and business apps.
              </p>
              <Button variant="outline" className="w-full">
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/privacy-policy' })}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Policies</CardTitle>
                  <CardDescription>Legal documents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review privacy policy, terms of service, and other legal documents.
              </p>
              <Button variant="outline" className="w-full">
                View Policies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
