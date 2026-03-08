import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React from "react";
import ProfileSetup from "../components/ProfileSetup";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function ProfileSetupPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Please log in to set up your profile.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile) {
    navigate({ to: "/" });
    return null;
  }

  return <ProfileSetup open={true} onComplete={() => navigate({ to: "/" })} />;
}
