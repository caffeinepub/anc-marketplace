import React from 'react';
import { useGetPendingRoleApplications, useApproveRoleApplication, useRejectRoleApplication } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../../backend';
import { Principal } from '@icp-sdk/core/principal';

export default function RoleApplicationsPanel() {
  const { data: applications, isLoading, error, refetch } = useGetPendingRoleApplications();
  const approveApplication = useApproveRoleApplication();
  const rejectApplication = useRejectRoleApplication();

  const handleApprove = async (applicantPrincipal: Principal) => {
    try {
      await approveApplication.mutateAsync(applicantPrincipal);
      toast.success('Application approved successfully');
      refetch();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (applicantPrincipal: Principal) => {
    try {
      await rejectApplication.mutateAsync(applicantPrincipal);
      toast.success('Application rejected');
      refetch();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject application');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.admin:
        return 'bg-red-100 text-red-800';
      case UserRole.employee:
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.admin:
        return 'Admin';
      case UserRole.employee:
        return 'Employee';
      case UserRole.seller:
        return 'Seller';
      case UserRole.customer:
        return 'Customer';
      case UserRole.business:
        return 'Business';
      case UserRole.marketer:
        return 'Affiliate Marketer';
      case UserRole.guest:
        return 'Guest';
      default:
        return 'Unknown';
    }
  };

  const shortenPrincipal = (principal: string) => {
    if (principal.length <= 16) return principal;
    return `${principal.slice(0, 8)}...${principal.slice(-8)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Applications</CardTitle>
          <CardDescription>Review and manage pending role applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Applications</CardTitle>
          <CardDescription>Review and manage pending role applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to load applications</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Applications</CardTitle>
          <CardDescription>Review and manage pending role applications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No pending applications at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Applications</CardTitle>
        <CardDescription>Review and manage pending role applications</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Requested Role</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.applicant.toString()}>
                <TableCell className="font-mono text-sm">
                  {shortenPrincipal(application.applicant.toString())}
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(application.requestedRole)}>
                    {getRoleLabel(application.requestedRole)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {application.reason}
                </TableCell>
                <TableCell>
                  {new Date(Number(application.applicationDate) / 1000000).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(application.applicant)}
                      disabled={approveApplication.isPending || rejectApplication.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(application.applicant)}
                      disabled={approveApplication.isPending || rejectApplication.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
