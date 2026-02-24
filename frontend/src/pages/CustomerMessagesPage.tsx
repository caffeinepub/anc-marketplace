import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Shield, Inbox } from 'lucide-react';

export default function CustomerMessagesPage() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <Shield className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Please log in to access your messages.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Messages</h1>
          </div>
          <p className="text-muted-foreground">Communicate with sellers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>Messages from sellers and support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">Messaging System Coming Soon</p>
              <p className="text-sm">
                Customer-to-seller messaging will be available once the marketplace messaging system is implemented.
              </p>
              <p className="text-sm mt-2">
                This will be an inbox-style messaging system (no real-time chat).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
