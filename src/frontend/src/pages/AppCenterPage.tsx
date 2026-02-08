import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAllAppIntegrations,
  useAddAppIntegrationRecord,
  useUpdateAppIntegrationRecord,
  useRemoveAppIntegrationRecord,
  useAddWebhookIntegrationRecord,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Trash2, Edit, Link as LinkIcon, Puzzle, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { AppIntegrationRecord, Variant_active_inactive_error_syncing } from '../backend';

export default function AppCenterPage() {
  const { identity } = useInternetIdentity();
  const { data: appIntegrations = [], isLoading } = useGetAllAppIntegrations();
  const addAppIntegration = useAddAppIntegrationRecord();
  const updateAppIntegration = useUpdateAppIntegrationRecord();
  const removeAppIntegration = useRemoveAppIntegrationRecord();
  const addWebhookIntegration = useAddWebhookIntegrationRecord();

  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppIntegrationRecord | null>(null);
  const [appToDelete, setAppToDelete] = useState<string | null>(null);

  const [appForm, setAppForm] = useState({
    id: '',
    name: '',
    description: '',
    webhookUrl: '',
    iconUrl: '',
  });

  const [webhookUrl, setWebhookUrl] = useState('');

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>App Center</CardTitle>
            <CardDescription>Please log in to access the App Center</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The App Center allows you to connect and manage integrations for your business. Please log in to continue.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resetAppForm = () => {
    setAppForm({ id: '', name: '', description: '', webhookUrl: '', iconUrl: '' });
    setEditingApp(null);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddOrUpdateApp = async () => {
    if (!appForm.name || !appForm.description || !appForm.webhookUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validateUrl(appForm.webhookUrl)) {
      toast.error('Please enter a valid webhook URL');
      return;
    }

    try {
      const app: AppIntegrationRecord = {
        id: appForm.id || `APP-${Date.now()}`,
        name: appForm.name,
        description: appForm.description,
        webhookUrl: appForm.webhookUrl,
        iconUrl: appForm.iconUrl || 'https://via.placeholder.com/64',
        status: 'active' as Variant_active_inactive_error_syncing,
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
      };

      if (editingApp) {
        await updateAppIntegration.mutateAsync({ ...app, createdAt: editingApp.createdAt });
        toast.success('App updated successfully');
      } else {
        await addAppIntegration.mutateAsync(app);
        toast.success('App added successfully');
      }
      setAppDialogOpen(false);
      resetAppForm();
    } catch (error) {
      toast.error('Failed to save app');
    }
  };

  const handleEditApp = (app: AppIntegrationRecord) => {
    setEditingApp(app);
    setAppForm({
      id: app.id,
      name: app.name,
      description: app.description,
      webhookUrl: app.webhookUrl,
      iconUrl: app.iconUrl,
    });
    setAppDialogOpen(true);
  };

  const handleDeleteApp = async (appId: string) => {
    try {
      await removeAppIntegration.mutateAsync(appId);
      toast.success('App deleted successfully');
      setDeleteDialogOpen(false);
      setAppToDelete(null);
    } catch (error) {
      toast.error('Failed to delete app');
    }
  };

  const handleAddWebhookIntegration = async () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL');
      return;
    }

    if (!validateUrl(webhookUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      await addWebhookIntegration.mutateAsync(webhookUrl);
      toast.success('Affiliate webhook integration created successfully');
      setWebhookDialogOpen(false);
      setWebhookUrl('');
    } catch (error) {
      toast.error('Failed to create webhook integration');
    }
  };

  const getStatusIcon = (status: Variant_active_inactive_error_syncing) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Variant_active_inactive_error_syncing) => {
    const variants: Record<Variant_active_inactive_error_syncing, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive',
      syncing: 'outline',
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">App Center</h1>
            <p className="text-muted-foreground">
              Connect and manage integrations for your business
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setWebhookDialogOpen(true)} variant="outline">
              <LinkIcon className="h-4 w-4 mr-2" />
              Add Affiliate Link
            </Button>
            <Button onClick={() => setAppDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add App
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading apps...</p>
            </div>
          </div>
        ) : appIntegrations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Puzzle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No apps connected</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first app integration or affiliate link
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setWebhookDialogOpen(true)} variant="outline">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Add Affiliate Link
                </Button>
                <Button onClick={() => setAppDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add App
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appIntegrations.map((app) => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.iconUrl}
                        alt={app.name}
                        className="h-12 w-12 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64';
                        }}
                      />
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusIcon(app.status)}
                          <Badge variant={getStatusBadge(app.status)} className="text-xs">
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
                  <div className="text-xs text-muted-foreground mb-4 break-all">
                    <strong>Webhook:</strong> {app.webhookUrl}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditApp(app)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setAppToDelete(app.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit App Dialog */}
        <Dialog open={appDialogOpen} onOpenChange={(open) => {
          setAppDialogOpen(open);
          if (!open) resetAppForm();
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingApp ? 'Edit App' : 'Add New App'}</DialogTitle>
              <DialogDescription>
                {editingApp ? 'Update the app integration details' : 'Create a new app integration'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">App Name *</Label>
                <Input
                  id="name"
                  value={appForm.name}
                  onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                  placeholder="e.g., Shopify Integration"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={appForm.description}
                  onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                  placeholder="Describe what this integration does"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="webhookUrl">Webhook URL *</Label>
                <Input
                  id="webhookUrl"
                  value={appForm.webhookUrl}
                  onChange={(e) => setAppForm({ ...appForm, webhookUrl: e.target.value })}
                  placeholder="https://example.com/webhook"
                  type="url"
                />
              </div>
              <div>
                <Label htmlFor="iconUrl">Icon URL (optional)</Label>
                <Input
                  id="iconUrl"
                  value={appForm.iconUrl}
                  onChange={(e) => setAppForm({ ...appForm, iconUrl: e.target.value })}
                  placeholder="https://example.com/icon.png"
                  type="url"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAppDialogOpen(false);
                resetAppForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddOrUpdateApp} disabled={addAppIntegration.isPending || updateAppIntegration.isPending}>
                {(addAppIntegration.isPending || updateAppIntegration.isPending) && (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingApp ? 'Update' : 'Add'} App
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Webhook Integration Dialog */}
        <Dialog open={webhookDialogOpen} onOpenChange={(open) => {
          setWebhookDialogOpen(open);
          if (!open) setWebhookUrl('');
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Affiliate Webhook</DialogTitle>
              <DialogDescription>
                Enter an affiliate link URL to automatically create an app integration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhookUrl">Affiliate Webhook URL *</Label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://affiliate.example.com/webhook"
                  type="url"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  The app will be automatically configured based on the URL provided
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setWebhookDialogOpen(false);
                setWebhookUrl('');
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddWebhookIntegration} disabled={addWebhookIntegration.isPending}>
                {addWebhookIntegration.isPending && (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                )}
                Create Integration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this app integration. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAppToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => appToDelete && handleDeleteApp(appToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
