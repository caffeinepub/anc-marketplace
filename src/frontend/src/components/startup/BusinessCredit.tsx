import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, CheckCircle2, AlertCircle, TrendingUp, Building2, FileCheck } from 'lucide-react';
import { useGetUserBusinessCredit, useUpdateBusinessVerificationStatus, useUpdateCreditBureauRegistrationStatus } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function BusinessCredit() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: creditData, isLoading } = useGetUserBusinessCredit(principal);
  const updateVerification = useUpdateBusinessVerificationStatus();
  const updateBureau = useUpdateCreditBureauRegistrationStatus();

  const handleUpdateVerification = async (status: string) => {
    try {
      await updateVerification.mutateAsync(status);
      toast.success('Verification status updated!');
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const handleUpdateBureau = async (status: string) => {
    try {
      await updateBureau.mutateAsync(status);
      toast.success('Bureau registration status updated!');
    } catch (error) {
      toast.error('Failed to update bureau status');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading business credit data...</p>
        </CardContent>
      </Card>
    );
  }

  const verificationComplete = creditData?.businessVerificationStatus === 'completed';
  const bureauComplete = creditData?.creditBureauRegistrationStatus === 'completed';
  const completionPercentage = creditData?.completionPercentage || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Business Credit Builder
              </CardTitle>
              <CardDescription>Build and establish your business credit profile</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {Math.round(completionPercentage)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Why Business Credit Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Building business credit is essential for accessing financing, establishing vendor relationships, and growing your startup. Follow these steps to establish a strong credit profile.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Separate your personal and business finances</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Access better financing terms and higher credit limits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Build credibility with vendors and partners</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Protect your personal credit score</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className={verificationComplete ? 'bg-muted/30' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${verificationComplete ? 'bg-primary/10' : 'bg-muted'}`}>
                  {verificationComplete ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl">Business Information Verification</CardTitle>
                    {verificationComplete && <Badge variant="default">Completed</Badge>}
                    {!verificationComplete && <Badge variant="secondary">In Progress</Badge>}
                  </div>
                  <CardDescription className="text-base mb-4">
                    Verify your business information including EIN, business address, and legal structure
                  </CardDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Obtain your EIN (Employer Identification Number)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Register your business address</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verify business phone number</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Confirm legal business structure</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {!verificationComplete && (
                  <Button onClick={() => handleUpdateVerification('completed')} disabled={updateVerification.isPending}>
                    {updateVerification.isPending ? 'Updating...' : 'Mark Complete'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className={bureauComplete ? 'bg-muted/30' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${bureauComplete ? 'bg-primary/10' : 'bg-muted'}`}>
                  {bureauComplete ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <FileCheck className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl">Credit Bureau Registration</CardTitle>
                    {bureauComplete && <Badge variant="default">Completed</Badge>}
                    {!bureauComplete && <Badge variant="secondary">Pending</Badge>}
                  </div>
                  <CardDescription className="text-base mb-4">
                    Register your business with major credit bureaus to start building your credit profile
                  </CardDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Register with Dun & Bradstreet (D-U-N-S Number)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Register with Experian Business</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Register with Equifax Business</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Monitor your business credit reports</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {!bureauComplete && (
                  <Button onClick={() => handleUpdateBureau('completed')} disabled={updateBureau.isPending}>
                    {updateBureau.isPending ? 'Updating...' : 'Mark Complete'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Credit Building Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <div className="p-2 rounded-full bg-primary/10">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Establish Business Identity</h4>
                <p className="text-sm text-muted-foreground">
                  Complete business verification and obtain all necessary identification numbers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <div className="p-2 rounded-full bg-primary/10">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Register with Credit Bureaus</h4>
                <p className="text-sm text-muted-foreground">
                  Create profiles with major business credit reporting agencies
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <div className="p-2 rounded-full bg-primary/10">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Build Credit History</h4>
                <p className="text-sm text-muted-foreground">
                  Establish vendor accounts and make timely payments to build positive credit history
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
