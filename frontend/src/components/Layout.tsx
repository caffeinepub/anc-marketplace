import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown, Shield, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const roleRouteMap: Record<string, string> = {
        seller: '/seller-dashboard',
        customer: '/customer-dashboard',
        business: '/business-dashboard',
        employee: '/employee-dashboard',
        marketer: '/affiliate-dashboard',
        admin: '/admin',
      };

      const targetRoute = roleRouteMap[userProfile.activeRole];
      if (targetRoute && window.location.pathname === '/') {
        navigate({ to: targetRoute as any });
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold logo-text">ANC Marketplace</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1">
                    Customer <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-white border-2 border-menu-border shadow-menu">
                  <DropdownMenuItem asChild className="menu-item cursor-pointer">
                    <Link to="/customer-faq" className="w-full">
                      Customer FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="menu-item cursor-pointer">
                    <Link to="/customer-blog" className="w-full">
                      Customer Blog
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1">
                    Sellers/Businesses <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-white border-2 border-menu-border shadow-menu">
                  <DropdownMenuItem asChild className="menu-item cursor-pointer">
                    <Link to="/sellers-businesses-faq" className="w-full">
                      Sellers & Businesses FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="menu-item cursor-pointer">
                    <Link to="/sellers-businesses-blog" className="w-full">
                      Sellers & Businesses Blog
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isAuthenticated && userProfile?.activeRole === 'admin' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1">
                      <Shield className="h-4 w-4" />
                      Admin Center <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-white border-2 border-menu-border shadow-menu">
                    <DropdownMenuItem asChild className="menu-item cursor-pointer">
                      <Link to="/admin" className="w-full">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1">
                      <User className="h-4 w-4" />
                      Account <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-white border-2 border-menu-border shadow-menu">
                    <DropdownMenuItem asChild className="menu-item cursor-pointer">
                      <Link to="/account-portal" className="w-full">
                        Account Portal
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="menu-item cursor-pointer">
                      <Link to="/settings" className="w-full">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/register' })}
                  className="hidden md:inline-flex"
                >
                  Sign Up
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/apply' })}
                  className="hidden md:inline-flex"
                >
                  Apply for Role
                </Button>
              </>
            )}

            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className="hidden md:inline-flex"
            >
              {buttonText}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white border-l-2 border-menu-border">
                <nav className="flex flex-col gap-4 mt-8">
                  <div className="space-y-2">
                    <p className="menu-section-label text-sm px-2">Customer</p>
                    <Link
                      to="/customer-faq"
                      className="menu-link block px-2 py-2 rounded-md"
                      onClick={closeMobileMenu}
                    >
                      Customer FAQ
                    </Link>
                    <Link
                      to="/customer-blog"
                      className="menu-link block px-2 py-2 rounded-md"
                      onClick={closeMobileMenu}
                    >
                      Customer Blog
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <p className="menu-section-label text-sm px-2">Sellers/Businesses</p>
                    <Link
                      to="/sellers-businesses-faq"
                      className="menu-link block px-2 py-2 rounded-md"
                      onClick={closeMobileMenu}
                    >
                      Sellers & Businesses FAQ
                    </Link>
                    <Link
                      to="/sellers-businesses-blog"
                      className="menu-link block px-2 py-2 rounded-md"
                      onClick={closeMobileMenu}
                    >
                      Sellers & Businesses Blog
                    </Link>
                  </div>

                  {isAuthenticated && userProfile?.activeRole === 'admin' && (
                    <div className="space-y-2">
                      <p className="menu-section-label text-sm px-2">Admin</p>
                      <Link
                        to="/admin"
                        className="menu-link flex items-center gap-2 px-2 py-2 rounded-md"
                        onClick={closeMobileMenu}
                      >
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="space-y-2">
                      <p className="menu-section-label text-sm px-2">Account</p>
                      <Link
                        to="/account-portal"
                        className="menu-link flex items-center gap-2 px-2 py-2 rounded-md"
                        onClick={closeMobileMenu}
                      >
                        <User className="h-4 w-4" />
                        Account Portal
                      </Link>
                      <Link
                        to="/settings"
                        className="menu-link block px-2 py-2 rounded-md"
                        onClick={closeMobileMenu}
                      >
                        Settings
                      </Link>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    {!isAuthenticated && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            closeMobileMenu();
                            navigate({ to: '/register' });
                          }}
                          className="w-full"
                        >
                          Sign Up
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            closeMobileMenu();
                            navigate({ to: '/apply' });
                          }}
                          className="w-full"
                        >
                          Apply for Role
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => {
                        closeMobileMenu();
                        handleAuth();
                      }}
                      disabled={disabled}
                      variant={isAuthenticated ? 'outline' : 'default'}
                      className="w-full"
                    >
                      {buttonText}
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
