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
import { Menu, ChevronDown, User, LogOut, Settings, X } from 'lucide-react';
import CookieConsentBanner from './privacy/CookieConsentBanner';
import AssistantWidget from './assistant/AssistantWidget';
import Footer from './Footer';
import { VoiceSettingsProvider } from '../contexts/VoiceSettingsContext';

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

  return (
    <VoiceSettingsProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Promotional Banner */}
        {showBanner && (
          <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm relative">
            <p className="font-medium">
              🎉 Welcome to ANC Electronics N Services - Your trusted marketplace partner
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
                    <DropdownMenuItem asChild>
                      <Link to="/shipping-policy" className="cursor-pointer">
                        Shipping Policy
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/returns-policy" className="cursor-pointer">
                        Returns Policy
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/terms-and-conditions" className="cursor-pointer">
                        Terms & Conditions
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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
                        <Link to="/customer-settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
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

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-6">
                    <Link
                      to="/"
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Customer</p>
                      <Link
                        to="/customer-faq"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        FAQ
                      </Link>
                      <Link
                        to="/customer-blog"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Blog
                      </Link>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Sellers & Businesses</p>
                      <Link
                        to="/sellers-businesses-faq"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        FAQ
                      </Link>
                      <Link
                        to="/sellers-businesses-blog"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Blog
                      </Link>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Legal</p>
                      <Link
                        to="/pci-compliance"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        PCI Compliance
                      </Link>
                      <Link
                        to="/privacy-policy"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        to="/shipping-policy"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Shipping Policy
                      </Link>
                      <Link
                        to="/returns-policy"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Returns Policy
                      </Link>
                      <Link
                        to="/terms-and-conditions"
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Terms & Conditions
                      </Link>
                    </div>
                    {isAuthenticated && (
                      <div className="border-t pt-4">
                        <Link
                          to="/customer-settings"
                          className="block py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="inline mr-2 h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left py-2 hover:text-destructive transition-colors"
                        >
                          <LogOut className="inline mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                    {!isAuthenticated && (
                      <div className="border-t pt-4">
                        <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full">
                          {isLoggingIn ? 'Logging in...' : 'Login'}
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
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

        {/* Cookie Consent Banner */}
        <CookieConsentBanner />

        {/* AI Assistant Widget */}
        <AssistantWidget />
      </div>
    </VoiceSettingsProvider>
  );
}
