import { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  useGetAssistantKnowledgeBase,
  useAddKnowledgeEntry,
  useUpdateKnowledgeEntry,
  useDeleteKnowledgeEntry,
} from '../../../hooks/useQueries';
import type { AssistantKnowledgeEntry } from '../../../backend';

export default function AssistantKnowledgeBaseAdmin() {
  const { data: knowledgeBase = [], isLoading } = useGetAssistantKnowledgeBase();
  const addEntry = useAddKnowledgeEntry();
  const updateEntry = useUpdateKnowledgeEntry();
  const removeEntry = useDeleteKnowledgeEntry();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AssistantKnowledgeEntry | null>(null);
  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: '',
    isActive: true,
  });

  const resetForm = () => {
    setForm({ question: '', answer: '', category: '', isActive: true });
    setEditingEntry(null);
  };

  const handleEdit = (entry: AssistantKnowledgeEntry) => {
    setEditingEntry(entry);
    setForm({
      question: entry.question,
      answer: entry.answer,
      category: entry.category,
      isActive: entry.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim() || !form.category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const entry: AssistantKnowledgeEntry = {
        id: editingEntry?.id || `KB-${Date.now()}`,
        question: form.question.trim(),
        answer: form.answer.trim(),
        category: form.category.trim(),
        isActive: form.isActive,
        lastUpdated: BigInt(Date.now() * 1000000),
        usageCount: editingEntry?.usageCount || BigInt(0),
      };

      if (editingEntry) {
        await updateEntry.mutateAsync(entry);
        toast.success('Knowledge entry updated successfully');
      } else {
        await addEntry.mutateAsync(entry);
        toast.success('Knowledge entry added successfully');
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save knowledge entry');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeEntry.mutateAsync(id);
      toast.success('Knowledge entry removed successfully');
    } catch (error) {
      toast.error('Failed to remove knowledge entry');
    }
  };

  const handleToggleActive = async (entry: AssistantKnowledgeEntry) => {
    try {
      await updateEntry.mutateAsync({
        ...entry,
        isActive: !entry.isActive,
        lastUpdated: BigInt(Date.now() * 1000000),
      });
      toast.success(`Entry ${!entry.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update entry status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Knowledge Base</h3>
          <p className="text-sm text-muted-foreground">
            Manage the assistant's knowledge entries
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {knowledgeBase.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No knowledge entries yet. Add your first entry to get started.</p>
              </CardContent>
            </Card>
          ) : (
            knowledgeBase.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{entry.category}</Badge>
                        {entry.isActive ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Used {entry.usageCount.toString()} times
                        </span>
                      </div>
                      <CardTitle className="text-base">{entry.question}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="whitespace-pre-wrap">
                    {entry.answer}
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2">
                    <Switch
                      checked={entry.isActive}
                      onCheckedChange={() => handleToggleActive(entry)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}
            </DialogTitle>
            <DialogDescription>
              {editingEntry
                ? 'Update the knowledge entry details below.'
                : 'Add a new knowledge entry to help the assistant answer questions.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g., General, Startup Program, Ecommerce"
              />
            </div>
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="What question should this answer?"
              />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                placeholder="Provide a detailed answer..."
                rows={6}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingEntry ? 'Update' : 'Add'} Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
