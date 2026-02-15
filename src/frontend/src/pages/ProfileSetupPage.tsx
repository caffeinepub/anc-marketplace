import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import ProfileSetup from '../components/ProfileSetup';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };

  const handleProfileComplete = () => {
    const redirectTo = search.redirect || '/';
    navigate({ to: redirectTo as any });
  };

  return <ProfileSetup onComplete={handleProfileComplete} />;
}
