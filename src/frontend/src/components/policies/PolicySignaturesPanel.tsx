import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, FileSignature, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSignPolicy, useVerifyPolicySignature } from '../../hooks/useQueries';
import { ALL_POLICIES, PolicyMetadata } from '../../lib/policies';
import { PolicySignatureRecord } from '../../backend';
import { toast } from 'sonner';

export default function PolicySignaturesPanel() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const signPolicyMutation = useSignPolicy();

  const [signingState, setSigningState] = useState<Record<string, { accepted: boolean; signature: string }>>({});

  const handleAcceptChange = (policyId: string, accepted: boolean) => {
    setSigningState((prev) => ({
      ...prev,
      [policyId]: { ...prev[policyId], accepted, signature: prev[policyId]?.signature || '' },
    }));
  };

  const handleSignatureChange = (policyId: string, signature: string) => {
    setSigningState((prev) => ({
      ...prev,
      [policyId]: { ...prev[policyId], signature, accepted: prev[policyId]?.accepted || false },
    }));
  };

  const handleSignPolicy = async (policy: PolicyMetadata) => {
    const state = signingState[policy.identifier];
    if (!state?.accepted || !state?.signature.trim()) {
      toast.error('Please accept the policy and provide your signature');
      return;
    }

    try {
      const backendIdentifier = { [policy.identifier]: null } as any;
      const record: PolicySignatureRecord = {
        policyIdentifier: backendIdentifier,
        policyVersion: policy.version,
        signerName: userProfile?.fullName || 'User',
        signature: state.signature.trim(),
        timestamp: BigInt(Date.now() * 1000000),
      };

      await signPolicyMutation.mutateAsync(record);
      toast.success(`${policy.displayName} signed successfully`);
      setSigningState((prev) => ({
        ...prev,
        [policy.identifier]: { accepted: false, signature: '' },
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign policy');
    }
  };

  if (!identity) {
    return (
      <Alert>
        <AlertCircle className="h-5 w-5" />
        <AlertDescription className="ml-2">Please log in to view and sign policies.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileSignature className="h-5 w-5 text-primary" />
          <CardTitle>Policy Signatures</CardTitle>
        </div>
        <CardDescription>Review and digitally sign required policies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {ALL_POLICIES.map((policy) => (
          <PolicySignatureItem
            key={policy.identifier}
            policy={policy}
            signingState={signingState[policy.identifier]}
            onAcceptChange={(accepted) => handleAcceptChange(policy.identifier, accepted)}
            onSignatureChange={(signature) => handleSignatureChange(policy.identifier, signature)}
            onSign={() => handleSignPolicy(policy)}
            isSigning={signPolicyMutation.isPending}
          />
        ))}
      </CardContent>
    </Card>
  );
}

interface PolicySignatureItemProps {
  policy: PolicyMetadata;
  signingState?: { accepted: boolean; signature: string };
  onAcceptChange: (accepted: boolean) => void;
  onSignatureChange: (signature: string) => void;
  onSign: () => void;
  isSigning: boolean;
}

function PolicySignatureItem({
  policy,
  signingState,
  onAcceptChange,
  onSignatureChange,
  onSign,
  isSigning,
}: PolicySignatureItemProps) {
  const { data: isSigned, isLoading } = useVerifyPolicySignature(policy);

  const getStatusDisplay = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Checking...</span>
        </div>
      );
    }
    if (isSigned) {
      return (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Signed</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-destructive">
        <XCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Not Signed</span>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-base">{policy.displayName}</h4>
          <p className="text-sm text-muted-foreground">Version {policy.version}</p>
        </div>
        {getStatusDisplay()}
      </div>

      {!isSigned && (
        <div className="space-y-4 pt-2 border-t">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`accept-${policy.identifier}`}
              checked={signingState?.accepted || false}
              onCheckedChange={(checked) => onAcceptChange(checked === true)}
            />
            <Label htmlFor={`accept-${policy.identifier}`} className="text-sm cursor-pointer leading-relaxed">
              I have read and agree to the{' '}
              <a href={policy.route} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {policy.displayName}
              </a>
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`signature-${policy.identifier}`} className="text-sm">
              Digital Signature (Type your full name)
            </Label>
            <Input
              id={`signature-${policy.identifier}`}
              type="text"
              placeholder="Enter your full name"
              value={signingState?.signature || ''}
              onChange={(e) => onSignatureChange(e.target.value)}
              disabled={!signingState?.accepted}
            />
          </div>

          <Button
            onClick={onSign}
            disabled={!signingState?.accepted || !signingState?.signature.trim() || isSigning}
            className="w-full"
          >
            <FileSignature className="h-4 w-4 mr-2" />
            {isSigning ? 'Signing...' : 'Sign Policy'}
          </Button>
        </div>
      )}
    </div>
  );
}
