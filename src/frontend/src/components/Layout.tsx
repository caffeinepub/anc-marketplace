import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetCallerUserRole } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, Home, Store, Briefcase, Rocket, Shield, Puzzle, TrendingUp, Calendar, ExternalLink, Wrench, HelpCircle, BookOpen, Users, ChevronDown, ShoppingBag, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { UserRole } from '../types';
import AssistantWidget from './assistant/AssistantWidget';
import CookieConsentBanner from './privacy/CookieConsentBanner';

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

  const handleNavigation = (path: string, mobile = false) => {
    navigate({ to: path });
    if (mobile) setMobileMenuOpen(false);
  };

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center gap-2">
      <Button
        variant={currentPath === '/' ? 'default' : 'ghost'}
        onClick={() => handleNavigation('/')}
      >
        <Home className="h-4 w-4 mr-2" />
        Home
      </Button>

      {/* Customer Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-1">
            <ShoppingBag className="h-4 w-4" />
            Customer
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Customer Pages</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleNavigation('/store')}>
            <Store className="h-4 w-4 mr-2" />
            Store
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/customer-faq')}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Customer FAQ
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/customer-blog')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Customer Blog
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sellers & Businesses Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-1">
            <Briefcase className="h-4 w-4" />
            Sellers & Businesses
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Sellers & Businesses</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleNavigation('/store-builder')}>
            <Wrench className="h-4 w-4 mr-2" />
            Store Builder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/app-center')}>
            <Puzzle className="h-4 w-4 mr-2" />
            App Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/funnels')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Funnels
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/sellers-businesses-faq')}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Sellers & Businesses FAQ
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/sellers-businesses-blog')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Sellers & Businesses Blog
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/affiliate')}>
            <Users className="h-4 w-4 mr-2" />
            Affiliate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Privacy Policy - Site-wide */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-1">
            <FileText className="h-4 w-4" />
            Legal
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleNavigation('/privacy-policy')}>
            <FileText className="h-4 w-4 mr-2" />
            Privacy Policy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/pci-compliance')}>
            <Shield className="h-4 w-4 mr-2" />
            PCI Compliance
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Conditional Dashboard Links */}
      {isAuthenticated && userProfile && userProfile.activeRole === 'startUpMember' && (
        <Button
          variant={currentPath === '/startup-dashboard' ? 'default' : 'ghost'}
          onClick={() => handleNavigation('/startup-dashboard')}
        >
          <Rocket className="h-4 w-4 mr-2" />
          Startup Dashboard
        </Button>
      )}

      {isAuthenticated && userProfile && userProfile.activeRole === 'b2bMember' && (
        <Button
          variant={currentPath === '/b2b-dashboard' ? 'default' : 'ghost'}
          onClick={() => handleNavigation('/b2b-dashboard')}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          B2B Dashboard
        </Button>
      )}

      {isAdmin === true && !isAdminLoading && (
        <Button
          variant={currentPath === '/admin' ? 'default' : 'ghost'}
          onClick={() => handleNavigation('/admin')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin
        </Button>
      )}
    </nav>
  );

  const MobileNav = () => (
    <nav className="flex flex-col gap-2 mt-8">
      <Button
        variant={currentPath === '/' ? 'default' : 'ghost'}
        onClick={() => handleNavigation('/', true)}
        className="w-full justify-start"
      >
        <Home className="h-4 w-4 mr-2" />
        Home
      </Button>

      {/* Customer Section */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Customer</div>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/store', true)}
          className="w-full justify-start pl-6"
        >
          <Store className="h-4 w-4 mr-2" />
          Store
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/customer-faq', true)}
          className="w-full justify-start pl-6"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Customer FAQ
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/customer-blog', true)}
          className="w-full justify-start pl-6"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Customer Blog
        </Button>
      </div>

      {/* Sellers & Businesses Section */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Sellers & Businesses</div>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/store-builder', true)}
          className="w-full justify-start pl-6"
        >
          <Wrench className="h-4 w-4 mr-2" />
          Store Builder
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/app-center', true)}
          className="w-full justify-start pl-6"
        >
          <Puzzle className="h-4 w-4 mr-2" />
          App Center
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/funnels', true)}
          className="w-full justify-start pl-6"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Funnels
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/sellers-businesses-faq', true)}
          className="w-full justify-start pl-6"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Sellers & Businesses FAQ
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/sellers-businesses-blog', true)}
          className="w-full justify-start pl-6"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Sellers & Businesses Blog
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/affiliate', true)}
          className="w-full justify-start pl-6"
        >
          <Users className="h-4 w-4 mr-2" />
          Affiliate
        </Button>
      </div>

      {/* Legal Section */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Legal</div>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/privacy-policy', true)}
          className="w-full justify-start pl-6"
        >
          <FileText className="h-4 w-4 mr-2" />
          Privacy Policy
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/pci-compliance', true)}
          className="w-full justify-start pl-6"
        >
          <Shield className="h-4 w-4 mr-2" />
          PCI Compliance
        </Button>
      </div>

      {/* Conditional Dashboard Links */}
      {isAuthenticated && userProfile && userProfile.activeRole === 'startUpMember' && (
        <Button
          variant={currentPath === '/startup-dashboard' ? 'default' : 'ghost'}
          onClick={() => handleNavigation('/startup-dashboard', true)}
          className="w-full justify-start"
        >
          <Rocket className="h-4 w-4 mr-2" />
          Startup Dashboard
        </Button>
      )}

      {isAuthenticated && userProfile && userProfile.activeRole === 'b2bMember' && (
        <Button
          variant={currentPath === '/b2b-dashboard' ? 'default' : 'ghost'}
          onClick={() => handleNavigation('/b2b-dashboard', true)}
          className="w-full justify-start"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          B2B Dashboard
        </Button>
      )}

      {isAdmin === true && !isAdminLoading && (
        <Button
          variant={currentPath === '/admin' ? 'default' : 'ghost'}
          onClick={() => handleNavigation('/admin', true)}
          className="w-full justify-start"
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin
        </Button>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col">
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
            <DesktopNav />
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
                <MobileNav />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <AssistantWidget />
      <CookieConsentBanner />

      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/Screenshot_20251130-131933_Gmail.png" 
                  alt="ANC Electronics N Services Logo" 
                  className="h-10 w-auto object-contain"
                />
                <span className="font-semibold logo-text">ANC Electronics N Services</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your Success is our mission
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => navigate({ to: '/customer-faq' })}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Customer FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate({ to: '/sellers-businesses-faq' })}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sellers & Businesses FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate({ to: '/customer-blog' })}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal & Compliance</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => navigate({ to: '/privacy-policy' })}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate({ to: '/pci-compliance' })}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    PCI Compliance Certificate
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="mailto:support@anc-electronics-n-services.net"
                    className="hover:text-foreground"
                  >
                    support@anc-electronics-n-services.net
                  </a>
                </li>
                <li>
                  <a 
                    href="https://calendly.com/anc-electronics-n-services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground inline-flex items-center gap-1"
                  >
                    Schedule Appointment
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
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
