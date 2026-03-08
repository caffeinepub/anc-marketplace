import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Package,
  Rocket,
  ShoppingCart,
  Store,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";

export default function SellerDashboardPage() {
  // Deploy state persisted in localStorage
  const [isDeployed, setIsDeployed] = useState<boolean>(
    () => localStorage.getItem("anc_store_deployed") === "true",
  );

  const handleDeploy = () => {
    localStorage.setItem("anc_store_deployed", "true");
    setIsDeployed(true);
    toast.success("Your store is now live on the ANC Marketplace!", {
      description: "Customers can now browse and purchase your products.",
      icon: <Rocket className="h-4 w-4" />,
    });
  };

  const handleUnpublish = () => {
    localStorage.setItem("anc_store_deployed", "false");
    setIsDeployed(false);
    toast.info("Your store has been unpublished from the Marketplace.");
  };

  // Static placeholder data
  const earnings = {
    totalEarnings: 0,
    totalOrders: 0,
    totalShippingCosts: 0,
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Seller Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your store and track your performance
            </p>
          </div>

          {/* ── Deploy to Marketplace card ─────────────────────────────── */}
          {!isDeployed ? (
            <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <Rocket className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-foreground mb-1">
                      Deploy Your Store to Marketplace
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Make your store visible to all customers browsing the ANC
                      Marketplace. Start reaching new buyers today — no monthly
                      fees.
                    </p>
                  </div>
                  <Button
                    data-ocid="seller.deploy.button"
                    size="lg"
                    className="gap-2 shrink-0"
                    onClick={handleDeploy}
                  >
                    <Rocket className="h-4 w-4" />
                    Deploy Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 border-2 border-green-200 bg-green-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="p-3 bg-green-100 rounded-xl shrink-0">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-green-800">
                        Your store is live on the Marketplace!
                      </h2>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700">
                      Customers can now discover and purchase your products on
                      ANC Marketplace.
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      to={"/marketplace/store/store-1" as never}
                      data-ocid="seller.view_store.link"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Your Store
                      </Button>
                    </Link>
                    <Button
                      data-ocid="seller.unpublish.button"
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleUnpublish}
                    >
                      Unpublish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Earnings
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(earnings.totalEarnings)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {earnings.totalOrders}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Shipping Costs
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(earnings.totalShippingCosts)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                to: "/seller-profile",
                icon: Store,
                title: "Seller Profile",
                description: "Manage your store branding and settings",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                to: "/seller-payouts",
                icon: DollarSign,
                title: "Payouts",
                description: "View earnings and manage payout settings",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                to: "/seller-onboarding",
                icon: TrendingUp,
                title: "Onboarding",
                description: "Complete your seller setup",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                to: "/app-center",
                icon: BarChart2,
                title: "App Center",
                description: "Integrate apps to grow your business",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                to: "/store-builder",
                icon: Store,
                title: "Store Builder",
                description: "Build your standalone website or app",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                to: "/funnels",
                icon: TrendingUp,
                title: "Funnels",
                description: "Set up marketing funnels",
                color: "text-pink-600",
                bg: "bg-pink-50",
              },
            ].map((item) => (
              <Link key={item.to} to={item.to}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex p-2 rounded-lg ${item.bg} mb-3`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </RequireAuthenticatedRegisteredUser>
  );
}
