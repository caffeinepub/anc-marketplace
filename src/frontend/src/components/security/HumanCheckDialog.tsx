import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HumanCheckDialogProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function HumanCheckDialog({ open, onSuccess, onCancel }: HumanCheckDialogProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [showError, setShowError] = useState(false);

  // Simple math challenge
  const num1 = 7;
  const num2 = 3;
  const correctAnswer = num1 + num2;

  const handleVerify = () => {
    if (!isChecked) {
      setShowError(true);
      return;
    }

    const userAnswer = parseInt(challengeAnswer, 10);
    if (userAnswer !== correctAnswer) {
      setShowError(true);
      return;
    }

    setShowError(false);
    onSuccess();
  };

  const handleClose = () => {
    setIsChecked(false);
    setChallengeAnswer('');
    setShowError(false);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <DialogTitle>Human Verification</DialogTitle>
          </div>
          <DialogDescription>
            Please complete this quick verification to continue with your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="human-check"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="human-check"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I am a human
              </Label>
              <p className="text-sm text-muted-foreground">
                Confirm that you are not a bot
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge">
              What is {num1} + {num2}?
            </Label>
            <input
              id="challenge"
              type="number"
              value={challengeAnswer}
              onChange={(e) => setChallengeAnswer(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your answer"
            />
          </div>

          {showError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please check the box and answer the question correctly.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleVerify}>
            Verify & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
