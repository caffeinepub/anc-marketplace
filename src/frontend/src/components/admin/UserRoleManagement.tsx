import React, { useState } from 'react';
import { useGetUserRoleSummary, useAssignRole } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Shield, UserCheck, AlertCircle } from 'lucide-react';

export default function UserRoleManagement() {
  const { data: roleSummary, isLoading: summaryLoading, error: summaryError } = useGetUserRoleSummary();

  const isLoading = summaryLoading;
  const hasError = summaryError;

  if (isLoading) {
    return (
      <Card className="border-primary/20 shadow-md">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading user data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    const errorMessage = String(summaryError);
    const isPermissionError = errorMessage.includes('Permission denied') || errorMessage.includes('Unauthorized');

    return (
      <Card className="border-destructive/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            {isPermissionError ? 'Access Denied' : 'Error Loading Users'}
          </CardTitle>
          <CardDescription>
            {isPermissionError
              ? 'You do not have permission to manage user roles'
              : 'Failed to load user management data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{Number(roleSummary?.adminCount || 0)}</div>
            <p className="text-sm text-muted-foreground mt-1">Full system access</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <UserCheck className="h-4 w-4 text-accent-foreground" />
              </div>
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-foreground">{Number(roleSummary?.userCount || 0)}</div>
            <p className="text-sm text-muted-foreground mt-1">Standard access</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              Guests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">{Number(roleSummary?.guestCount || 0)}</div>
            <p className="text-sm text-muted-foreground mt-1">Limited access</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Management
          </CardTitle>
          <CardDescription className="text-base">View and manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              User list and role assignment features are coming soon. Currently showing role summary statistics.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
