import { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  useGetUnansweredQuestions,
  useConvertQuestionToKnowledge,
  type UnansweredQuestion,
} from '../../../hooks/useQueries';
import type { AssistantKnowledgeEntry } from '../../../backend';

export default function UnansweredQuestionsAdmin() {
  const { data: unansweredQuestions = [], isLoading } = useGetUnansweredQuestions();
  const convertQuestion = useConvertQuestionToKnowledge();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<UnansweredQuestion | null>(null);
  const [form, setForm] = useState({
    answer: '',
    category: '',
  });

  const resetForm = () => {
    setForm({ answer: '', category: '' });
    setSelectedQuestion(null);
  };

  const handleConvert = (question: UnansweredQuestion) => {
    setSelectedQuestion(question);
    setForm({
      answer: '',
      category: question.categorySuggestion || 'General',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedQuestion || !form.answer.trim() || !form.category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const entry: AssistantKnowledgeEntry = {
        id: `KB-${Date.now()}`,
        question: selectedQuestion.question,
        answer: form.answer.trim(),
        category: form.category.trim(),
        isActive: true,
        lastUpdated: BigInt(Date.now() * 1000000),
        usageCount: BigInt(0),
      };

      await convertQuestion.mutateAsync({
        questionId: selectedQuestion.id,
        entry,
      });
      toast.success('Question converted to knowledge entry successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to convert question');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading unanswered questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Unanswered Questions</h3>
        <p className="text-sm text-muted-foreground">
          Review questions the assistant couldn't answer and create knowledge entries
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {unansweredQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No unanswered questions yet. The assistant is doing great!
                </p>
              </CardContent>
            </Card>
          ) : (
            unansweredQuestions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{question.categorySuggestion}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Asked {question.interactionCount.toString()} times
                        </span>
                      </div>
                      <CardTitle className="text-base">{question.question}</CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(Number(question.creationTime) / 1000000).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleConvert(question)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Knowledge Entry
                    </Button>
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
            <DialogTitle>Create Knowledge Entry</DialogTitle>
            <DialogDescription>
              Convert this unanswered question into a knowledge entry
            </DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="text-sm">{selectedQuestion.question}</p>
                </div>
              </div>
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
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Provide a detailed answer to this question..."
                  rows={6}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Create Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
