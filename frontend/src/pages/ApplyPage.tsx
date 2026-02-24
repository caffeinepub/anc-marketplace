import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import { useGetCallerUserProfile, useSubmitRoleApplication } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserRole } from '../backend';
import { Briefcase, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplyPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const submitApplication = useSubmitRoleApplication();
  const navigate = useNavigate();
  
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  const [reason, setReason] = React.useState('');

  const roles = [
    {
      role: UserRole.employee,
      icon: Briefcase,
      title: 'Employee',
      description: 'Join our team and help build the marketplace',
      color: 'bg-teal-100 text-teal-600 hover:bg-teal-200',
    },
    {
      role: UserRole.admin,
      icon: Shield,
      title: 'Admin',
      description: 'Manage platform operations and user support',
      color: 'bg-red-100 text-red-600 hover:bg-red-200',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for your application');
      return;
    }

    try {
      await submitApplication.mutateAsync({
        requestedRole: selectedRole,
        reason: reason.trim(),
      });

      toast.success('Application submitted successfully! An admin will review it soon.');
      navigate({ to: '/' });
    } catch (error: any) {
      console.error('Application error:', error);
      if (error.message?.includes('already have a pending application')) {
        toast.error('You already have a pending application');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    }
  };

  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Apply for a Role</h1>
              <p className="text-lg text-slate-600">
                Submit an application to join our team or become an admin
              </p>
            </div>

            {!selectedRole ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map(({ role, icon: Icon, title, description, color }) => (
                  <Card
                    key={role}
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => setSelectedRole(role)}
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
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Application for {roles.find(r => r.role === selectedRole)?.title}</CardTitle>
                  <CardDescription>
                    Tell us why you'd like to join as a {roles.find(r => r.role === selectedRole)?.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700">
                        {userProfile?.fullName || 'Not available'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="px-3 py-2 bg-slate-100 rounded-md text-slate-700">
                        {userProfile?.email || 'Not available'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Why do you want this role?</Label>
                      <Textarea
                        id="reason"
                        placeholder="Explain your qualifications and motivation..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        disabled={submitApplication.isPending}
                        rows={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedRole(null);
                          setReason('');
                        }}
                        disabled={submitApplication.isPending}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={submitApplication.isPending}>
                        {submitApplication.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitApplication.isPending ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RequireAuthenticatedRegisteredUser>
  );
}
