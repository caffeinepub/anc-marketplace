import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Users, DollarSign, Award, Info } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function AffiliateDashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please log in to access the Affiliate Dashboard.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
        </div>
      </div>
    );
  }

  // Placeholder data - will be replaced with backend integration
  const affiliateData = {
    successfulReferrals: 0,
    commissionRate: 8.0,
    nextMilestone: 100,
    commissionBalance: 0,
    totalEarnings: 0,
    payoutPreference: null as 'paypal' | 'cashapp' | null,
    payoutHandle: '',
  };

  const milestones = [
    { count: 100, rate: 10, achieved: false },
    { count: 300, rate: 15, achieved: false },
    { count: 500, rate: 20, achieved: false },
    { count: 700, rate: 25, achieved: false },
    { count: 1000, rate: 30, achieved: false, bonus: 'Recurring commissions for 1 month' },
    { count: 1500, rate: 35, achieved: false },
    { count: 2000, rate: 40, achieved: false },
    { count: 3000, rate: 45, achieved: false, bonus: 'Recurring commissions for 1 month' },
    { count: 5000, rate: 50, achieved: false },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">
            Track your referrals, commissions, and milestone achievements
          </p>
        </div>

        <Alert className="mb-6 bg-primary/10 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Backend Integration Pending:</strong> The affiliate tracking system is currently being 
            integrated with the backend. Full functionality including referral tracking, commission calculations, 
            and payout management will be available soon.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateData.successfulReferrals}</div>
              <p className="text-xs text-muted-foreground">
                Next milestone: {affiliateData.nextMilestone}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateData.commissionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Current earning rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(affiliateData.commissionBalance / 100).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for payout
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(affiliateData.totalEarnings / 100).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>
                Configure your payout preferences (Coming Soon)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {affiliateData.payoutPreference ? (
                  <div className="space-y-2">
                    <p>
                      <strong>Method:</strong>{' '}
                      <Badge variant="secondary">
                        {affiliateData.payoutPreference === 'paypal' ? 'PayPal' : 'Cash App'}
                      </Badge>
                    </p>
                    <p>
                      <strong>Handle:</strong> {affiliateData.payoutHandle || 'Not set'}
                    </p>
                  </div>
                ) : (
                  <p>No payout method configured yet.</p>
                )}
              </div>
              <Button disabled className="w-full">
                Configure Payout Method
              </Button>
              <p className="text-xs text-muted-foreground">
                Note: Payouts are processed manually by the admin team. You will receive your earnings 
                via your chosen method after review.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Understanding the affiliate program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">Commission Structure</p>
                <p className="text-muted-foreground">
                  Start at 8% commission and increase your rate as you reach milestones, 
                  up to 50% at 5,000 successful referrals.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Special Bonuses</p>
                <p className="text-muted-foreground">
                  At 1,000 and 3,000 referrals, earn one month of recurring commissions 
                  from your referred customers.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Recognition</p>
                <p className="text-muted-foreground">
                  Receive recognition on our website and surprise gifts from the owner 
                  at each milestone.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commission Milestones</CardTitle>
            <CardDescription>
              Track your progress towards higher commission rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.count}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    milestone.achieved
                      ? 'bg-primary/10 border-primary/20'
                      : 'bg-muted/30 border-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border-2">
                      {milestone.achieved ? (
                        <Award className="h-6 w-6 text-primary" />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          {milestone.count}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {milestone.count} Referrals
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {milestone.rate}% Commission Rate
                      </p>
                      {milestone.bonus && (
                        <p className="text-xs text-primary font-medium mt-1">
                          🎁 Bonus: {milestone.bonus}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={milestone.achieved ? 'default' : 'outline'}>
                    {milestone.achieved ? 'Achieved' : 'Locked'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
