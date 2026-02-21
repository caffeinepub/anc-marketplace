import React from 'react';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Calendar, DollarSign, BookOpen } from 'lucide-react';

export default function EmployeeDashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {userProfile?.fullName || 'Team Member'}!
            </h1>
            <p className="text-slate-600 mt-2">Your employee dashboard and resources</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                    <ClipboardList className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>Assigned Tasks</CardTitle>
                  <CardDescription>View and manage your work assignments</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Schedule</CardTitle>
                  <CardDescription>Check your work schedule and shifts</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Payroll</CardTitle>
                  <CardDescription>View pay stubs and tax documents</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Company policies and training materials</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest announcements and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No new updates at this time. Check back later for company announcements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuthenticatedRegisteredUser>
  );
}
