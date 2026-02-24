import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Store, Image, Palette, Package, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import SellerProfilePlaceholderCard from '../components/seller/SellerProfilePlaceholderCard';

export default function SellerProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Seller Profile</h1>
          </div>
          <p className="text-slate-600">
            Manage your seller account, customize your store, and access business tools
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Placeholder Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Store Branding */}
          <SellerProfilePlaceholderCard
            icon={<Image className="h-6 w-6 text-blue-600" />}
            title="Store Branding"
            description="Upload your logo, profile picture, or design a custom logo with our built-in designer."
            badge="Coming Soon"
          />

          {/* Account Details */}
          <SellerProfilePlaceholderCard
            icon={<SettingsIcon className="h-6 w-6 text-emerald-600" />}
            title="Account Details"
            description="View and update your seller account information, contact details, and business profile."
            badge="Coming Soon"
          />

          {/* Dashboard Customization */}
          <SellerProfilePlaceholderCard
            icon={<Palette className="h-6 w-6 text-purple-600" />}
            title="Dashboard Customization"
            description="Personalize your dashboard with custom themes, colors, fonts, and widgets."
            badge="Coming Soon"
          />

          {/* Apps & Integrations */}
          <SellerProfilePlaceholderCard
            icon={<Package className="h-6 w-6 text-amber-600" />}
            title="Apps & Integrations"
            description="Browse and install apps from our library to enhance your store and dashboard functionality."
            badge="Coming Soon"
          />

          {/* Store Settings */}
          <SellerProfilePlaceholderCard
            icon={<Store className="h-6 w-6 text-teal-600" />}
            title="Store Settings"
            description="Configure your store preferences, payment methods, shipping options, and more."
            badge="Coming Soon"
          />

          {/* Support & Resources */}
          <SellerProfilePlaceholderCard
            icon={<HelpCircle className="h-6 w-6 text-rose-600" />}
            title="Support & Resources"
            description="Access help documentation, tutorials, and contact our support team for assistance."
            badge="Coming Soon"
          />
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-2 border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Building Your Seller Experience</CardTitle>
            <CardDescription className="text-slate-600">
              We're actively developing features to help you succeed as a seller on ANC Marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              The sections above represent planned features that will be available soon. Each area will provide
              powerful tools to help you manage your business, customize your presence, and grow your sales.
              Stay tuned for updates as we roll out these capabilities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
