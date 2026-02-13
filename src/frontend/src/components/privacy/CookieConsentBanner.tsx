import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { getCookieConsent, setCookieConsent } from '../../lib/cookieConsent';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent(true);
    setShowBanner(false);
  };

  const handleReject = () => {
    setCookieConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-lg border-2">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-lg">Cookie Consent</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept", you
                consent to our use of cookies.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleAccept} size="sm" className="flex-1">
                  Accept
                </Button>
                <Button onClick={handleReject} variant="outline" size="sm" className="flex-1">
                  Reject
                </Button>
              </div>
              <Link to="/privacy-policy" className="text-xs text-primary hover:underline block">
                Learn more in our Privacy Policy
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
