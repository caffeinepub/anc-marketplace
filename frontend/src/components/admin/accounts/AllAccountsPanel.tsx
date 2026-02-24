import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, RefreshCw, AlertCircle, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllUsers } from '../../../hooks/useQueries';

export default function AllAccountsPanel() {
  const { data: users, isLoading, error, refetch } = useGetAllUsers();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const formatCurrency = (cents: bigint): string => {
    const dollars = Number(cents) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);
  };

  const formatDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-400',
      seller: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
      customer: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400',
      business: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-400',
      marketer: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950 dark:text-pink-400',
      employee: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400',
      guest: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-400',
    };

    return (
      <Badge variant="outline" className={roleColors[role] || roleColors.guest}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (!searchTerm) return users;

    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.profile.fullName.toLowerCase().includes(term) ||
        user.profile.email.toLowerCase().includes(term) ||
        user.principal.toString().toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All User Accounts
          </CardTitle>
          <CardDescription>Complete list of all registered users with account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All User Accounts
          </CardTitle>
          <CardDescription>Complete list of all registered users with account details</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load user accounts. Please try again.</span>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All User Accounts
            </CardTitle>
            <CardDescription>Complete list of all registered users with account details</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or principal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {!users || users.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No user accounts found.</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} accounts
            </div>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>System Role</TableHead>
                    <TableHead>Account Created</TableHead>
                    <TableHead>Principal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.principal.toString()}>
                      <TableCell className="font-medium">{user.profile.fullName}</TableCell>
                      <TableCell className="text-sm">{user.profile.email}</TableCell>
                      <TableCell>{getRoleBadge(user.profile.activeRole)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.systemRole}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {formatDate(user.profile.accountCreated)}
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-xs">
                        <div className="truncate" title={user.principal.toString()}>
                          {user.principal.toString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
