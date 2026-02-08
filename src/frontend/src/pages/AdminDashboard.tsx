import { useState, useEffect } from 'react';
import {
  useIsCallerAdmin,
  useGetAdminDashboardStats,
  useAddOrUpdateProduct,
  useDeleteProduct,
  useIsStripeConfigured,
  useSetStripeConfiguration,
  useGetPendingOrders,
  useListProducts,
  useAddLesson,
  useUpdateLesson,
  useDeleteLesson,
  useAddVirtualMeeting,
  useUpdateVirtualMeeting,
  useDeleteVirtualMeeting,
  useAddActivity,
  useUpdateActivity,
  useDeleteActivity,
  useListB2BServices,
  useAddB2BService,
  useUpdateB2BService,
  useDeleteB2BService,
  useToggleB2BServiceStatus,
  useListDropshippingPartners,
  useAddDropshippingPartner,
  useUpdateDropshippingPartner,
  useDeleteDropshippingPartner,
  useListAppIntegrations,
  useAddAppIntegration,
  useUpdateAppIntegration,
  useDeleteAppIntegration,
  useToggleAppIntegrationStatus,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Package, ShoppingCart, Users, CreditCard, Settings, Plus, Trash2, Edit, GraduationCap, Briefcase, Truck, Puzzle, CheckCircle, XCircle, Activity as ActivityIcon, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import type { Product, StripeConfiguration, Lesson, VirtualMeeting, Activity, B2BService, DropshippingPartner, AppIntegration, Variant_disconnected_connected } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Variant_disconnected_connected as ConnectionStatus } from '../backend';
