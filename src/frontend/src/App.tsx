import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import StartupDashboard from './pages/StartupDashboard';
import B2BDashboard from './pages/B2BDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AppCenterPage from './pages/AppCenterPage';
import FunnelsPage from './pages/FunnelsPage';
import StoreBuilderPage from './pages/StoreBuilderPage';
import AppointmentDashboard53 from './pages/AppointmentDashboard53';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import CustomerFAQ from './pages/CustomerFAQ';
import SellersBusinessesFAQ from './pages/SellersBusinessesFAQ';
import CustomerBlog from './pages/CustomerBlog';
import SellersBusinessesBlog from './pages/SellersBusinessesBlog';
import CustomerBlogPost from './pages/CustomerBlogPost';
import SellersBusinessesBlogPost from './pages/SellersBusinessesBlogPost';
import PciCompliancePage from './pages/PciCompliancePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AffiliateDashboardPage from './pages/AffiliateDashboardPage';
import CustomerProfileHome from './pages/CustomerProfileHome';
import CustomerWishlistPage from './pages/CustomerWishlistPage';
import CustomerFavoritesPage from './pages/CustomerFavoritesPage';
import CustomerSettingsPage from './pages/CustomerSettingsPage';
import CustomerPurchaseHistoryPage from './pages/CustomerPurchaseHistoryPage';
import CustomerMessagesPage from './pages/CustomerMessagesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => <Layout><RouterProvider router={router} /></Layout>,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/store',
  component: StorePage,
});

const startupDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/startup-dashboard',
  component: StartupDashboard,
});

const b2bDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/b2b-dashboard',
  component: B2BDashboard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    return {
      tab: typeof search.tab === 'string' ? search.tab : undefined,
    };
  },
});

const appCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app-center',
  component: AppCenterPage,
});

const funnelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/funnels',
  component: FunnelsPage,
});

const storeBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/store-builder',
  component: StoreBuilderPage,
});

const appointmentDashboard53Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointment-dashboard53',
  component: AppointmentDashboard53,
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

const affiliateDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/affiliate-dashboard',
  component: AffiliateDashboardPage,
});

const customerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-profile',
  component: CustomerProfileHome,
});

const customerWishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-wishlist',
  component: CustomerWishlistPage,
});

const customerFavoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-favorites',
  component: CustomerFavoritesPage,
});

const customerSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-settings',
  component: CustomerSettingsPage,
});

const customerPurchasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-purchases',
  component: CustomerPurchaseHistoryPage,
});

const customerMessagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer-messages',
  component: CustomerMessagesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storeRoute,
  startupDashboardRoute,
  b2bDashboardRoute,
  adminDashboardRoute,
  appCenterRoute,
  funnelsRoute,
  storeBuilderRoute,
  appointmentDashboard53Route,
  paymentSuccessRoute,
  paymentFailureRoute,
  customerFAQRoute,
  sellersBusinessesFAQRoute,
  customerBlogRoute,
  sellersBusinessesBlogRoute,
  customerBlogPostRoute,
  sellersBusinessesBlogPostRoute,
  pciComplianceRoute,
  privacyPolicyRoute,
  affiliateDashboardRoute,
  customerProfileRoute,
  customerWishlistRoute,
  customerFavoritesRoute,
  customerSettingsRoute,
  customerPurchasesRoute,
  customerMessagesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <RouterProvider router={router} />
          <Toaster />
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
