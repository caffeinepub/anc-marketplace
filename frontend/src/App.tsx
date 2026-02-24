import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCenterPage from './pages/AdminCenterPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import CustomerFAQ from './pages/CustomerFAQ';
import SellersBusinessesFAQ from './pages/SellersBusinessesFAQ';
import CustomerBlog from './pages/CustomerBlog';
import SellersBusinessesBlog from './pages/SellersBusinessesBlog';
import CustomerBlogPost from './pages/CustomerBlogPost';
import SellersBusinessesBlogPost from './pages/SellersBusinessesBlogPost';
import AppCenterPage from './pages/AppCenterPage';
import AppLaunchPage from './pages/AppLaunchPage';
import PciCompliancePage from './pages/PciCompliancePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnsPolicyPage from './pages/ReturnsPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import MarketplacePolicyPage from './pages/MarketplacePolicyPage';
import AccountPortalPage from './pages/AccountPortalPage';
import CustomerSettingsPage from './pages/CustomerSettingsPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import SellerOnboardingWizardPage from './pages/SellerOnboardingWizardPage';
import SellerProfilePage from './pages/SellerProfilePage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AffiliateDashboardPage from './pages/AffiliateDashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import RegisterPage from './pages/RegisterPage';
import ApplyPage from './pages/ApplyPage';
import RuntimeErrorBoundary from './components/RuntimeErrorBoundary';
import RouterErrorScreen from './components/RouterErrorScreen';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
  path: '/',
  component: HomePage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-dashboard',
  component: AdminDashboard,
});

const adminCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminCenterPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailure,
});

const customerFAQRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-faq',
  component: CustomerFAQ,
});

const sellersBusinessesFAQRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sellers-businesses-faq',
  component: SellersBusinessesFAQ,
});

const customerBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-blog',
  component: CustomerBlog,
});

const sellersBusinessesBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sellers-businesses-blog',
  component: SellersBusinessesBlog,
});

const customerBlogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-blog/$postId',
  component: CustomerBlogPost,
});

const sellersBusinessesBlogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sellers-businesses-blog/$postId',
  component: SellersBusinessesBlogPost,
});

const appCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app-center',
  component: AppCenterPage,
});

const appLaunchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app-launch/$appId',
  component: AppLaunchPage,
});

const pciComplianceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pci-compliance',
  component: PciCompliancePage,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicyPage,
});

const shippingPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shipping-policy',
  component: ShippingPolicyPage,
});

const returnsPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/returns-policy',
  component: ReturnsPolicyPage,
});

const termsConditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms-and-conditions',
  component: TermsConditionsPage,
});

const marketplacePolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace-policy',
  component: MarketplacePolicyPage,
});

const accountPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account-portal',
  component: AccountPortalPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: CustomerSettingsPage,
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile-setup',
  component: ProfileSetupPage,
});

const sellerOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller/onboarding',
  component: SellerOnboardingWizardPage,
});

const sellerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller/profile',
  component: SellerProfilePage,
});

const sellerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller/dashboard',
  component: SellerDashboardPage,
});

const affiliateDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/affiliate-dashboard',
  component: AffiliateDashboardPage,
});

const customerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-dashboard',
  component: CustomerDashboardPage,
});

const businessDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business-dashboard',
  component: BusinessDashboardPage,
});

const employeeDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee-dashboard',
  component: EmployeeDashboardPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const applyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/apply',
  component: ApplyPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminDashboardRoute,
  adminCenterRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  customerFAQRoute,
  sellersBusinessesFAQRoute,
  customerBlogRoute,
  sellersBusinessesBlogRoute,
  customerBlogPostRoute,
  sellersBusinessesBlogPostRoute,
  appCenterRoute,
  appLaunchRoute,
  pciComplianceRoute,
  privacyPolicyRoute,
  shippingPolicyRoute,
  returnsPolicyRoute,
  termsConditionsRoute,
  marketplacePolicyRoute,
  accountPortalRoute,
  settingsRoute,
  profileSetupRoute,
  sellerOnboardingRoute,
  sellerProfileRoute,
  sellerDashboardRoute,
  affiliateDashboardRoute,
  customerDashboardRoute,
  businessDashboardRoute,
  employeeDashboardRoute,
  registerRoute,
  applyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <RuntimeErrorBoundary>
      <InternetIdentityProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </InternetIdentityProvider>
    </RuntimeErrorBoundary>
  );
}
