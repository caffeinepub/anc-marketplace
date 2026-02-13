import React from 'react';
import { Link } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileSignature } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useVerifyPolicySignature } from '../../hooks/useQueries';
import { ALL_POLICIES } from '../../lib/policies';

interface RequirePolicySignaturesProps {
  children: React.ReactNode;
}

export default function RequirePolicySignatures({ children }: RequirePolicySignaturesProps) {
  const { identity } = useInternetIdentity();

  const signatureChecks = ALL_POLICIES.map((policy) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: isSigned, isLoading } = useVerifyPolicySignature(policy);
    return { policy, isSigned, isLoading };
  });

  if (!identity) {
    return <>{children}</>;
  }

  const isCheckingSignatures = signatureChecks.some((check) => check.isLoading);
  const unsignedPolicies = signatureChecks.filter((check) => check.isSigned === false).map((check) => check.policy);

  if (isCheckingSignatures) {
    return <>{children}</>;
  }

  if (unsignedPolicies.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2 space-y-4">
            <p className="font-semibold">Policy Signatures Required</p>
            <p className="text-sm">
              You must review and sign all required policies before proceeding. The following policies need your
              signature:
            </p>
            <ul className="text-sm list-disc list-inside space-y-1">
              {unsignedPolicies.map((policy) => (
                <li key={policy.identifier}>{policy.displayName}</li>
              ))}
            </ul>
            <Button asChild className="w-full mt-4">
              <Link to="/customer-settings">
                <FileSignature className="h-4 w-4 mr-2" />
                Sign Policies in Settings
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
