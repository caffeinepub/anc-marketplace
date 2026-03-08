import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart2,
  Briefcase,
  CreditCard,
  FileText,
  Globe,
  Users,
} from "lucide-react";
import React from "react";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";

export default function BusinessDashboardPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Business Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your business operations and growth
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Briefcase,
                title: "B2B Services",
                description: "Access business-to-business service offerings",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: CreditCard,
                title: "Business Credit",
                description: "Build and manage your business credit profile",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Users,
                title: "Team Management",
                description: "Manage your team members and permissions",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: BarChart2,
                title: "Analytics",
                description: "View business performance metrics",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                icon: Globe,
                title: "Integrations",
                description: "Connect with third-party business tools",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                icon: FileText,
                title: "Documents",
                description: "Manage contracts and business documents",
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
