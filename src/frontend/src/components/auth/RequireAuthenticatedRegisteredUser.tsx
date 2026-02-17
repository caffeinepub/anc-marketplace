import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2 } from 'lucide-react';

interface RequireAuthenticatedRegisteredUserProps {
  children: React.ReactNode;
}

export default function RequireAuthenticatedRegisteredUser({
  children,
}: RequireAuthenticatedRegisteredUserProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Show loading state while checking authentication and profile
  if (isLoggingIn || profileLoading || !isFetched) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated: show login required screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to access seller onboarding.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              size="lg"
              className="w-full"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but no profile: redirect to profile setup
  if (!userProfile) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/seller/onboarding';
    navigate({
      to: '/profile-setup',
      search: { redirect: currentPath },
    });
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to profile setup...</p>
        </div>
      </div>
    );
  }

  // Authenticated with profile: render children
  return <>{children}</>;
}
