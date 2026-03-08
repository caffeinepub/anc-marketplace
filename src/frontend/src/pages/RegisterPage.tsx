import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle,
  Loader2,
  ShoppingBag,
  Store,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import type { UserProfile } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

const roles = [
  {
    role: UserRole.seller,
    label: "Seller",
    description: "List and sell products on the marketplace",
    icon: Store,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    role: UserRole.customer,
    label: "Customer",
    description: "Browse and purchase products",
    icon: ShoppingBag,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    role: UserRole.business,
    label: "Business",
    description: "Access B2B services and business tools",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    role: UserRole.marketer,
    label: "Affiliate Marketer",
    description: "Earn commissions by referring customers",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"role" | "profile">("role");

  const isLoggingIn = loginStatus === "logging-in";
  const isAuthenticated = !!identity;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return;
    }
    if (!isAuthenticated) {
      try {
        await login();
      } catch (_error) {
        toast.error("Login failed. Please try again.");
        return;
      }
    }
    setStep("profile");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    const profile: UserProfile = {
      fullName: fullName.trim(),
      email: email.trim(),
      activeRole: selectedRole,
      subscriptionId: undefined,
      accountCreated: BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Account created successfully!");

      // Navigate to role-specific dashboard
      switch (selectedRole) {
        case UserRole.seller:
          navigate({ to: "/seller-dashboard" });
          break;
        case UserRole.customer:
          navigate({ to: "/customer-dashboard" });
          break;
        case UserRole.business:
          navigate({ to: "/business-dashboard" });
          break;
        case UserRole.marketer:
          navigate({ to: "/affiliate-dashboard" });
          break;
        default:
          navigate({ to: "/" });
      }
    } catch (_error) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join ANC Marketplace
          </h1>
          <p className="text-muted-foreground">
            Create your account and start your journey
          </p>
        </div>

        {step === "role" ? (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map(
                  ({
                    role,
                    label,
                    description,
                    icon: Icon,
                    color,
                    bg,
                    border,
                  }) => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedRole === role
                          ? `${border} ${bg} ring-2 ring-primary`
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${bg}`}>
                          <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {label}
                            </span>
                            {selectedRole === role && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ),
                )}
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleContinue}
                disabled={!selectedRole || isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("role")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={saveProfile.isPending}
                  >
                    {saveProfile.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
