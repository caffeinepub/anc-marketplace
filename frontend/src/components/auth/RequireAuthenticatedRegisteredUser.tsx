import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../../hooks/useQueries";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";

interface RequireAuthenticatedRegisteredUserProps {
  children: React.ReactNode;
}

export default function RequireAuthenticatedRegisteredUser({
  children,
}: RequireAuthenticatedRegisteredUserProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const {
    data: userProfile,
    isLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (isAuthenticated && isFetched && userProfile === null) {
      navigate({ to: "/profile-setup", search: { redirect: location.pathname } });
    }
  }, [isAuthenticated, isFetched, userProfile, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access this page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => login()} disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !isFetched) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return <>{children}</>;
}
