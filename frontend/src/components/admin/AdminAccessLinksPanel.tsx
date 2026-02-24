import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink, Link as LinkIcon, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAccessLinksPanel() {
  const appLink = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://your-app.com/';
  const adminLink = typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'https://your-app.com/admin';
  const ownerEmail = 'ancelectronicsnservices@gmail.com';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LinkIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Admin Access Links</CardTitle>
            <CardDescription>Quick access URLs and contact information for administrative purposes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* App Link */}
        <div className="space-y-2">
          <Label htmlFor="app-link" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            App Link
          </Label>
          <div className="flex gap-2">
            <Input
              id="app-link"
              value={appLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(appLink, 'App Link')}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => openInNewTab(appLink)}
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Main application URL for customers and users
          </p>
        </div>

        {/* Admin Sign-In Link */}
        <div className="space-y-2">
          <Label htmlFor="admin-link" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Sign-In Link
          </Label>
          <div className="flex gap-2">
            <Input
              id="admin-link"
              value={adminLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(adminLink, 'Admin Link')}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => openInNewTab(adminLink)}
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Direct link to admin center (requires authentication)
          </p>
        </div>

        {/* Owner Email */}
        <div className="space-y-2">
          <Label htmlFor="owner-email" className="flex items-center gap-2">
            Owner Email
          </Label>
          <div className="flex gap-2">
            <Input
              id="owner-email"
              value={ownerEmail}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(ownerEmail, 'Owner Email')}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Primary contact email for administrative matters
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 rounded-lg p-4 mt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Share these links securely. The admin link should only be shared with authorized administrators who have been granted access through Internet Identity.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
