import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllAppIntegrations, useAddAppIntegrationRecord, useUpdateAppIntegrationRecord, useRemoveAppIntegrationRecord, useAddWebhookIntegrationRecord } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Puzzle, Plus, Edit, Trash2, ExternalLink, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { AppIntegrationRecord, Variant_active_inactive_error_syncing } from '../types';

export default function AppCenterPage() {
  const { identity } = useInternetIdentity();
  const { data: apps = [], isLoading } = useGetAllAppIntegrations();
  const addApp = useAddAppIntegrationRecord();
  const updateApp = useUpdateAppIntegrationRecord();
  const removeApp = useRemoveAppIntegrationRecord();
  const addWebhook = useAddWebhookIntegrationRecord();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppIntegrationRecord | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    webhookUrl: '',
    iconUrl: '',
  });

  const isAuthenticated = !!identity;

  const handleOpenDialog = (app?: AppIntegrationRecord) => {
    if (app) {
      setEditingApp(app);
      setFormData({
        name: app.name,
        description: app.description,
        webhookUrl: app.webhookUrl,
        iconUrl: app.iconUrl,
      });
    } else {
      setEditingApp(null);
      setFormData({ name: '', description: '', webhookUrl: '', iconUrl: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.webhookUrl.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingApp) {
        await updateApp.mutateAsync({
          ...editingApp,
          name: formData.name.trim(),
          description: formData.description.trim(),
          webhookUrl: formData.webhookUrl.trim(),
          iconUrl: formData.iconUrl.trim(),
          updatedAt: BigInt(Date.now() * 1000000),
        });
        toast.success('App integration updated successfully');
      } else {
        const newApp: AppIntegrationRecord = {
          id: `app-${Date.now()}`,
          name: formData.name.trim(),
          description: formData.description.trim(),
          webhookUrl: formData.webhookUrl.trim(),
          iconUrl: formData.iconUrl.trim(),
          status: { __kind__: 'active' },
          createdAt: BigInt(Date.now() * 1000000),
          updatedAt: BigInt(Date.now() * 1000000),
        };
        await addApp.mutateAsync(newApp);
        toast.success('App integration added successfully');
      }
      setDialogOpen(false);
      setFormData({ name: '', description: '', webhookUrl: '', iconUrl: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save app integration');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this app integration?')) return;

    try {
      await removeApp.mutateAsync(id);
      toast.success('App integration removed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove app integration');
    }
  };

  const handleConvertWebhook = async (webhookUrl: string) => {
    try {
      await addWebhook.mutateAsync(webhookUrl);
      toast.success('Webhook converted to app integration successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert webhook');
    }
  };

  const getStatusBadge = (status: Variant_active_inactive_error_syncing) => {
    switch (status.__kind__) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'syncing':
        return <Badge variant="outline">Syncing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>Please log in to access the App Center.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">App Center</h1>
          <p className="text-muted-foreground">Manage your app integrations and webhooks</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Webhook Conversion:</strong> Paste an affiliate webhook URL in the form to automatically create an app integration.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Puzzle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No App Integrations</h3>
            <p className="text-muted-foreground mb-4">
              Add your first app integration to get started
            </p>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Integration
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {app.iconUrl ? (
                      <img src={app.iconUrl} alt={app.name} className="h-10 w-10 rounded-lg" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Puzzle className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{app.description || 'No description provided'}</CardDescription>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(app)} className="flex-1 gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open(app.webhookUrl, '_blank')} className="flex-1 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(app.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingApp ? 'Edit App Integration' : 'Add App Integration'}</DialogTitle>
            <DialogDescription>
              {editingApp ? 'Update the app integration details' : 'Add a new app integration or paste a webhook URL'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="App name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL *</Label>
              <Input
                id="webhookUrl"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iconUrl">Icon URL</Label>
              <Input
                id="iconUrl"
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addApp.isPending || updateApp.isPending}>
                {addApp.isPending || updateApp.isPending ? 'Saving...' : editingApp ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
