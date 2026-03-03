import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { useEffect } from "react";

interface RequireRegisteredUserProps {
  children: React.ReactNode;
}

export default function RequireRegisteredUser({
  children,
}: RequireRegisteredUserProps) {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const {
    data: userProfile,
    isLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && isFetched && userProfile === null) {
      navigate({ to: "/profile-setup" });
    }
  }, [isAuthenticated, isFetched, userProfile, navigate]);

  // Not authenticated: allow public access
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Loading profile
  if (isLoading || !isFetched) {
    return <>{children}</>;
  }

  // Profile exists
  if (userProfile) {
    return <>{children}</>;
  }

  // Redirecting to profile setup
  return null;
}
