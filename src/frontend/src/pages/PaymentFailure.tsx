import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="container py-12 flex items-center justify-center min-h-[600px]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>Your payment could not be processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            We encountered an issue processing your payment. Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => navigate({ to: '/store' })}>
              Try Again
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/' })}>
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
