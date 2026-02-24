import React from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface RequireRegisteredUserProps {
  children: React.ReactNode;
}

export default function RequireRegisteredUser({ children }: RequireRegisteredUserProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!identity;

  React.useEffect(() => {
    if (isAuthenticated && isFetched && userProfile === null) {
      navigate({
        to: '/profile-setup',
        search: { redirect: location.pathname },
      });
    }
  }, [isAuthenticated, isFetched, userProfile, navigate, location.pathname]);

  // Allow public access when not authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading while checking profile
  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to profile setup if no profile (handled by useEffect)
  if (userProfile === null) {
    return null;
  }

  // Render children when profile exists
  return <>{children}</>;
}
