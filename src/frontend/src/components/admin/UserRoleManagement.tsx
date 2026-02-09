import { useState } from 'react';
import { useListAllUsersWithRoles, useGetRoleSummary, useAssignUserAccessRole, useAssignCallerUserRole } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Shield, UserCheck, UserX, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { AccessRole, UserRole, UserWithRole } from '../../types';
import { Principal } from '@icp-sdk/core/principal';

export default function UserRoleManagement() {
  const { data: usersWithRoles = [], isLoading } = useListAllUsersWithRoles();
  const { data: roleSummary } = useGetRoleSummary();
  const assignAccessRole = useAssignUserAccessRole();
  const assignSystemRole = useAssignCallerUserRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newAccessRole, setNewAccessRole] = useState<string>('guest');
  const [newSystemRole, setNewSystemRole] = useState<UserRole>(UserRole.guest);

  const handleOpenRoleDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewAccessRole(user.profile.activeRole);
    setNewSystemRole(user.systemRole);
    setRoleDialogOpen(true);
  };

  const handleAssignRoles = async () => {
    if (!selectedUser) return;

    try {
      // Convert string to AccessRole variant
      let accessRoleVariant: AccessRole;
      if (newAccessRole === 'startUpMember') {
        accessRoleVariant = { __kind__: 'startUpMember' };
      } else if (newAccessRole === 'b2bMember') {
        accessRoleVariant = { __kind__: 'b2bMember' };
      } else {
        accessRoleVariant = { __kind__: 'guest' };
      }

      // Update access role
      await assignAccessRole.mutateAsync({
        userPrincipal: Principal.fromText(selectedUser.principal),
        newRole: accessRoleVariant,
      });

      // Update system role
      await assignSystemRole.mutateAsync({
        user: Principal.fromText(selectedUser.principal),
        role: newSystemRole,
      });

      toast.success('User roles updated successfully');
      setRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user roles');
    }
  };

  const getSystemRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.admin:
        return <Badge variant="default" className="gap-1"><Shield className="h-3 w-3" />Admin</Badge>;
      case UserRole.user:
        return <Badge variant="secondary" className="gap-1"><UserCheck className="h-3 w-3" />User</Badge>;
      case UserRole.guest:
        return <Badge variant="outline" className="gap-1"><UserX className="h-3 w-3" />Guest</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAccessRoleBadge = (role: string) => {
    switch (role) {
      case 'startUpMember':
        return <Badge variant="default">Startup Member</Badge>;
      case 'b2bMember':
        return <Badge variant="default">B2B Member</Badge>;
      case 'guest':
        return <Badge variant="secondary">Guest Access</Badge>;
      default:
        return <Badge variant="secondary">Guest</Badge>;
    }
  };

  const filteredUsers = usersWithRoles.filter((user) => {
    const matchesSearch =
      user.profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.principal.toString().toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterRole === 'all' ||
      (filterRole === 'admin' && user.systemRole === UserRole.admin) ||
      (filterRole === 'user' && user.systemRole === UserRole.user) ||
      (filterRole === 'guest' && user.systemRole === UserRole.guest) ||
      (filterRole === 'startup' && user.profile.activeRole === 'startUpMember') ||
      (filterRole === 'b2b' && user.profile.activeRole === 'b2bMember');

    return matchesSearch && matchesFilter;
  });

  const summaryCards = [
    { label: 'Total Admins', value: roleSummary?.adminCount.toString() || '0', icon: Shield, color: 'text-blue-600' },
    { label: 'Total Users', value: roleSummary?.userCount.toString() || '0', icon: UserCheck, color: 'text-green-600' },
    { label: 'Total Guests', value: roleSummary?.guestCount.toString() || '0', icon: UserX, color: 'text-gray-600' },
    { label: 'Startup Members', value: roleSummary?.startupMemberCount.toString() || '0', icon: Users, color: 'text-purple-600' },
    { label: 'B2B Members', value: roleSummary?.b2bMemberCount.toString() || '0', icon: Users, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-5 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="pb-3">
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User & Role Management</CardTitle>
              <CardDescription>Assign and manage user roles and permissions</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="guest">Guests</SelectItem>
                  <SelectItem value="startup">Startup Members</SelectItem>
                  <SelectItem value="b2b">B2B Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.principal.toString()} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{user.profile.fullName}</h4>
                      {getSystemRoleBadge(user.systemRole)}
                      {getAccessRoleBadge(user.profile.activeRole)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.profile.email}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate mt-1">
                      {user.principal.toString().slice(0, 20)}...
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleOpenRoleDialog(user)}>
                    Manage Roles
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              Update system role and access level for {selectedUser?.profile.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">System Role</label>
              <Select value={newSystemRole} onValueChange={(value: UserRole) => setNewSystemRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.admin}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin - Full system access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.user}>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      <span>User - Standard access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.guest}>
                    <div className="flex items-center gap-2">
                      <UserX className="h-4 w-4" />
                      <span>Guest - Limited access</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Access Level</label>
              <Select value={newAccessRole} onValueChange={setNewAccessRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startUpMember">Startup Member - Startup program access</SelectItem>
                  <SelectItem value="b2bMember">B2B Member - B2B services access</SelectItem>
                  <SelectItem value="guest">Guest - Basic access only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Current Roles:</p>
              <div className="flex gap-2">
                {selectedUser && getSystemRoleBadge(selectedUser.systemRole)}
                {selectedUser && getAccessRoleBadge(selectedUser.profile.activeRole)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRoles} disabled={assignAccessRole.isPending || assignSystemRole.isPending}>
              {assignAccessRole.isPending || assignSystemRole.isPending ? 'Updating...' : 'Update Roles'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
