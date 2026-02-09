import React from 'react';
import { Link } from '@tanstack/react-router';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RouterErrorScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 shadow-lg text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Page Error</h1>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading this page. Please try navigating back to the home page.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
