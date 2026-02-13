import { StrictMode } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
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
import SellerPayoutsPage from './pages/SellerPayoutsPage';
import AdminCenterPage from './pages/AdminCenterPage';
import AccountPortalPage from './pages/AccountPortalPage';
import RuntimeErrorBoundary from './components/RuntimeErrorBoundary';
import RouterErrorScreen from './components/RouterErrorScreen';

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
  component: Layout,
  errorComponent: RouterErrorScreen,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
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
  path: '/customer-settings',
  component: CustomerSettingsPage,
});

const payoutsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payouts',
  component: SellerPayoutsPage,
});

const adminCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminCenterPage,
});

const accountPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portal',
  component: AccountPortalPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
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
  payoutsRoute,
  adminCenterRoute,
  accountPortalRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <RuntimeErrorBoundary>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </RuntimeErrorBoundary>
    </StrictMode>
  );
}
