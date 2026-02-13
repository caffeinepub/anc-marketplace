import React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight, Building2, CreditCard } from 'lucide-react';

export default function AccountPortalPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Account Portal</h1>
          <p className="text-muted-foreground">
            Welcome to your seller and business account portal. Manage your payouts, finances, and business settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Seller Payouts Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Seller Payouts
              </CardTitle>
              <CardDescription>
                Manage your payout accounts, view held balances, and request business debit or credit cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/payouts">
                  Go to Payouts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Business Account Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business Account
              </CardTitle>
              <CardDescription>
                Access your business profile, settings, and account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/customer-settings">
                  View Settings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Financial Services Card */}
          <Card className="hover:shadow-lg transition-shadow md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Financial Services
              </CardTitle>
              <CardDescription>
                Apply for business credit cards, request debit cards, and manage your business finances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/payouts">
                    Request Debit Card
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/payouts">
                    Apply for Credit Card
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
