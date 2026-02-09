import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Shield, Lock, Bell, User } from 'lucide-react';

export default function CustomerSettingsPage() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <Shield className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Please log in to access settings.
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
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Profile management features coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>Manage your privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Your account is secured with Internet Identity passkey authentication.
              </p>
              <Button variant="outline" asChild>
                <Link to="/privacy-policy">
                  <Shield className="h-4 w-4 mr-2" />
                  View Privacy Policy
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notification settings coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>Account Settings</CardTitle>
              </div>
              <CardDescription>General account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Additional account settings coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
