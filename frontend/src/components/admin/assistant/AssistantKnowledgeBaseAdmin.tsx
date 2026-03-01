import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, BookOpen, RefreshCw, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useGetKnowledgeBase, useUpdateKnowledgeEntry } from '../../../hooks/useQueries';

export default function AssistantKnowledgeBaseAdmin() {
  const { data: entries = [], isLoading, error, refetch } = useGetKnowledgeBase();
  const updateEntry = useUpdateKnowledgeEntry();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter(
    (e) =>
      e.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string, currentAnswer: string) => {
    setEditingId(id);
    setEditAnswer(currentAnswer);
  };

  const handleSave = async (id: string) => {
    try {
      await updateEntry.mutateAsync({ id, newAnswer: editAnswer });
      toast.success('Knowledge entry updated');
      setEditingId(null);
    } catch {
      toast.error('Failed to update entry');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditAnswer('');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load knowledge base.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Assistant Knowledge Base
            </CardTitle>
            <CardDescription>Manage Q&amp;A entries used by the AI assistant</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {entries.length === 0 ? 'No knowledge base entries yet.' : 'No entries match your search.'}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{entry.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{entry.category}</Badge>
                      {entry.isBusinessOps && (
                        <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">Business Ops</Badge>
                      )}
                      {entry.isActive ? (
                        <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">Used {Number(entry.usageCount)}x</span>
                    </div>
                  </div>
                  {editingId !== entry.id && (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(entry.id, entry.answer)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                {editingId === entry.id ? (
                  <div className="space-y-2">
                    <Label className="text-xs">Answer</Label>
                    <Textarea
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      rows={3}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(entry.id)} disabled={updateEntry.isPending}>
                        {updateEntry.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-3.5 w-3.5 mr-1" />Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{entry.answer}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
