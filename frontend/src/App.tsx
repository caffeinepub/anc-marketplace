import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Link,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import AdminCenterPage from "./pages/AdminCenterPage";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import BusinessDashboardPage from "./pages/BusinessDashboardPage";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage";
import AffiliateDashboardPage from "./pages/AffiliateDashboardPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerOnboardingWizardPage from "./pages/SellerOnboardingWizardPage";
import SellerProfilePage from "./pages/SellerProfilePage";
import SellerPayoutsPage from "./pages/SellerPayoutsPage";
import ApplyPage from "./pages/ApplyPage";
import AppCenterPage from "./pages/AppCenterPage";
import AppLaunchPage from "./pages/AppLaunchPage";
import FunnelsPage from "./pages/FunnelsPage";
import AppointmentDashboard53 from "./pages/AppointmentDashboard53";
import StoreBuilderPage from "./pages/StoreBuilderPage";
import AccountPortalPage from "./pages/AccountPortalPage";
import CustomerSettingsPage from "./pages/CustomerSettingsPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import CustomerFAQ from "./pages/CustomerFAQ";
import SellersBusinessesFAQ from "./pages/SellersBusinessesFAQ";
import CustomerBlog from "./pages/CustomerBlog";
import SellersBusinessesBlog from "./pages/SellersBusinessesBlog";
import CustomerBlogPost from "./pages/CustomerBlogPost";
import SellersBusinessesBlogPost from "./pages/SellersBusinessesBlogPost";
import PciCompliancePage from "./pages/PciCompliancePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";
import ReturnsPolicyPage from "./pages/ReturnsPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import MarketplacePolicyPage from "./pages/MarketplacePolicyPage";
import { RouterErrorScreen } from "./components/RouterErrorScreen";
import { RuntimeErrorBoundary } from "./components/RuntimeErrorBoundary";
import { VoiceSettingsProvider } from "./contexts/VoiceSettingsContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  errorComponent: RouterErrorScreen,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile-setup",
  component: ProfileSetupPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminCenterPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-dashboard",
  component: AdminDashboard,
});

const sellerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller-dashboard",
  component: SellerDashboardPage,
});

const customerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer-dashboard",
  component: CustomerDashboardPage,
});

const businessDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-dashboard",
  component: BusinessDashboardPage,
});

const employeeDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employee-dashboard",
  component: EmployeeDashboardPage,
});

const affiliateDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/affiliate-dashboard",
  component: AffiliateDashboardPage,
});

const sellerOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller-onboarding",
  component: SellerOnboardingWizardPage,
});

const sellerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller-profile",
  component: SellerProfilePage,
});

const sellerPayoutsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seller-payouts",
  component: SellerPayoutsPage,
});

const applyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apply",
  component: ApplyPage,
});

const appCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app-center",
  component: AppCenterPage,
});

const appLaunchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app-center/$appId",
  component: AppLaunchPage,
});

const funnelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/funnels",
  component: FunnelsPage,
});

const appointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/appointments",
  component: AppointmentDashboard53,
});

const storeBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store-builder",
  component: StoreBuilderPage,
});

const accountPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPortalPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: CustomerSettingsPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
});

const customerFaqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq/customers",
  component: CustomerFAQ,
});

const sellersBusinessesFaqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq/sellers-businesses",
  component: SellersBusinessesFAQ,
});

const customerBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/customers",
  component: CustomerBlog,
});

const sellersBusinessesBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/sellers-businesses",
  component: SellersBusinessesBlog,
});

const customerBlogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/customers/$postId",
  component: CustomerBlogPost,
});

const sellersBusinessesBlogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/sellers-businesses/$postId",
  component: SellersBusinessesBlogPost,
});

const pciComplianceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pci-compliance",
  component: PciCompliancePage,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});

const shippingPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipping-policy",
  component: ShippingPolicyPage,
});

const returnsPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/returns-policy",
  component: ReturnsPolicyPage,
});

const termsConditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms-conditions",
  component: TermsConditionsPage,
});

const marketplacePolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace-policy",
  component: MarketplacePolicyPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  profileSetupRoute,
  adminRoute,
  adminDashboardRoute,
  sellerDashboardRoute,
  customerDashboardRoute,
  businessDashboardRoute,
  employeeDashboardRoute,
  affiliateDashboardRoute,
  sellerOnboardingRoute,
  sellerProfileRoute,
  sellerPayoutsRoute,
  applyRoute,
  appCenterRoute,
  appLaunchRoute,
  funnelsRoute,
  appointmentRoute,
  storeBuilderRoute,
  accountPortalRoute,
  settingsRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  customerFaqRoute,
  sellersBusinessesFaqRoute,
  customerBlogRoute,
  sellersBusinessesBlogRoute,
  customerBlogPostRoute,
  sellersBusinessesBlogPostRoute,
  pciComplianceRoute,
  privacyPolicyRoute,
  shippingPolicyRoute,
  returnsPolicyRoute,
  termsConditionsRoute,
  marketplacePolicyRoute,
]);

const router = createRouter({
  routeTree,
  defaultErrorComponent: RouterErrorScreen,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <RuntimeErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <VoiceSettingsProvider>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </VoiceSettingsProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </RuntimeErrorBoundary>
  );
}
