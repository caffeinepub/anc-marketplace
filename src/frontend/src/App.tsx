import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import RequireRegisteredUser from './components/RequireRegisteredUser';
import HomePage from './pages/HomePage';
import AdminCenterPage from './pages/AdminCenterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import CustomerFAQ from './pages/CustomerFAQ';
import SellersBusinessesFAQ from './pages/SellersBusinessesFAQ';
import CustomerBlog from './pages/CustomerBlog';
import SellersBusinessesBlog from './pages/SellersBusinessesBlog';
import CustomerBlogPost from './pages/CustomerBlogPost';
import SellersBusinessesBlogPost from './pages/SellersBusinessesBlogPost';
import PciCompliancePage from './pages/PciCompliancePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnsPolicyPage from './pages/ReturnsPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import MarketplacePolicyPage from './pages/MarketplacePolicyPage';
import CustomerSettingsPage from './pages/CustomerSettingsPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import RuntimeErrorBoundary from './components/RuntimeErrorBoundary';
import RouterErrorScreen from './components/RouterErrorScreen';
import { VoiceSettingsProvider } from './contexts/VoiceSettingsContext';
import AssistantWidget from './components/assistant/AssistantWidget';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
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

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile-setup',
  component: ProfileSetupPage,
});

const adminCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <RequireRegisteredUser>
      <AdminCenterPage />
    </RequireRegisteredUser>
  ),
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

const customerSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <RequireRegisteredUser>
      <CustomerSettingsPage />
    </RequireRegisteredUser>
  ),
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileSetupRoute,
  adminCenterRoute,
  customerFAQRoute,
  sellersBusinessesFAQRoute,
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
  customerSettingsRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
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
      <QueryClientProvider client={queryClient}>
        <VoiceSettingsProvider>
          <RouterProvider router={router} />
          <AssistantWidget />
        </VoiceSettingsProvider>
      </QueryClientProvider>
    </RuntimeErrorBoundary>
  );
}
