import React, { useState } from 'react';
import { useGetRoleSummary, useListAllUsersWithRoles, useAssignCallerUserRole } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Users, Shield, UserCheck, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole as BackendUserRole } from '../../backend';
import { Principal } from '@icp-sdk/core/principal';

export default function UserRoleManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ principal: string; currentRole: BackendUserRole } | null>(null);
  const [newRole, setNewRole] = useState<BackendUserRole | ''>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: roleSummary, isLoading: summaryLoading, error: summaryError } = useGetRoleSummary();
  const { data: users, isLoading: usersLoading, error: usersError } = useListAllUsersWithRoles();
  const assignRole = useAssignCallerUserRole();

  const isLoading = summaryLoading || usersLoading;
  const hasError = summaryError || usersError;

  const handleAssignRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await assignRole.mutateAsync({
        user: Principal.fromText(selectedUser.principal),
        role: newRole,
      });
      setIsDialogOpen(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const openAssignDialog = (principal: string, currentRole: BackendUserRole) => {
    setSelectedUser({ principal, currentRole });
    setNewRole(currentRole);
    setIsDialogOpen(true);
  };

  const getRoleBadge = (role: BackendUserRole) => {
    switch (role) {
      case BackendUserRole.admin:
        return <Badge className="bg-primary text-primary-foreground">Admin</Badge>;
      case BackendUserRole.user:
        return <Badge variant="secondary">User</Badge>;
      case BackendUserRole.guest:
        return <Badge variant="outline">Guest</Badge>;
      default:
        return <Badge variant="outline">{String(role)}</Badge>;
    }
  };

  const filteredUsers = users?.filter((user) =>
    user.principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
    const errorMessage = String(summaryError || usersError);
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

      {/* User List */}
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Management
          </CardTitle>
          <CardDescription className="text-base">View and manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or principal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* User List */}
          {filteredUsers.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {users?.length === 0
                  ? 'No users found in the system'
                  : 'No users match your search criteria'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.principal}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-base truncate">{user.profile.fullName}</h3>
                      {getRoleBadge(user.systemRole)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.profile.email}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate mt-1">{user.principal}</p>
                  </div>
                  <Button
                    onClick={() => openAssignDialog(user.principal, user.systemRole)}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Role
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Assign User Role</DialogTitle>
            <DialogDescription className="text-base">
              Change the system role for this user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedUser && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Current Role</p>
                <div className="flex items-center gap-2">
                  {getRoleBadge(selectedUser.currentRole)}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium">New Role</p>
              <Select value={newRole} onValueChange={(value) => setNewRole(value as BackendUserRole)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BackendUserRole.admin}>Admin</SelectItem>
                  <SelectItem value={BackendUserRole.user}>User</SelectItem>
                  <SelectItem value={BackendUserRole.guest}>Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {assignRole.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{String(assignRole.error)}</AlertDescription>
              </Alert>
            )}
            {assignRole.isSuccess && (
              <Alert className="border-primary bg-primary/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">Role updated successfully!</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={assignRole.isPending}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={!newRole || assignRole.isPending}>
              {assignRole.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Role'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
