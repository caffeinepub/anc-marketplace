import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function AdminMessagingPanel() {
  const handleComposeMessage = () => {
    toast.info('Message composer coming soon', {
      description: 'The messaging system is currently under development.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Admin Messaging System
            </CardTitle>
            <CardDescription>Internal communication with sellers and users</CardDescription>
          </div>
          <Button onClick={handleComposeMessage}>
            <Plus className="h-4 w-4 mr-2" />
            Compose Message
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Messaging System - Coming Soon</strong>
            <p className="mt-2">
              The admin messaging system will allow you to communicate directly with sellers, customers, and other
              marketplace participants. Features will include:
            </p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Send and receive messages from users</li>
              <li>View conversation threads and message history</li>
              <li>Filter messages by user type (seller, customer, business)</li>
              <li>Search messages by content or sender</li>
              <li>Mark messages as read/unread</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="border rounded-lg p-8 text-center space-y-4">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-lg">No Messages Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              The messaging system is currently under development. Check back soon!
            </p>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Coming Soon
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
