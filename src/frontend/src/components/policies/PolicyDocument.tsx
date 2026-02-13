import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useVerifyPolicySignature } from '../../hooks/useQueries';
import { PolicyMetadata } from '../../lib/policies';

interface PolicyDocumentProps {
  policy: PolicyMetadata;
  contentPath: string;
}

export default function PolicyDocument({ policy, contentPath }: PolicyDocumentProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { identity } = useInternetIdentity();
  const { data: isSigned } = useVerifyPolicySignature(policy);

  useEffect(() => {
    fetch(contentPath)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load policy content');
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [contentPath]);

  const renderMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold mb-4 mt-6">
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-semibold mb-3 mt-5">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mb-2 mt-4">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      return (
        <p key={index} className="mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading policy...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">{policy.displayName}</CardTitle>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>Version {policy.version}</p>
              <p>Last Updated: {policy.lastUpdated}</p>
            </div>
          </CardHeader>
          <CardContent>
            {identity && isSigned === false && (
              <Alert className="mb-6">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="ml-2">
                  You have not signed this policy yet.{' '}
                  <Link to="/customer-settings" className="font-medium underline hover:text-primary">
                    Sign it in Settings
                  </Link>
                </AlertDescription>
              </Alert>
            )}
            <ScrollArea className="h-[600px] pr-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">{renderMarkdown(content)}</div>
            </ScrollArea>
            {identity && (
              <div className="mt-6 pt-6 border-t">
                <Button asChild>
                  <Link to="/customer-settings">
                    <FileText className="h-4 w-4 mr-2" />
                    View & Sign Policies
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
