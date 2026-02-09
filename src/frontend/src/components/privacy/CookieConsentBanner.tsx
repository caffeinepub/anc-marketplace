import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { shouldShowCookieConsent, setCookieConsent } from '@/lib/cookieConsent';
import { useNavigate } from '@tanstack/react-router';

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(shouldShowCookieConsent());
  }, []);

  const handleAccept = () => {
    setCookieConsent('accepted');
    setShow(false);
  };

  const handleReject = () => {
    setCookieConsent('rejected');
    setShow(false);
  };

  const handleViewPolicy = () => {
    navigate({ to: '/privacy-policy' });
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Cookie Consent</CardTitle>
          </div>
          <CardDescription>
            We use cookies to enhance your browsing experience and analyze site traffic.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">
            By clicking "Accept", you consent to our use of cookies. You can learn more about 
            how we use cookies in our{' '}
            <button
              onClick={handleViewPolicy}
              className="underline hover:text-foreground font-medium"
            >
              Privacy Policy
            </button>
            .
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleAccept} className="flex-1">
            Accept
          </Button>
          <Button onClick={handleReject} variant="outline" className="flex-1">
            Reject
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
