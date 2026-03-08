import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  DollarSign,
  User,
} from "lucide-react";
import React from "react";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";

export default function EmployeeDashboardPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Employee Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your work and stay up to date
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: ClipboardList,
                title: "Assigned Tasks",
                description: "View and manage your current assignments",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Calendar,
                title: "Schedule",
                description: "View your work schedule and shifts",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: DollarSign,
                title: "Payroll",
                description: "View your earnings and payment history",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                icon: BookOpen,
                title: "Company Resources",
                description: "Access training materials and documents",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: User,
                title: "My Profile",
                description: "Update your employee information",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                icon: Bell,
                title: "Notifications",
                description: "Stay updated with company announcements",
                color: "text-orange-600",
                bg: "bg-orange-50",
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
