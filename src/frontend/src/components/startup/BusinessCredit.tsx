import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, CheckCircle2, AlertCircle, TrendingUp, Building2, FileCheck } from 'lucide-react';
import { useGetUserBusinessCredit, useUpdateBusinessVerificationStatus } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function BusinessCredit() {
  const { data: creditData, isLoading } = useGetUserBusinessCredit();
  const updateVerification = useUpdateBusinessVerificationStatus();

  const handleUpdateVerification = async (status: string) => {
    try {
      await updateVerification.mutateAsync(status);
      toast.success('Verification status updated!');
    } catch (error) {
      toast.error('Failed to update verification status');
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
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Business Credit Builder</CardTitle>
              <CardDescription>Build and establish your business credit profile</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">Business Verification</CardTitle>
                      <CardDescription className="text-sm">
                        Verify your business entity and registration
                      </CardDescription>
                    </div>
                  </div>
                  {verificationComplete ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your business verification to establish credibility with credit bureaus.
                </p>
                {!verificationComplete && (
                  <Button
                    onClick={() => handleUpdateVerification('completed')}
                    disabled={updateVerification.isPending}
                    size="sm"
                  >
                    {updateVerification.isPending ? 'Updating...' : 'Mark as Complete'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">Credit Bureau Registration</CardTitle>
                      <CardDescription className="text-sm">
                        Register with major business credit bureaus
                      </CardDescription>
                    </div>
                  </div>
                  {bureauComplete ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Register with Dun & Bradstreet, Experian, and Equifax to start building your business credit score.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Dun & Bradstreet</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Experian Business</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Equifax Business</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Credit Building Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Pay all business bills on time to establish a positive payment history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Keep business and personal finances separate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Monitor your business credit reports regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Establish trade lines with vendors who report to credit bureaus</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
