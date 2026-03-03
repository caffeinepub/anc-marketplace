import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSaveCallerUserProfile } from "../hooks/useQueries";
import { UserRole } from "../backend";
import type { UserProfile } from "../backend";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileSetupProps {
  open: boolean;
  onComplete?: () => void;
  roleSelection?: UserRole;
}

export default function ProfileSetup({
  open,
  onComplete,
  roleSelection,
}: ProfileSetupProps) {
  const navigate = useNavigate();
  const saveProfile = useSaveCallerUserProfile();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const profile: UserProfile = {
      fullName: fullName.trim(),
      email: email.trim(),
      activeRole: roleSelection ?? UserRole.customer,
      subscriptionId: undefined,
      accountCreated: BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Profile created successfully!");
      if (onComplete) {
        onComplete();
      } else {
        navigate({ to: "/" });
      }
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Complete Your Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Please provide your details to get started with ANC Marketplace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="bg-white border-gray-300 text-gray-900"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-white border-gray-300 text-gray-900"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
