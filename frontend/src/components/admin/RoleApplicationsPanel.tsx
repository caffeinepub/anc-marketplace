import React from 'react';
import { useGetPendingRoleApplications, useApproveRoleApplication, useRejectRoleApplication } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';

export default function RoleApplicationsPanel() {
  const { data: applications, isLoading, error, refetch } = useGetPendingRoleApplications();
  const approveApplication = useApproveRoleApplication();
  const rejectApplication = useRejectRoleApplication();

  const handleApprove = async (applicantString: string) => {
    try {
      const applicantPrincipal = Principal.fromText(applicantString);
      await approveApplication.mutateAsync(applicantPrincipal);
      toast.success('Application approved successfully');
      refetch();
    } catch {
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (applicantString: string) => {
    try {
      const applicantPrincipal = Principal.fromText(applicantString);
      await rejectApplication.mutateAsync(applicantPrincipal);
      toast.success('Application rejected');
      refetch();
    } catch {
      toast.error('Failed to reject application');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'employee': return 'bg-teal-100 text-teal-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      case 'marketer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'employee': return 'Employee';
      case 'seller': return 'Seller';
      case 'customer': return 'Customer';
      case 'business': return 'Business';
      case 'marketer': return 'Affiliate Marketer';
      case 'guest': return 'Guest';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
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
          <p className="text-center text-muted-foreground py-8">No pending applications at this time.</p>
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
              <TableRow key={application.applicant}>
                <TableCell className="font-mono text-sm">
                  {shortenPrincipal(application.applicant)}
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(application.requestedRole)}>
                    {getRoleLabel(application.requestedRole)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{application.reason}</TableCell>
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
