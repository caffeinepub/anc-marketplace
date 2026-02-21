import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useRoleBasedRedirect } from '../hooks/useRoleBasedRedirect';
import { UserRole } from '../backend';
import { Store, ShoppingCart, Building2, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();
  const { redirectPath } = useRoleBasedRedirect();
  const navigate = useNavigate();
  
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const roles = [
    {
      role: UserRole.seller,
      icon: Store,
      title: 'Seller',
      description: 'Sell products and manage your online store',
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    },
    {
      role: UserRole.customer,
      icon: ShoppingCart,
      title: 'Customer',
      description: 'Shop products and track your orders',
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
    },
    {
      role: UserRole.business,
      icon: Building2,
      title: 'Business',
      description: 'Access B2B services and business credit',
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    },
    {
      role: UserRole.marketer,
      icon: TrendingUp,
      title: 'Affiliate Marketer',
      description: 'Earn commissions by promoting products',
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    },
  ];

  const handleRoleSelect = async (role: UserRole) => {
    if (!isAuthenticated) {
      // Store selected role and trigger login
      setSelectedRole(role);
      try {
        await login();
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Failed to login. Please try again.');
      }
    } else {
      setSelectedRole(role);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        fullName: fullName.trim(),
        email: email.trim(),
        activeRole: selectedRole,
        subscriptionId: undefined,
        accountCreated: BigInt(Date.now() * 1000000),
      });

      toast.success('Registration successful!');
      
      // Navigate to role-specific dashboard
      if (redirectPath) {
        navigate({ to: redirectPath as any });
      } else {
        navigate({ to: '/' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to complete registration. Please try again.');
    }
  };

  // Show role selection if not authenticated or no role selected
  if (!isAuthenticated || !selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Join ANC Marketplace</h1>
              <p className="text-lg text-slate-600">Choose your role to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map(({ role, icon: Icon, title, description, color }) => (
                <Card
                  key={role}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    selectedRole === role ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleRoleSelect(role)}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4 transition-colors`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {isLoggingIn && (
              <div className="mt-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Logging in...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show profile form after role selection and authentication
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Registration</CardTitle>
              <CardDescription>
                You've selected: <strong>{roles.find(r => r.role === selectedRole)?.title}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={saveProfile.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={saveProfile.isPending}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedRole(null)}
                    disabled={saveProfile.isPending}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={saveProfile.isPending}>
                    {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saveProfile.isPending ? 'Creating Account...' : 'Complete Registration'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
