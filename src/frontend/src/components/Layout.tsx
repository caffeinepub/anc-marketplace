import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  Briefcase,
  ChevronDown,
  HelpCircle,
  Loader2,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const activeRole = userProfile?.activeRole;

  const getDashboardPath = () => {
    if (!activeRole) return "/";
    switch (activeRole) {
      case UserRole.admin:
        return "/admin";
      case UserRole.seller:
        return "/seller-dashboard";
      case UserRole.customer:
        return "/customer-dashboard";
      case UserRole.business:
        return "/business-dashboard";
      case UserRole.employee:
        return "/employee-dashboard";
      case UserRole.marketer:
        return "/affiliate-dashboard";
      default:
        return "/";
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Marketplace", to: "/marketplace" },
    { label: "FAQ", to: "/faq/customers" },
    { label: "Blog", to: "/blog/customers" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/assets/generated/anc-header-logo-transparent.dim_200x150.png"
                alt="ANC Marketplace"
                className="h-10 w-auto"
              />
              <span className="font-bold text-lg text-primary hidden sm:block logo-text">
                ANC Marketplace
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Sellers & Businesses dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-foreground"
                  >
                    Sellers & Businesses <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 bg-white border border-gray-200 shadow-lg z-50"
                >
                  <DropdownMenuLabel className="text-gray-700">
                    Resources
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/faq/sellers-businesses"
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                    >
                      <HelpCircle className="h-4 w-4" />
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/blog/sellers-businesses"
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                    >
                      <BookOpen className="h-4 w-4" />
                      Blog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-gray-700">
                    Tools
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/store-builder"
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                    >
                      <Store className="h-4 w-4" />
                      Store Builder
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/funnels"
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                    >
                      <BarChart2 className="h-4 w-4" />
                      Funnels
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/app-center"
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      App Center
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Cart link */}
              <Link
                to="/cart"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Link>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 hidden md:flex"
                    >
                      <User className="h-4 w-4" />
                      {profileLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <span className="max-w-[120px] truncate">
                          {userProfile?.fullName ?? "Account"}
                        </span>
                      )}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-white border border-gray-200 shadow-lg z-50"
                  >
                    <DropdownMenuLabel className="text-gray-700">
                      {userProfile?.fullName ?? "My Account"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {activeRole && (
                      <DropdownMenuItem asChild>
                        <Link
                          to={getDashboardPath()}
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                        >
                          <BarChart2 className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        to="/account"
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                      >
                        <User className="h-4 w-4" />
                        Account Portal
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {activeRole === UserRole.seller && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            to="/seller-profile"
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                          >
                            <Store className="h-4 w-4" />
                            Seller Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/seller-payouts"
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                          >
                            <BarChart2 className="h-4 w-4" />
                            Payouts
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {activeRole === UserRole.admin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                          >
                            <Users className="h-4 w-4" />
                            Admin Center
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="hidden md:flex gap-2"
                >
                  {isLoggingIn ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              )}

              {/* Register button */}
              {!isAuthenticated && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="hidden md:flex"
                >
                  <Link to="/register">Register</Link>
                </Button>
              )}

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-72 bg-white text-gray-900"
                >
                  <div className="flex flex-col gap-4 mt-6">
                    <div className="font-bold text-lg text-primary">
                      ANC Marketplace
                    </div>
                    <nav className="flex flex-col gap-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <Link
                        to="/marketplace"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                      >
                        Marketplace
                      </Link>
                      <Link
                        to="/faq/sellers-businesses"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                      >
                        Sellers & Businesses FAQ
                      </Link>
                      <Link
                        to="/blog/sellers-businesses"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                      >
                        Sellers & Businesses Blog
                      </Link>
                      <Link
                        to="/store-builder"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                      >
                        Store Builder
                      </Link>
                      <Link
                        to="/funnels"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                      >
                        Funnels
                      </Link>
                      <Link
                        to="/app-center"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                      >
                        App Center
                      </Link>
                    </nav>

                    <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
                      {isAuthenticated ? (
                        <>
                          <div className="px-3 py-1 text-sm font-medium text-gray-500">
                            {userProfile?.fullName ?? "My Account"}
                          </div>
                          {activeRole && (
                            <Link
                              to={getDashboardPath()}
                              onClick={() => setMobileOpen(false)}
                              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                              <BarChart2 className="h-4 w-4" />
                              Dashboard
                            </Link>
                          )}
                          <Link
                            to="/account"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            Account Portal
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              handleLogout();
                              setMobileOpen(false);
                            }}
                            className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2 text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              handleLogin();
                              setMobileOpen(false);
                            }}
                            disabled={isLoggingIn}
                            className="w-full"
                          >
                            {isLoggingIn ? "Logging in..." : "Login"}
                          </Button>
                          <Button variant="outline" asChild className="w-full">
                            <Link
                              to="/register"
                              onClick={() => setMobileOpen(false)}
                            >
                              Register
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
