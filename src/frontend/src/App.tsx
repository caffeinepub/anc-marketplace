import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import StartupDashboard from './pages/StartupDashboard';
import B2BDashboard from './pages/B2BDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import AppCenterPage from './pages/AppCenterPage';
import FunnelsPage from './pages/FunnelsPage';
import AppointmentDashboard53 from './pages/AppointmentDashboard53';
import StoreBuilderPage from './pages/StoreBuilderPage';
import CustomerFAQ from './pages/CustomerFAQ';
import SellersBusinessesFAQ from './pages/SellersBusinessesFAQ';
import CustomerBlog from './pages/CustomerBlog';
import SellersBusinessesBlog from './pages/SellersBusinessesBlog';
import CustomerBlogPost from './pages/CustomerBlogPost';
import SellersBusinessesBlogPost from './pages/SellersBusinessesBlogPost';
import PciCompliancePage from './pages/PciCompliancePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AffiliateDashboardPage from './pages/AffiliateDashboardPage';
import ProfileSetup from './components/ProfileSetup';
import Layout from './components/Layout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: Layout,
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

const startupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/startup-dashboard',
  component: StartupDashboard,
});

const b2bRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/b2b-dashboard',
  component: B2BDashboard,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
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

const affiliateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/affiliate',
  component: AffiliateDashboardPage,
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
  storeRoute,
  startupRoute,
  b2bRoute,
  adminRoute,
  appCenterRoute,
  funnelsRoute,
  storeBuilderRoute,
  appointmentDashboard53Route,
  customerFAQRoute,
  sellersBusinessesFAQRoute,
  customerBlogRoute,
  sellersBusinessesBlogRoute,
  customerBlogPostRoute,
  sellersBusinessesBlogPostRoute,
  pciComplianceRoute,
  privacyPolicyRoute,
  affiliateRoute,
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
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {showProfileSetup ? <ProfileSetup /> : <RouterProvider router={router} />}
      <Toaster />
    </ThemeProvider>
  );
}
