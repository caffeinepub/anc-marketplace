import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Zap, ShoppingCart, TrendingUp, Mail, Package } from 'lucide-react';

export default function AppCenterPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <AppCenterContent />
    </RequireAuthenticatedRegisteredUser>
  );
}

function AppCenterContent() {
  const navigate = useNavigate();

  const appCategories = [
    {
      id: 'store-builder',
      name: 'Store Builder Apps',
      description: 'Build and customize your online store',
      icon: ShoppingCart,
      color: 'emerald',
      apps: [
        {
          id: 'template-selector',
          name: 'Template Selector',
          description: 'Choose from professional store templates',
          status: 'available',
        },
        {
          id: 'branding-tools',
          name: 'Branding Tools',
          description: 'Customize your store appearance',
          status: 'coming-soon',
        },
      ],
    },
    {
      id: 'marketing',
      name: 'Marketing Tools',
      description: 'Promote your business and reach customers',
      icon: TrendingUp,
      color: 'blue',
      apps: [
        {
          id: 'clickfunnels',
          name: 'ClickFunnels',
          description: 'Create high-converting sales funnels',
          status: 'available',
          external: true,
        },
        {
          id: 'email-campaigns',
          name: 'Email Campaigns',
          description: 'Send targeted email marketing',
          status: 'coming-soon',
        },
      ],
    },
    {
      id: 'fulfillment',
      name: 'Fulfillment & Shipping',
      description: 'Manage orders and shipping',
      icon: Package,
      color: 'orange',
      apps: [
        {
          id: 'dropshipping',
          name: 'Dropshipping Partners',
          description: 'Connect with dropshipping suppliers',
          status: 'available',
        },
        {
          id: 'shipping-labels',
          name: 'Shipping Labels',
          description: 'Print shipping labels and track packages',
          status: 'coming-soon',
        },
      ],
    },
    {
      id: 'analytics',
      name: 'Analytics & Insights',
      description: 'Track performance and make data-driven decisions',
      icon: Zap,
      color: 'purple',
      apps: [
        {
          id: 'sales-dashboard',
          name: 'Sales Dashboard',
          description: 'Monitor your sales and revenue',
          status: 'available',
        },
        {
          id: 'customer-insights',
          name: 'Customer Insights',
          description: 'Understand your customer behavior',
          status: 'coming-soon',
        },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-600' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">App Center</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover and integrate powerful apps to grow your business. From marketing tools to fulfillment solutions, find everything you need in one place.
          </p>
        </div>

        {/* App Categories */}
        <div className="space-y-12">
          {appCategories.map((category) => {
            const Icon = category.icon;
            const colorClasses = getColorClasses(category.color);

            return (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
                    <Icon className={`h-6 w-6 ${colorClasses.text}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{category.name}</h2>
                    <p className="text-slate-600 dark:text-slate-400">{category.description}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.apps.map((app) => (
                    <Card key={app.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {app.name}
                              {app.external && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                            </CardTitle>
                            <CardDescription>{app.description}</CardDescription>
                          </div>
                          <Badge variant={app.status === 'available' ? 'default' : 'secondary'}>
                            {app.status === 'available' ? 'Available' : 'Coming Soon'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {app.status === 'available' ? (
                          <Button
                            className="w-full"
                            onClick={() => {
                              if (app.id === 'sales-dashboard') {
                                navigate({ to: '/seller/dashboard' });
                              } else {
                                navigate({ 
                                  to: '/app-launch/$appId',
                                  params: { appId: app.id }
                                });
                              }
                            }}
                          >
                            {app.external ? 'Launch App' : 'Configure'}
                          </Button>
                        ) : (
                          <Button className="w-full" variant="outline" disabled>
                            Coming Soon
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Our team is here to help you get the most out of your apps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Contact us at ancelectronicsnservices@gmail.com for app integration support, custom solutions, or to request new app integrations.
            </p>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
