import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface HumanCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export default function HumanCheckDialog({ open, onOpenChange, onVerified }: HumanCheckDialogProps) {
  const [isHuman, setIsHuman] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [error, setError] = useState('');

  const num1 = 7;
  const num2 = 3;
  const correctAnswer = num1 + num2;

  const handleVerify = () => {
    if (!isHuman) {
      setError('Please confirm you are human');
      return;
    }

    if (parseInt(mathAnswer) !== correctAnswer) {
      setError('Incorrect answer. Please try again.');
      return;
    }

    onVerified();
    onOpenChange(false);
    setIsHuman(false);
    setMathAnswer('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-menu-border shadow-lg">
        <DialogHeader>
          <DialogTitle>Human Verification</DialogTitle>
          <DialogDescription>
            Please complete this quick verification to continue with your payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="human-check"
              checked={isHuman}
              onCheckedChange={(checked) => setIsHuman(checked === true)}
            />
            <Label htmlFor="human-check" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I am a human
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="math-challenge">What is {num1} + {num2}?</Label>
            <Input
              id="math-challenge"
              type="number"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              placeholder="Enter your answer"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleVerify} className="w-full">
            Verify & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
