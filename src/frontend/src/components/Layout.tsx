import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown, User, LogOut, Settings, Users, BookOpen, MessageSquare, Map, X } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from 'react-icons/si';
import CookieConsentBanner from './privacy/CookieConsentBanner';
import AssistantWidget from './assistant/AssistantWidget';

export default function Layout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const navigateToAdminTab = (tab: string) => {
    navigate({ to: '/admin', search: { tab } });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Promotional Banner */}
      {showBanner && (
        <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm relative">
          <p className="font-medium">
            🎉 Free marketplace access! Only $5 per sale. Optional $10/month for standalone website conversion.
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img src="/assets/generated/anc-logo-transparent.dim_200x200.png" alt="ANC Logo" className="h-10 w-10" />
              <span className="text-xl font-bold logo-text">ANC Electronics N Services</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/store" className="text-sm font-medium hover:text-primary transition-colors">
                Store
              </Link>

              {/* Customer Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Customer <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Customer Resources</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/customer-faq" className="cursor-pointer">
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/customer-blog" className="cursor-pointer">
                      Blog
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sellers & Businesses Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Sellers & Businesses <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Business Resources</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/startup-dashboard" className="cursor-pointer">
                      Startup Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/b2b-dashboard" className="cursor-pointer">
                      B2B Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/store-builder" className="cursor-pointer">
                      Store Builder
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app-center" className="cursor-pointer">
                      App Center
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/funnels" className="cursor-pointer">
                      Funnels
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/sellers-businesses-faq" className="cursor-pointer">
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/sellers-businesses-blog" className="cursor-pointer">
                      Blog
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Legal Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Legal <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Legal & Compliance</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/pci-compliance" className="cursor-pointer">
                      PCI Compliance
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/privacy-policy" className="cursor-pointer">
                      Privacy Policy
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Quick Access (if admin) */}
              {isAuthenticated && isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary">
                      <Settings className="h-4 w-4" />
                      Admin <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Admin Quick Access</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigateToAdminTab('settings')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToAdminTab('users')} className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToAdminTab('knowledge')} className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Knowledge Base
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToAdminTab('questions')} className="cursor-pointer">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Questions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToAdminTab('roadmap')} className="cursor-pointer">
                      <Map className="mr-2 h-4 w-4" />
                      Roadmap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* User Menu / Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <User className="h-4 w-4" />
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/customer-profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleLogin} disabled={isLoggingIn} size="sm">
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </nav>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  <Link
                    to="/"
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/store"
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Store
                  </Link>

                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Customer</p>
                    <Link
                      to="/customer-faq"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/customer-blog"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Sellers & Businesses</p>
                    <Link
                      to="/startup-dashboard"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Startup Dashboard
                    </Link>
                    <Link
                      to="/b2b-dashboard"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      B2B Dashboard
                    </Link>
                    <Link
                      to="/store-builder"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Store Builder
                    </Link>
                    <Link
                      to="/app-center"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      App Center
                    </Link>
                    <Link
                      to="/funnels"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Funnels
                    </Link>
                    <Link
                      to="/sellers-businesses-faq"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/sellers-businesses-blog"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Legal</p>
                    <Link
                      to="/pci-compliance"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      PCI Compliance
                    </Link>
                    <Link
                      to="/privacy-policy"
                      className="block text-sm py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Privacy Policy
                    </Link>
                  </div>

                  {isAuthenticated && isAdmin && (
                    <div className="border-t pt-4">
                      <p className="text-xs font-semibold text-primary mb-2">Admin Quick Access</p>
                      <button
                        onClick={() => navigateToAdminTab('settings')}
                        className="block w-full text-left text-sm py-2 hover:text-primary transition-colors"
                      >
                        <Settings className="inline mr-2 h-4 w-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => navigateToAdminTab('users')}
                        className="block w-full text-left text-sm py-2 hover:text-primary transition-colors"
                      >
                        <Users className="inline mr-2 h-4 w-4" />
                        Users
                      </button>
                      <button
                        onClick={() => navigateToAdminTab('knowledge')}
                        className="block w-full text-left text-sm py-2 hover:text-primary transition-colors"
                      >
                        <BookOpen className="inline mr-2 h-4 w-4" />
                        Knowledge Base
                      </button>
                      <button
                        onClick={() => navigateToAdminTab('questions')}
                        className="block w-full text-left text-sm py-2 hover:text-primary transition-colors"
                      >
                        <MessageSquare className="inline mr-2 h-4 w-4" />
                        Questions
                      </button>
                      <button
                        onClick={() => navigateToAdminTab('roadmap')}
                        className="block w-full text-left text-sm py-2 hover:text-primary transition-colors"
                      >
                        <Map className="inline mr-2 h-4 w-4" />
                        Roadmap
                      </button>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/customer-profile"
                          className="block text-sm py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="inline mr-2 h-4 w-4" />
                          Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="block text-sm py-2 hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Settings className="inline mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left text-sm py-2 text-destructive hover:opacity-80 transition-opacity"
                        >
                          <LogOut className="inline mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full">
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="font-semibold mb-3">ANC Electronics N Services</h3>
              <p className="text-sm text-muted-foreground">
                Digital transformation platform for entrepreneurs and businesses.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/store" className="text-muted-foreground hover:text-primary transition-colors">
                    Store
                  </Link>
                </li>
                <li>
                  <Link to="/app-center" className="text-muted-foreground hover:text-primary transition-colors">
                    App Center
                  </Link>
                </li>
                <li>
                  <Link to="/store-builder" className="text-muted-foreground hover:text-primary transition-colors">
                    Store Builder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/customer-faq" className="text-muted-foreground hover:text-primary transition-colors">
                    Customer FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sellers-businesses-faq"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sellers & Businesses FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/pci-compliance" className="text-muted-foreground hover:text-primary transition-colors">
                    PCI Compliance
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="X (Twitter)"
                >
                  <SiX className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>
              © 2026. Built with ❤️ using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* AI Assistant Widget */}
      <AssistantWidget />
    </div>
  );
}
