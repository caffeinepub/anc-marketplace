import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown, User, LogOut, Settings, UserPlus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-menu-border bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-menu-label">ANC Marketplace</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Customer Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover">
                    Customer <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white border-2 border-menu-border shadow-menu">
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/customer-faq" className="text-menu-label hover:text-menu-label-hover">
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/customer-blog" className="text-menu-label hover:text-menu-label-hover">
                      Blog
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sellers & Businesses Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover">
                    Sellers & Businesses <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white border-2 border-menu-border shadow-menu">
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/sellers-businesses-faq" className="text-menu-label hover:text-menu-label-hover">
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/sellers-businesses-blog" className="text-menu-label hover:text-menu-label-hover">
                      Blog
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Legal Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover">
                    Legal <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-white border-2 border-menu-border shadow-menu">
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/privacy-policy" className="text-menu-label hover:text-menu-label-hover">
                      Privacy Policy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/shipping-policy" className="text-menu-label hover:text-menu-label-hover">
                      Shipping Policy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/returns-policy" className="text-menu-label hover:text-menu-label-hover">
                      Returns Policy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/terms-and-conditions" className="text-menu-label hover:text-menu-label-hover">
                      Terms & Conditions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/marketplace-policy" className="text-menu-label hover:text-menu-label-hover">
                      Marketplace Policy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                    <Link to="/pci-compliance" className="text-menu-label hover:text-menu-label-hover">
                      PCI Compliance
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Setup Link (when authenticated but no profile) */}
              {showProfileSetup && (
                <Button
                  asChild
                  variant="default"
                  className="ml-2"
                >
                  <Link to="/profile-setup">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Finish Profile Setup
                  </Link>
                </Button>
              )}

              {/* User Menu (when authenticated with profile) */}
              {isAuthenticated && !showProfileSetup && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border-2 border-menu-border shadow-menu">
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                      <Link to="/settings" className="text-menu-label hover:text-menu-label-hover">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-menu-item-hover">
                      <Link to="/admin" className="text-menu-label hover:text-menu-label-hover">
                        Admin Center
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-menu-border" />
                    <DropdownMenuItem onClick={handleAuth} disabled={disabled} className="cursor-pointer text-menu-label hover:text-menu-label-hover focus:bg-menu-item-hover">
                      <LogOut className="mr-2 h-4 w-4" />
                      {buttonText}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Login Button (when not authenticated) */}
              {!isAuthenticated && (
                <Button
                  onClick={handleAuth}
                  disabled={disabled}
                  className="ml-2"
                >
                  {buttonText}
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-menu-label">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white border-l-2 border-menu-border">
                <nav className="flex flex-col space-y-4 mt-8">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-menu-label px-2">Customer</p>
                    <Link
                      to="/customer-faq"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/customer-blog"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Blog
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-menu-label px-2">Sellers & Businesses</p>
                    <Link
                      to="/sellers-businesses-faq"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/sellers-businesses-blog"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Blog
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-menu-label px-2">Legal</p>
                    <Link
                      to="/privacy-policy"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/shipping-policy"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Shipping Policy
                    </Link>
                    <Link
                      to="/returns-policy"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Returns Policy
                    </Link>
                    <Link
                      to="/terms-and-conditions"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Terms & Conditions
                    </Link>
                    <Link
                      to="/marketplace-policy"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Marketplace Policy
                    </Link>
                    <Link
                      to="/pci-compliance"
                      className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      PCI Compliance
                    </Link>
                  </div>

                  {/* Profile Setup Link (mobile) */}
                  {showProfileSetup && (
                    <div className="pt-4 border-t border-menu-border">
                      <Button
                        asChild
                        variant="default"
                        className="w-full"
                        onClick={closeMobileMenu}
                      >
                        <Link to="/profile-setup">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Finish Profile Setup
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* User Menu (mobile) */}
                  {isAuthenticated && !showProfileSetup && (
                    <div className="pt-4 border-t border-menu-border space-y-2">
                      <Link
                        to="/settings"
                        className="flex items-center px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                      <Link
                        to="/admin"
                        className="block px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Admin Center
                      </Link>
                      <button
                        onClick={() => {
                          handleAuth();
                          closeMobileMenu();
                        }}
                        disabled={disabled}
                        className="flex items-center w-full px-2 py-2 text-menu-label hover:text-menu-label-hover hover:bg-menu-item-hover rounded-md transition-colors disabled:opacity-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {buttonText}
                      </button>
                    </div>
                  )}

                  {/* Login Button (mobile) */}
                  {!isAuthenticated && (
                    <div className="pt-4 border-t border-menu-border">
                      <Button
                        onClick={() => {
                          handleAuth();
                          closeMobileMenu();
                        }}
                        disabled={disabled}
                        className="w-full"
                      >
                        {buttonText}
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">ANC Marketplace</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted platform for business solutions and marketplace services.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/customer-faq" className="text-muted-foreground hover:text-foreground">
                    Customer FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/sellers-businesses-faq" className="text-muted-foreground hover:text-foreground">
                    Sellers & Businesses FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <p className="text-sm text-muted-foreground">ancelectronicsnservices@gmail.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} ANC Marketplace. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'anc-marketplace'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
