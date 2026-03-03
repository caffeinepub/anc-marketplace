import React from "react";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Package,
  TrendingUp,
  ShoppingCart,
  Store,
  BarChart2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function SellerDashboardPage() {
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
                    <div className={`inline-flex p-2 rounded-lg ${item.bg} mb-3`}>
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