import UserRoleManagement from '../components/admin/UserRoleManagement';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: stats } = useGetAdminDashboardStats();
  const { data: stripeConfigured } = useIsStripeConfigured();
  const { data: pendingOrders = [] } = useGetPendingOrders();
  const { data: products = [] } = useListProducts();
  const { data: b2bServices = [] } = useListB2BServices();
  const { data: dropshippingPartners = [] } = useListDropshippingPartners();
  const { data: appIntegrations = [] } = useListAppIntegrations();

  const addProduct = useAddOrUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const setStripeConfig = useSetStripeConfiguration();
  const addLesson = useAddLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const addVirtualMeeting = useAddVirtualMeeting();
  const updateVirtualMeeting = useUpdateVirtualMeeting();
  const deleteVirtualMeeting = useDeleteVirtualMeeting();
  const addActivity = useAddActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  const addB2BService = useAddB2BService();
  const updateB2BService = useUpdateB2BService();
  const deleteB2BService = useDeleteB2BService();
  const toggleB2BServiceStatus = useToggleB2BServiceStatus();
  const addDropshippingPartner = useAddDropshippingPartner();
  const updateDropshippingPartner = useUpdateDropshippingPartner();
  const deleteDropshippingPartner = useDeleteDropshippingPartner();
  const addAppIntegration = useAddAppIntegration();
  const updateAppIntegration = useUpdateAppIntegration();
  const deleteAppIntegration = useDeleteAppIntegration();
  const toggleAppIntegrationStatus = useToggleAppIntegrationStatus();

  const navigate = useNavigate();

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [stripeDialogOpen, setStripeDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [b2bServiceDialogOpen, setB2bServiceDialogOpen] = useState(false);
  const [dropshippingDialogOpen, setDropshippingDialogOpen] = useState(false);
  const [appIntegrationDialogOpen, setAppIntegrationDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<VirtualMeeting | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingB2BService, setEditingB2BService] = useState<B2BService | null>(null);
  const [editingDropshipping, setEditingDropshipping] = useState<DropshippingPartner | null>(null);
  const [editingAppIntegration, setEditingAppIntegration] = useState<AppIntegration | null>(null);

  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    description: '',
    priceCents: '',
    inStock: '',
  });

  const [stripeForm, setStripeForm] = useState({
    secretKey: '',
    allowedCountries: 'US,CA,GB',
  });

  const [lessonForm, setLessonForm] = useState({
    id: '',
    title: '',
    description: '',
    content: '',
    videoLink: '',
  });

  const [meetingForm, setMeetingForm] = useState({
    id: '',
    title: '',
    description: '',
    meetingLink: '',
    scheduledTime: '',
  });

  const [activityForm, setActivityForm] = useState({
    id: '',
    title: '',
    description: '',
    resourceLink: '',
  });

  const [b2bServiceForm, setB2bServiceForm] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    pricingModel: '',
  });

  const [dropshippingForm, setDropshippingForm] = useState({
    id: '',
    name: '',
    apiUrl: '',
    apiKey: '',
    connectionStatus: ConnectionStatus.disconnected,
  });

  const [appIntegrationForm, setAppIntegrationForm] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    apiCredentials: '',
  });

  // Admin access check - redirect if not admin
  useEffect(() => {
    if (!isAdminLoading && isAdmin === false) {
      toast.error('Access Denied', {
        description: 'You do not have permission to access the Admin Dashboard.',
        duration: 4000,
      });
      navigate({ to: '/' });
    }
  }, [isAdmin, isAdminLoading, navigate]);

  useEffect(() => {
    if (isAdmin && stripeConfigured === false) {
      setStripeDialogOpen(true);
    }
  }, [isAdmin, stripeConfigured]);

  // Show loading state while checking admin status
  if (isAdminLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (isAdmin === false) {
    return (
      <div className="container py-12">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You do not have permission to access the Admin Dashboard. This area is restricted to administrators only.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const resetProductForm = () => {
    setProductForm({ id: '', name: '', description: '', priceCents: '', inStock: '' });
    setEditingProduct(null);
  };

  const resetLessonForm = () => {
    setLessonForm({ id: '', title: '', description: '', content: '', videoLink: '' });
    setEditingLesson(null);
  };

  const resetMeetingForm = () => {
    setMeetingForm({ id: '', title: '', description: '', meetingLink: '', scheduledTime: '' });
    setEditingMeeting(null);
  };

  const resetActivityForm = () => {
    setActivityForm({ id: '', title: '', description: '', resourceLink: '' });
    setEditingActivity(null);
  };

  const resetB2BServiceForm = () => {
    setB2bServiceForm({ id: '', name: '', category: '', description: '', pricingModel: '' });
    setEditingB2BService(null);
  };

  const resetDropshippingForm = () => {
    setDropshippingForm({ id: '', name: '', apiUrl: '', apiKey: '', connectionStatus: ConnectionStatus.disconnected });
    setEditingDropshipping(null);
  };

  const resetAppIntegrationForm = () => {
    setAppIntegrationForm({ id: '', name: '', category: '', description: '', apiCredentials: '' });
    setEditingAppIntegration(null);
  };

  const handleAddOrUpdateProduct = async () => {
    if (!productForm.name || !productForm.priceCents || !productForm.inStock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const product: Product = {
        id: productForm.id || `PROD-${Date.now()}`,
        name: productForm.name,
        description: productForm.description,
        priceCents: BigInt(Math.round(parseFloat(productForm.priceCents) * 100)),
        inStock: BigInt(productForm.inStock),
        image: undefined,
      };

      await addProduct.mutateAsync(product);
      toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
      setProductDialogOpen(false);
      resetProductForm();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      priceCents: (Number(product.priceCents) / 100).toString(),
      inStock: product.inStock.toString(),
    });
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleSetStripeConfig = async () => {
    if (!stripeForm.secretKey || !stripeForm.allowedCountries) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const config: StripeConfiguration = {
        secretKey: stripeForm.secretKey,
        allowedCountries: stripeForm.allowedCountries.split(',').map((c) => c.trim()),
      };

      await setStripeConfig.mutateAsync(config);
      toast.success('Stripe configured successfully');
      setStripeDialogOpen(false);
    } catch (error) {
      toast.error('Failed to configure Stripe');
    }
  };

  const handleAddOrUpdateLesson = async () => {
    if (!lessonForm.title || !lessonForm.description || !lessonForm.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const lesson: Lesson = {
        id: lessonForm.id || `LESSON-${Date.now()}`,
        title: lessonForm.title,
        description: lessonForm.description,
        content: lessonForm.content,
        videoLink: lessonForm.videoLink || undefined,
      };

      if (editingLesson) {
        await updateLesson.mutateAsync(lesson);
        toast.success('Lesson updated successfully');
      } else {
        await addLesson.mutateAsync(lesson);
        toast.success('Lesson added successfully');
      }
      setLessonDialogOpen(false);
      resetLessonForm();
    } catch (error) {
      toast.error('Failed to save lesson');
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      videoLink: lesson.videoLink || '',
    });
    setLessonDialogOpen(true);
  };

  const handleAddOrUpdateMeeting = async () => {
    if (!meetingForm.title || !meetingForm.description || !meetingForm.meetingLink || !meetingForm.scheduledTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const meeting: VirtualMeeting = {
        id: meetingForm.id || `MEETING-${Date.now()}`,
        title: meetingForm.title,
        description: meetingForm.description,
        meetingLink: meetingForm.meetingLink,
        scheduledTime: BigInt(new Date(meetingForm.scheduledTime).getTime() * 1000000),
      };

      if (editingMeeting) {
        await updateVirtualMeeting.mutateAsync(meeting);
        toast.success('Virtual meeting updated successfully');
      } else {
        await addVirtualMeeting.mutateAsync(meeting);
        toast.success('Virtual meeting added successfully');
      }
      setMeetingDialogOpen(false);
      resetMeetingForm();
    } catch (error) {
      toast.error('Failed to save virtual meeting');
    }
  };

  const handleEditMeeting = (meeting: VirtualMeeting) => {
    setEditingMeeting(meeting);
    const date = new Date(Number(meeting.scheduledTime) / 1000000);
    setMeetingForm({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      meetingLink: meeting.meetingLink,
      scheduledTime: date.toISOString().slice(0, 16),
    });
    setMeetingDialogOpen(true);
  };

  const handleAddOrUpdateActivity = async () => {
    if (!activityForm.title || !activityForm.description || !activityForm.resourceLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const activity: Activity = {
        id: activityForm.id || `ACTIVITY-${Date.now()}`,
        title: activityForm.title,
        description: activityForm.description,
        resourceLink: activityForm.resourceLink,
        isCompleted: false,
      };

      if (editingActivity) {
        await updateActivity.mutateAsync(activity);
        toast.success('Activity updated successfully');
      } else {
        await addActivity.mutateAsync(activity);
        toast.success('Activity added successfully');
      }
      setActivityDialogOpen(false);
      resetActivityForm();
    } catch (error) {
      toast.error('Failed to save activity');
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setActivityForm({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      resourceLink: activity.resourceLink,
    });
    setActivityDialogOpen(true);
  };

  const handleAddOrUpdateB2BService = async () => {
    if (!b2bServiceForm.name || !b2bServiceForm.category || !b2bServiceForm.description || !b2bServiceForm.pricingModel) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const service: B2BService = {
        id: b2bServiceForm.id || `SERVICE-${Date.now()}`,
        name: b2bServiceForm.name,
        category: b2bServiceForm.category,
        description: b2bServiceForm.description,
        pricingModel: b2bServiceForm.pricingModel,
        isActive: true,
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
      };

      if (editingB2BService) {
        await updateB2BService.mutateAsync({ ...service, createdAt: editingB2BService.createdAt });
        toast.success('B2B service updated successfully');
      } else {
        await addB2BService.mutateAsync(service);
        toast.success('B2B service added successfully');
      }
      setB2bServiceDialogOpen(false);
      resetB2BServiceForm();
    } catch (error) {
      toast.error('Failed to save B2B service');
    }
  };

  const handleEditB2BService = (service: B2BService) => {
    setEditingB2BService(service);
    setB2bServiceForm({
      id: service.id,
      name: service.name,
      category: service.category,
      description: service.description,
      pricingModel: service.pricingModel,
    });
    setB2bServiceDialogOpen(true);
  };

  const handleToggleB2BService = async (serviceId: string, isActive: boolean) => {
    try {
      await toggleB2BServiceStatus.mutateAsync({ serviceId, isActive: !isActive });
      toast.success(`Service ${!isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  const handleAddOrUpdateDropshipping = async () => {
    if (!dropshippingForm.name || !dropshippingForm.apiUrl || !dropshippingForm.apiKey) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const partner: DropshippingPartner = {
        id: dropshippingForm.id || `DROPSHIP-${Date.now()}`,
        name: dropshippingForm.name,
        apiUrl: dropshippingForm.apiUrl,
        apiKey: dropshippingForm.apiKey,
        connectionStatus: dropshippingForm.connectionStatus,
        healthMetrics: {
          successfulSyncs: BigInt(0),
          failedSyncs: BigInt(0),
          lastSyncTime: undefined,
          uptimePercent: 100.0,
        },
      };

      if (editingDropshipping) {
        await updateDropshippingPartner.mutateAsync({ ...partner, healthMetrics: editingDropshipping.healthMetrics });
        toast.success('Dropshipping partner updated successfully');
      } else {
        await addDropshippingPartner.mutateAsync(partner);
        toast.success('Dropshipping partner connected successfully');
      }
      setDropshippingDialogOpen(false);
      resetDropshippingForm();
    } catch (error) {
      toast.error('Failed to save dropshipping partner');
    }
  };

  const handleEditDropshipping = (partner: DropshippingPartner) => {
    setEditingDropshipping(partner);
    setDropshippingForm({
      id: partner.id,
      name: partner.name,
      apiUrl: partner.apiUrl,
      apiKey: partner.apiKey,
      connectionStatus: partner.connectionStatus,
    });
    setDropshippingDialogOpen(true);
  };

  const handleAddOrUpdateAppIntegration = async () => {
    if (!appIntegrationForm.name || !appIntegrationForm.category || !appIntegrationForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const integration: AppIntegration = {
        id: appIntegrationForm.id || `APP-${Date.now()}`,
        name: appIntegrationForm.name,
        category: appIntegrationForm.category,
        description: appIntegrationForm.description,
        apiCredentials: appIntegrationForm.apiCredentials,
        isActive: true,
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
      };

      if (editingAppIntegration) {
        await updateAppIntegration.mutateAsync({ ...integration, createdAt: editingAppIntegration.createdAt });
        toast.success('App integration updated successfully');
      } else {
        await addAppIntegration.mutateAsync(integration);
        toast.success('App integration added successfully');
      }
      setAppIntegrationDialogOpen(false);
      resetAppIntegrationForm();
    } catch (error) {
      toast.error('Failed to save app integration');
    }
  };

  const handleEditAppIntegration = (integration: AppIntegration) => {
    setEditingAppIntegration(integration);
    setAppIntegrationForm({
      id: integration.id,
      name: integration.name,
      category: integration.category,
      description: integration.description,
      apiCredentials: integration.apiCredentials,
    });
    setAppIntegrationDialogOpen(true);
  };

  const handleToggleAppIntegration = async (integrationId: string, isActive: boolean) => {
    try {
      await toggleAppIntegrationStatus.mutateAsync({ integrationId, isActive: !isActive });
      toast.success(`Integration ${!isActive ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update integration status');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      switch (itemToDelete.type) {
        case 'product':
          await deleteProduct.mutateAsync(itemToDelete.id);
          break;
        case 'lesson':
          await deleteLesson.mutateAsync(itemToDelete.id);
          break;
        case 'meeting':
          await deleteVirtualMeeting.mutateAsync(itemToDelete.id);
          break;
        case 'activity':
          await deleteActivity.mutateAsync(itemToDelete.id);
          break;
        case 'b2bService':
          await deleteB2BService.mutateAsync(itemToDelete.id);
          break;
        case 'dropshipping':
          await deleteDropshippingPartner.mutateAsync(itemToDelete.id);
          break;
        case 'appIntegration':
          await deleteAppIntegration.mutateAsync(itemToDelete.id);
          break;
      }
      toast.success('Item deleted successfully');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const statCards = [
    { label: 'Products', value: stats?.productCount.toString() || '0', icon: Package },
    { label: 'Orders', value: stats?.orderCount.toString() || '0', icon: ShoppingCart },
    { label: 'Users', value: stats?.userCount.toString() || '0', icon: Users },
    { label: 'B2B Services', value: stats?.b2bServiceCount.toString() || '0', icon: Briefcase },
    { label: 'Dropshipping', value: stats?.dropshippingPartnerCount.toString() || '0', icon: Truck },
    { label: 'Integrations', value: stats?.appIntegrationCount.toString() || '0', icon: Puzzle },
  ];

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Badge variant="default" className="gap-1">
            <Shield className="h-3 w-3" />
            Admin Access
          </Badge>
        </div>
        <p className="text-muted-foreground">Comprehensive platform management and monitoring</p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="startup">Startup</TabsTrigger>
          <TabsTrigger value="b2b">B2B</TabsTrigger>
          <TabsTrigger value="dropshipping">Dropshipping</TabsTrigger>
          <TabsTrigger value="apps">Apps</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserRoleManagement />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Add, update, and manage e-commerce products</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    resetProductForm();
                    setProductDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No products yet. Add your first product to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="font-semibold">${(Number(product.priceCents) / 100).toFixed(2)}</span>
                          <span className="text-muted-foreground">Stock: {product.inStock.toString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setItemToDelete({ type: 'product', id: product.id });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="startup" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lessons Management</CardTitle>
                    <CardDescription>Manage curriculum lessons and content</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      resetLessonForm();
                      setLessonDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Virtual Meetings</CardTitle>
                    <CardDescription>Schedule and manage virtual workshops</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      resetMeetingForm();
                      setMeetingDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Meeting
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Activities</CardTitle>
                    <CardDescription>Manage startup activities and tasks</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      resetActivityForm();
                      setActivityDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="b2b" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>B2B Services Management</CardTitle>
                  <CardDescription>Add and categorize service offerings</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    resetB2BServiceForm();
                    setB2bServiceDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {b2bServices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No B2B services yet. Add your first service to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {b2bServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant="secondary">{service.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                        <p className="text-sm">Pricing: {service.pricingModel}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={service.isActive} onCheckedChange={() => handleToggleB2BService(service.id, service.isActive)} />
                        <Button variant="outline" size="sm" onClick={() => handleEditB2BService(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setItemToDelete({ type: 'b2bService', id: service.id });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dropshipping" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dropshipping Partners</CardTitle>
                  <CardDescription>Connect and manage third-party dropshipping companies</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    resetDropshippingForm();
                    setDropshippingDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dropshippingPartners.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No dropshipping partners yet. Connect your first partner to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dropshippingPartners.map((partner) => (
                    <div key={partner.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{partner.name}</h4>
                            <Badge variant={partner.connectionStatus === ConnectionStatus.connected ? 'default' : 'secondary'}>
                              {partner.connectionStatus === ConnectionStatus.connected ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Connected
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Disconnected
                                </>
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{partner.apiUrl}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditDropshipping(partner)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setItemToDelete({ type: 'dropshipping', id: partner.id });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Successful Syncs</p>
                          <p className="font-semibold">{partner.healthMetrics.successfulSyncs.toString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Failed Syncs</p>
                          <p className="font-semibold">{partner.healthMetrics.failedSyncs.toString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Uptime</p>
                          <p className="font-semibold">{partner.healthMetrics.uptimePercent.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Sync</p>
                          <p className="font-semibold">
                            {partner.healthMetrics.lastSyncTime
                              ? new Date(Number(partner.healthMetrics.lastSyncTime) / 1000000).toLocaleDateString()
                              : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apps" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>App Integrations</CardTitle>
                  <CardDescription>Manage third-party apps and plugins</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    resetAppIntegrationForm();
                    setAppIntegrationDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {appIntegrations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Puzzle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No app integrations yet. Add your first integration to extend functionality.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{integration.name}</h4>
                          <Badge variant="secondary">{integration.category}</Badge>
                          <Badge variant={integration.isActive ? 'default' : 'outline'}>
                            {integration.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={integration.isActive} onCheckedChange={() => handleToggleAppIntegration(integration.id, integration.isActive)} />
                        <Button variant="outline" size="sm" onClick={() => handleEditAppIntegration(integration)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setItemToDelete({ type: 'appIntegration', id: integration.id });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>Review and process customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order.orderId} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{order.orderId}</h4>
                        <p className="text-sm text-muted-foreground">{order.products.length} items</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">${(Number(order.totalAmount) / 100).toFixed(2)}</span>
                        <Badge>Pending</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Configuration</CardTitle>
              <CardDescription>Configure payment processing with Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Stripe Status</h4>
                    <p className="text-sm text-muted-foreground">{stripeConfigured ? 'Configured and ready' : 'Not configured'}</p>
                  </div>
                  <Badge variant={stripeConfigured ? 'default' : 'secondary'}>{stripeConfigured ? 'Active' : 'Inactive'}</Badge>
                </div>
                <Button onClick={() => setStripeDialogOpen(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {stripeConfigured ? 'Update Configuration' : 'Configure Stripe'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>Enter the product details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Enter product name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Enter product description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input id="price" type="number" step="0.01" value={productForm.priceCents} onChange={(e) => setProductForm({ ...productForm, priceCents: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input id="stock" type="number" value={productForm.inStock} onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value })} placeholder="0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateProduct} disabled={addProduct.isPending}>
              {addProduct.isPending ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
            <DialogDescription>Enter the lesson details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lessonTitle">Title *</Label>
              <Input id="lessonTitle" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Enter lesson title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessonDescription">Description *</Label>
              <Textarea id="lessonDescription" value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} placeholder="Enter lesson description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessonContent">Content *</Label>
              <Textarea id="lessonContent" value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} placeholder="Enter lesson content" rows={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoLink">Video Link (optional)</Label>
              <Input id="videoLink" value={lessonForm.videoLink} onChange={(e) => setLessonForm({ ...lessonForm, videoLink: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateLesson} disabled={addLesson.isPending || updateLesson.isPending}>
              {addLesson.isPending || updateLesson.isPending ? 'Saving...' : editingLesson ? 'Update Lesson' : 'Add Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Virtual Meeting Dialog */}
      <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMeeting ? 'Edit Virtual Meeting' : 'Add New Virtual Meeting'}</DialogTitle>
            <DialogDescription>Enter the meeting details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meetingTitle">Title *</Label>
              <Input id="meetingTitle" value={meetingForm.title} onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })} placeholder="Enter meeting title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingDescription">Description *</Label>
              <Textarea id="meetingDescription" value={meetingForm.description} onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })} placeholder="Enter meeting description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link *</Label>
              <Input id="meetingLink" value={meetingForm.meetingLink} onChange={(e) => setMeetingForm({ ...meetingForm, meetingLink: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Scheduled Time *</Label>
              <Input id="scheduledTime" type="datetime-local" value={meetingForm.scheduledTime} onChange={(e) => setMeetingForm({ ...meetingForm, scheduledTime: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateMeeting} disabled={addVirtualMeeting.isPending || updateVirtualMeeting.isPending}>
              {addVirtualMeeting.isPending || updateVirtualMeeting.isPending ? 'Saving...' : editingMeeting ? 'Update Meeting' : 'Add Meeting'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
            <DialogDescription>Enter the activity details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="activityTitle">Title *</Label>
              <Input id="activityTitle" value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} placeholder="Enter activity title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityDescription">Description *</Label>
              <Textarea id="activityDescription" value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} placeholder="Enter activity description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resourceLink">Resource Link *</Label>
              <Input id="resourceLink" value={activityForm.resourceLink} onChange={(e) => setActivityForm({ ...activityForm, resourceLink: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateActivity} disabled={addActivity.isPending || updateActivity.isPending}>
              {addActivity.isPending || updateActivity.isPending ? 'Saving...' : editingActivity ? 'Update Activity' : 'Add Activity'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* B2B Service Dialog */}
      <Dialog open={b2bServiceDialogOpen} onOpenChange={setB2bServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingB2BService ? 'Edit B2B Service' : 'Add New B2B Service'}</DialogTitle>
            <DialogDescription>Enter the service details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input id="serviceName" value={b2bServiceForm.name} onChange={(e) => setB2bServiceForm({ ...b2bServiceForm, name: e.target.value })} placeholder="Enter service name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceCategory">Category *</Label>
              <Input id="serviceCategory" value={b2bServiceForm.category} onChange={(e) => setB2bServiceForm({ ...b2bServiceForm, category: e.target.value })} placeholder="e.g., Marketing, Development, Consulting" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Description *</Label>
              <Textarea id="serviceDescription" value={b2bServiceForm.description} onChange={(e) => setB2bServiceForm({ ...b2bServiceForm, description: e.target.value })} placeholder="Enter service description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricingModel">Pricing Model *</Label>
              <Input id="pricingModel" value={b2bServiceForm.pricingModel} onChange={(e) => setB2bServiceForm({ ...b2bServiceForm, pricingModel: e.target.value })} placeholder="e.g., Hourly, Fixed, Subscription" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setB2bServiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateB2BService} disabled={addB2BService.isPending || updateB2BService.isPending}>
              {addB2BService.isPending || updateB2BService.isPending ? 'Saving...' : editingB2BService ? 'Update Service' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dropshipping Partner Dialog */}
      <Dialog open={dropshippingDialogOpen} onOpenChange={setDropshippingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDropshipping ? 'Edit Dropshipping Partner' : 'Add Dropshipping Partner'}</DialogTitle>
            <DialogDescription>Enter the partner connection details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="partnerName">Partner Name *</Label>
              <Input id="partnerName" value={dropshippingForm.name} onChange={(e) => setDropshippingForm({ ...dropshippingForm, name: e.target.value })} placeholder="Enter partner name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API URL *</Label>
              <Input id="apiUrl" value={dropshippingForm.apiUrl} onChange={(e) => setDropshippingForm({ ...dropshippingForm, apiUrl: e.target.value })} placeholder="https://api.partner.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key *</Label>
              <Input id="apiKey" type="password" value={dropshippingForm.apiKey} onChange={(e) => setDropshippingForm({ ...dropshippingForm, apiKey: e.target.value })} placeholder="Enter API key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="connectionStatus">Connection Status</Label>
              <Select value={dropshippingForm.connectionStatus} onValueChange={(value: Variant_disconnected_connected) => setDropshippingForm({ ...dropshippingForm, connectionStatus: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ConnectionStatus.connected}>Connected</SelectItem>
                  <SelectItem value={ConnectionStatus.disconnected}>Disconnected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDropshippingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateDropshipping} disabled={addDropshippingPartner.isPending || updateDropshippingPartner.isPending}>
              {addDropshippingPartner.isPending || updateDropshippingPartner.isPending ? 'Saving...' : editingDropshipping ? 'Update Partner' : 'Connect Partner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* App Integration Dialog */}
      <Dialog open={appIntegrationDialogOpen} onOpenChange={setAppIntegrationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAppIntegration ? 'Edit App Integration' : 'Add App Integration'}</DialogTitle>
            <DialogDescription>Enter the integration details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name *</Label>
              <Input id="appName" value={appIntegrationForm.name} onChange={(e) => setAppIntegrationForm({ ...appIntegrationForm, name: e.target.value })} placeholder="Enter app name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appCategory">Category *</Label>
              <Input id="appCategory" value={appIntegrationForm.category} onChange={(e) => setAppIntegrationForm({ ...appIntegrationForm, category: e.target.value })} placeholder="e.g., Marketing, Analytics, CRM" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appDescription">Description *</Label>
              <Textarea id="appDescription" value={appIntegrationForm.description} onChange={(e) => setAppIntegrationForm({ ...appIntegrationForm, description: e.target.value })} placeholder="Enter app description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiCredentials">API Credentials</Label>
              <Textarea id="apiCredentials" value={appIntegrationForm.apiCredentials} onChange={(e) => setAppIntegrationForm({ ...appIntegrationForm, apiCredentials: e.target.value })} placeholder="Enter API credentials or configuration" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppIntegrationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateAppIntegration} disabled={addAppIntegration.isPending || updateAppIntegration.isPending}>
              {addAppIntegration.isPending || updateAppIntegration.isPending ? 'Saving...' : editingAppIntegration ? 'Update Integration' : 'Add Integration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stripe Configuration Dialog */}
      <Dialog open={stripeDialogOpen} onOpenChange={setStripeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Stripe</DialogTitle>
            <DialogDescription>Enter your Stripe API credentials to enable payment processing</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input id="secretKey" type="password" value={stripeForm.secretKey} onChange={(e) => setStripeForm({ ...stripeForm, secretKey: e.target.value })} placeholder="sk_test_..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
              <Input id="countries" value={stripeForm.allowedCountries} onChange={(e) => setStripeForm({ ...stripeForm, allowedCountries: e.target.value })} placeholder="US,CA,GB" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStripeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetStripeConfig} disabled={setStripeConfig.isPending}>
              {setStripeConfig.isPending ? 'Saving...' : 'Save Configuration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the item from the system.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
