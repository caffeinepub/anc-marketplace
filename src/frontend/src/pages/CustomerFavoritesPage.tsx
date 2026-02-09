import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCustomerFavorites, useRemoveFromFavorites } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Trash2, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerFavoritesPage() {
  const { identity } = useInternetIdentity();
  const { data: favorites = [], isLoading, error } = useGetCustomerFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <Shield className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Please log in to access your favorites.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleRemove = async (sellerId: string) => {
    try {
      await removeFromFavorites.mutateAsync(sellerId);
      toast.success('Seller removed from favorites');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove seller');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Favorite Sellers</h1>
          </div>
          <p className="text-muted-foreground">Sellers and stores you love</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="ml-2">
              {error.message || 'Favorites feature is not yet available. This feature is coming soon.'}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Favorite Sellers & Stores</CardTitle>
            <CardDescription>Manage your favorite sellers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">Loading favorites...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You haven't favorited any sellers yet</p>
                <p className="text-sm mt-2">Discover great sellers and add them to your favorites!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((sellerId) => (
                  <div key={sellerId} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">Seller {sellerId}</p>
                      <p className="text-sm text-muted-foreground">Favorite seller details</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(sellerId)}
                      disabled={removeFromFavorites.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
