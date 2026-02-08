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

const routeTree = rootRoute.addChildren([
  indexRoute,
  storeRoute,
  startupRoute,
  b2bRoute,
  adminRoute,
  appCenterRoute,
  funnelsRoute,
  appointmentDashboard53Route,
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
