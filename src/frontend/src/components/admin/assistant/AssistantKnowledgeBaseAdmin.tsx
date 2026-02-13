import React, { useState } from 'react';
import {
  useGetKnowledgeBase,
  useAddKnowledgeEntry,
  useUpdateKnowledgeEntry,
  type UnansweredQuestion,
} from '../../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, BookOpen, Plus, Edit, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { AssistantKnowledgeEntry } from '../../../backend';
import { toast } from 'sonner';

export default function AssistantKnowledgeBaseAdmin() {
  const { data: knowledgeBase, isLoading, error } = useGetKnowledgeBase();
  const addEntry = useAddKnowledgeEntry();
  const updateEntry = useUpdateKnowledgeEntry();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AssistantKnowledgeEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newEntry, setNewEntry] = useState({
    question: '',
    answer: '',
    category: '',
  });

  const handleAddEntry = async () => {
    if (!newEntry.question.trim() || !newEntry.answer.trim() || !newEntry.category.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const isBusinessOps = newEntry.category.toLowerCase().includes('business') || 
                          newEntry.category.toLowerCase().includes('funnel') ||
                          newEntry.category.toLowerCase().includes('report') ||
                          newEntry.category.toLowerCase().includes('onboard') ||
                          newEntry.category.toLowerCase().includes('advertis');

    try {
      const entry: AssistantKnowledgeEntry = {
        id: `entry_${Date.now()}`,
        question: newEntry.question.trim(),
        answer: newEntry.answer.trim(),
        category: newEntry.category.trim(),
        lastUpdated: BigInt(Date.now() * 1000000),
        isActive: true,
        usageCount: BigInt(0),
        isBusinessOps,
      };

      await addEntry.mutateAsync(entry);
      toast.success('Knowledge entry added successfully');
      setIsAddDialogOpen(false);
      setNewEntry({ question: '', answer: '', category: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add entry');
    }
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry) return;

    try {
      await updateEntry.mutateAsync({
        id: editingEntry.id,
        newAnswer: editingEntry.answer,
      });
      toast.success('Knowledge entry updated successfully');
      setIsEditDialogOpen(false);
      setEditingEntry(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update entry');
    }
  };

  const openEditDialog = (entry: AssistantKnowledgeEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const filteredEntries = knowledgeBase?.filter((entry) =>
    entry.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Card className="border-primary/20 shadow-md">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading knowledge base...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const errorMessage = String(error);
    const isPermissionError = errorMessage.includes('Permission denied') || errorMessage.includes('Unauthorized');

    return (
      <Card className="border-destructive/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            {isPermissionError ? 'Access Denied' : 'Error Loading Knowledge Base'}
          </CardTitle>
          <CardDescription>
            {isPermissionError
              ? 'You do not have permission to manage the knowledge base'
              : 'Failed to load knowledge base data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Knowledge Base</CardTitle>
                <CardDescription className="text-base mt-1">
                  Manage AI assistant knowledge entries
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex-shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11"
          />

          {filteredEntries.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {knowledgeBase?.length === 0
                  ? 'No knowledge entries found. Add your first entry to get started.'
                  : 'No entries match your search criteria'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base mb-2">{entry.question}</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{entry.category}</Badge>
                          {entry.isActive ? (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              <Eye className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                          {entry.isBusinessOps && (
                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                              Business Ops
                            </Badge>
                          )}
                          <Badge variant="outline">Used {Number(entry.usageCount)} times</Badge>
                        </div>
                      </div>
                      <Button onClick={() => openEditDialog(entry)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{entry.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Entry Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Knowledge Entry</DialogTitle>
            <DialogDescription>Create a new entry for the AI assistant knowledge base</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newEntry.question}
                onChange={(e) => setNewEntry({ ...newEntry, question: e.target.value })}
                placeholder="What question should this answer?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newEntry.category}
                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                placeholder="e.g., General, Ecommerce, Business Operations"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={newEntry.answer}
                onChange={(e) => setNewEntry({ ...newEntry, answer: e.target.value })}
                placeholder="Provide a detailed answer..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry} disabled={addEntry.isPending}>
              {addEntry.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Knowledge Entry</DialogTitle>
            <DialogDescription>Update the answer for this knowledge entry</DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <p className="text-sm text-muted-foreground">{editingEntry.question}</p>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <p className="text-sm text-muted-foreground">{editingEntry.category}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-answer">Answer</Label>
                <Textarea
                  id="edit-answer"
                  value={editingEntry.answer}
                  onChange={(e) => setEditingEntry({ ...editingEntry, answer: e.target.value })}
                  rows={6}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEntry} disabled={updateEntry.isPending}>
              {updateEntry.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Update Entry
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
