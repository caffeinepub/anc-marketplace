import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, CheckCircle2, AlertCircle, TrendingUp, Building2, FileCheck } from 'lucide-react';
import { useGetUserBusinessCredit, useUpdateBusinessVerificationStatus, useUpdateCreditBureauRegistrationStatus } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function BusinessCredit() {
  const { data: creditData, isLoading } = useGetUserBusinessCredit();
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
              {Math.round(completionPercentage)}% Complete
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
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Access better financing options and lower interest rates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Separate personal and business finances</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Build credibility with vendors and suppliers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Protect your personal credit score</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className={verificationComplete ? 'bg-primary/5 border-primary/20' : ''}>
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
                    <CardTitle className="text-xl">Business Verification</CardTitle>
                    {verificationComplete && <Badge variant="default">Completed</Badge>}
                  </div>
                  <CardDescription className="text-base">
                    Verify your business entity with official documentation
                  </CardDescription>
                </div>
              </div>
              {!verificationComplete && (
                <Button
                  onClick={() => handleUpdateVerification('completed')}
                  disabled={updateVerification.isPending}
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className={bureauComplete ? 'bg-primary/5 border-primary/20' : ''}>
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
                  </div>
                  <CardDescription className="text-base">
                    Register your business with major credit bureaus (Dun & Bradstreet, Experian, Equifax)
                  </CardDescription>
                </div>
              </div>
              {!bureauComplete && (
                <Button
                  onClick={() => handleUpdateBureau('completed')}
                  disabled={updateBureau.isPending}
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
