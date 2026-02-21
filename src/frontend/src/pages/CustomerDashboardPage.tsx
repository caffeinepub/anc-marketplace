import React from 'react';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Heart, MessageSquare, Settings } from 'lucide-react';

export default function CustomerDashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {userProfile?.fullName || 'Customer'}!
            </h1>
            <p className="text-slate-600 mt-2">Manage your orders, wishlist, and account settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>View your past orders and track shipments</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle>Wishlist</CardTitle>
                  <CardDescription>Save items for later and get price alerts</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Chat with sellers and support</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="group cursor-pointer">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                    <Settings className="h-6 w-6 text-slate-600" />
                  </div>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest orders and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No recent activity. Start shopping to see your orders here!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuthenticatedRegisteredUser>
  );
}
