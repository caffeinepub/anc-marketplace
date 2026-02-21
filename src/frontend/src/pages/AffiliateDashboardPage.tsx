import React from 'react';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link as LinkIcon, DollarSign, TrendingUp, Megaphone } from 'lucide-react';

export default function AffiliateDashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {userProfile?.fullName || 'Affiliate Marketer'}!
            </h1>
            <p className="text-slate-600 mt-2">Track your referrals and commissions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <LinkIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Referral Links</CardTitle>
                  <CardDescription>Generate and manage your affiliate links</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Commission Tracking</CardTitle>
                  <CardDescription>View earnings and payout history</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Analytics and conversion metrics</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <Megaphone className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Marketing Resources</CardTitle>
                  <CardDescription>Banners, creatives, and promotional tools</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Commission Summary</CardTitle>
              <CardDescription>Your affiliate performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="text-2xl font-bold text-slate-900">10%</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-slate-900">$0.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuthenticatedRegisteredUser>
  );
}
