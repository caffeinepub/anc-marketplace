import { useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';

export default function AppLaunchPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/app-launch' });
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const targetUrl = search.url;
  const appTitle = search.title || 'Partner App';

  const handleOpenInNewTab = () => {
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBack = () => {
    navigate({ to: '/app-center' });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to access partner apps</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You must be logged in to launch partner applications. Please log in and try again.
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Button onClick={handleBack} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to App Center
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!targetUrl) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Invalid App Launch</CardTitle>
            <CardDescription>No target URL provided</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>
                The app launch URL is missing. Please return to the App Center and try again.
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Button onClick={handleBack} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to App Center
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{appTitle}</h1>
        </div>
        <Button onClick={handleOpenInNewTab} variant="outline" size="sm" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Open in New Tab
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <iframe
          src={targetUrl}
          title={appTitle}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}
