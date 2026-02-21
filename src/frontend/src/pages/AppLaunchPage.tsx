import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ExternalLink, Settings, Trash2, Info } from 'lucide-react';

export default function AppLaunchPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <AppLaunchContent />
    </RequireAuthenticatedRegisteredUser>
  );
}

function AppLaunchContent() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { appId?: string };
  const appId = params.appId || 'unknown';

  // App configuration data
  const appConfigs: Record<string, {
    name: string;
    description: string;
    longDescription: string;
    status: 'installed' | 'configured' | 'active';
    launchUrl?: string;
  }> = {
    clickfunnels: {
      name: 'ClickFunnels',
      description: 'Create high-converting sales funnels',
      longDescription: 'ClickFunnels is a powerful marketing platform that helps you build sales funnels, landing pages, and marketing campaigns. Integrate with your ANC Marketplace store to drive more sales.',
      status: 'active',
      launchUrl: 'https://clickfunnels.com',
    },
    dropshipping: {
      name: 'Dropshipping Partners',
      description: 'Connect with dropshipping suppliers',
      longDescription: 'Access a network of trusted dropshipping suppliers to expand your product catalog without holding inventory. Automate order fulfillment and focus on growing your business.',
      status: 'configured',
    },
    'template-selector': {
      name: 'Template Selector',
      description: 'Choose from professional store templates',
      longDescription: 'Browse and select from a variety of professionally designed store templates. Customize colors, layouts, and branding to match your business identity.',
      status: 'installed',
    },
  };

  const appConfig = appConfigs[appId] || {
    name: 'Unknown App',
    description: 'App not found',
    longDescription: 'This app is not available or has not been configured yet.',
    status: 'installed' as const,
  };

  const handleLaunch = () => {
    if (appConfig.launchUrl) {
      window.open(appConfig.launchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleConfigure = () => {
    // Navigate to configuration page (placeholder)
    alert('Configuration interface coming soon!');
  };

  const handleUninstall = () => {
    if (confirm(`Are you sure you want to uninstall ${appConfig.name}?`)) {
      alert('Uninstall functionality coming soon!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/app-center' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to App Center
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* App Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{appConfig.name}</CardTitle>
                  <CardDescription className="text-base">{appConfig.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appConfig.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    appConfig.status === 'configured' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {appConfig.status.charAt(0).toUpperCase() + appConfig.status.slice(1)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{appConfig.longDescription}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {appConfig.launchUrl && (
                  <Button onClick={handleLaunch} size="lg">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Launch App
                  </Button>
                )}
                <Button onClick={handleConfigure} variant="outline" size="lg">
                  <Settings className="mr-2 h-5 w-5" />
                  Configure
                </Button>
                <Button onClick={handleUninstall} variant="destructive" size="lg">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Uninstall
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Easy integration with your store</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Real-time synchronization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Comprehensive analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Active ANC Marketplace account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Completed seller onboarding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Valid payment method on file</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Info Alert */}
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              App launch and configuration features are currently in development. Full functionality will be available soon. Contact support for assistance with app integration.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
