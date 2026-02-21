import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { UserRole } from '../backend';

interface ProfileSetupProps {
  roleSelection?: UserRole;
}

export default function ProfileSetup({ roleSelection }: ProfileSetupProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      return;
    }

    try {
      await saveProfile.mutateAsync({
        fullName: fullName.trim(),
        email: email.trim(),
        activeRole: roleSelection || UserRole.customer,
        subscriptionId: undefined,
        accountCreated: BigInt(Date.now() * 1_000_000),
      });

      const redirectPath = search.redirect || (roleSelection ? getRoleRedirect(roleSelection) : '/');
      navigate({ to: redirectPath as any });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const getRoleRedirect = (role: UserRole): string => {
    const roleRouteMap: Record<UserRole, string> = {
      [UserRole.seller]: '/seller-dashboard',
      [UserRole.customer]: '/customer-dashboard',
      [UserRole.business]: '/business-dashboard',
      [UserRole.marketer]: '/affiliate-dashboard',
      [UserRole.employee]: '/employee-dashboard',
      [UserRole.admin]: '/admin',
      [UserRole.guest]: '/',
    };
    return roleRouteMap[role] || '/';
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-menu-border shadow-lg">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your information to continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={saveProfile.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={saveProfile.isPending}
            />
          </div>

          {saveProfile.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to save profile. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
