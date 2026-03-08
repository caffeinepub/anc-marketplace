import { UserRole } from "../backend";
import { useGetCallerUserProfile } from "./useQueries";

export function useRoleBasedRedirect() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  const getRedirectPath = (): string | null => {
    if (!userProfile) return null;

    switch (userProfile.activeRole) {
      case UserRole.seller:
        return "/seller/dashboard";
      case UserRole.customer:
        return "/customer-dashboard";
      case UserRole.business:
        return "/business-dashboard";
      case UserRole.marketer:
        return "/affiliate-dashboard";
      case UserRole.employee:
        return "/employee-dashboard";
      case UserRole.admin:
        return "/admin";
      default:
        return null;
    }
  };

  return {
    redirectPath: getRedirectPath(),
    isLoading,
  };
}
