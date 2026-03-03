import React from "react";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Heart,
  MessageSquare,
  Settings,
  User,
  Star,
} from "lucide-react";

export default function CustomerDashboardPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Customer Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your purchases and account
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: ShoppingBag,
                title: "Purchase History",
                description: "View your past orders and track deliveries",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Heart,
                title: "Wishlist",
                description: "Items you've saved for later",
                color: "text-red-600",
                bg: "bg-red-50",
              },
              {
                icon: MessageSquare,
                title: "Messages",
                description: "Communicate with sellers",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Star,
                title: "Reviews",
                description: "Manage your product reviews",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                icon: User,
                title: "Profile",
                description: "Update your personal information",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: Settings,
                title: "Settings",
                description: "Manage your account preferences",
                color: "text-gray-600",
                bg: "bg-gray-50",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="hover:shadow-md transition-shadow"
              >
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
            ))}
          </div>
        </div>
      </div>
    </RequireAuthenticatedRegisteredUser>
  );
}
