import React from 'react';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CreditCard, Users, BarChart3 } from 'lucide-react';

export default function BusinessDashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {userProfile?.fullName || 'Business Partner'}!
            </h1>
            <p className="text-slate-600 mt-2">Manage your B2B services and business credit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>B2B Services</CardTitle>
                  <CardDescription>Access enterprise solutions and tools</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>Business Credit</CardTitle>
                  <CardDescription>Build and manage your business credit</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>Manage users and permissions</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                    <BarChart3 className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View business insights and reports</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Business Overview</CardTitle>
              <CardDescription>Key metrics and recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Your business dashboard is being set up. Check back soon for detailed analytics and insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuthenticatedRegisteredUser>
  );
}
