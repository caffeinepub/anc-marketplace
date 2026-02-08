import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetCallerUserRole } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, Home, Store, Briefcase, Rocket, Shield, Puzzle, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { UserRole } from '../backend';

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: userRole } = useGetCallerUserRole();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const currentPath = routerState.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const getRoleBadgeVariant = (role: UserRole | undefined) => {
    if (!role) return 'secondary';
    switch (role) {
      case UserRole.admin:
        return 'default';
      case UserRole.user:
        return 'secondary';
      case UserRole.guest:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: UserRole | undefined) => {
    if (!role) return 'Guest';
    switch (role) {
      case UserRole.admin:
        return 'Admin';
      case UserRole.user:
        return 'User';
      case UserRole.guest:
        return 'Guest';
      default:
        return 'Guest';
    }
  };

  const getAccessRoleLabel = (activeRole: string) => {
    switch (activeRole) {
      case 'startUpMember':
        return 'Startup Member';
      case 'b2bMember':
        return 'B2B Member';
      case 'guest':
        return 'Guest Access';
      default:
        return 'Guest Access';
    }
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Store', path: '/store', icon: Store },
  ];

  if (isAuthenticated && userProfile) {
    if (userProfile.activeRole === 'startUpMember') {
      navItems.push({ label: 'Startup Dashboard', path: '/startup-dashboard', icon: Rocket });
    }
    if (userProfile.activeRole === 'b2bMember') {
      navItems.push({ label: 'B2B Dashboard', path: '/b2b-dashboard', icon: Briefcase });
    }
  }

  // Add App Center and Funnels for authenticated users
  if (isAuthenticated) {
    navItems.push({ label: 'App Center', path: '/app-center', icon: Puzzle });
    navItems.push({ label: 'Funnels', path: '/funnels', icon: TrendingUp });
  }

  // Only show Admin link if user is confirmed admin
  if (isAdmin === true && !isAdminLoading) {
    navItems.push({ label: 'Admin', path: '/admin', icon: Shield });
  }

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? 'default' : 'ghost'}
            onClick={() => {
              navigate({ to: item.path });
              if (mobile) setMobileMenuOpen(false);
            }}
            className={mobile ? 'w-full justify-start' : ''}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Promotional Banner */}
      <div className="w-full bg-gradient-to-r from-primary/90 to-primary text-primary-foreground py-4 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm md:text-base font-medium leading-relaxed">
              We have a startup assistance program called ANC Apprentice Program Center if your interested set an appointment today at:{' '}
              <a 
                href="https://calendly.com/anc-electronics-n-services" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-primary-foreground/80 inline-flex items-center gap-1 font-semibold"
              >
                https://calendly.com/anc-electronics-n-services
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate({ to: '/appointment-dashboard53' })}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Connect with the appointment dashboard53
            </Button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate({ to: '/' })} className="flex items-center gap-3">
              <img 
                src="/assets/Screenshot_20251130-131933_Gmail.png" 
                alt="ANC Electronics N Services Logo" 
                className="h-14 w-auto object-contain"
              />
              <span className="font-bold text-xl logo-text hidden sm:inline-block">
                ANC Electronics N Services
              </span>
            </button>
            <nav className="hidden md:flex items-center gap-2">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && userProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    {userRole && userRole !== UserRole.guest && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{userProfile.fullName}</span>
                      <span className="text-xs text-muted-foreground font-normal">{userProfile.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">System Role:</span>
                      <Badge variant={getRoleBadgeVariant(userRole)}>
                        {getRoleLabel(userRole)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Access Level:</span>
                      <Badge variant="secondary">
                        {getAccessRoleLabel(userProfile.activeRole)}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAuth}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!isAuthenticated && (
              <Button onClick={handleAuth} disabled={loginStatus === 'logging-in'}>
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/Screenshot_20251130-131933_Gmail.png" 
                alt="ANC Electronics N Services Logo" 
                className="h-10 w-auto object-contain"
              />
              <span className="font-semibold logo-text">ANC Electronics N Services</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2026. Built with love using{' '}
              <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
