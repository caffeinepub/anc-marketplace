import React, { useState } from 'react';
import {
  useGetUnansweredQuestions,
  useAddKnowledgeEntry,
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
import { Loader2, MessageSquare, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AssistantKnowledgeEntry } from '../../../backend';
import { toast } from 'sonner';

export default function UnansweredQuestionsAdmin() {
  const { data: questions, isLoading, error } = useGetUnansweredQuestions();
  const addKnowledgeEntry = useAddKnowledgeEntry();

  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<UnansweredQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');

  const handleConvert = async () => {
    if (!selectedQuestion || !answer.trim() || !category.trim()) {
      toast.error('Please provide an answer and category');
      return;
    }

    const isBusinessOps = category.toLowerCase().includes('business') || 
                          category.toLowerCase().includes('funnel') ||
                          category.toLowerCase().includes('report') ||
                          category.toLowerCase().includes('onboard') ||
                          category.toLowerCase().includes('advertis');

    try {
      const entry: AssistantKnowledgeEntry = {
        id: `converted_${selectedQuestion.id}`,
        question: selectedQuestion.question,
        answer: answer.trim(),
        category: category.trim(),
        lastUpdated: BigInt(Date.now() * 1000000),
        isActive: true,
        usageCount: selectedQuestion.interactionCount,
        isBusinessOps,
      };

      await addKnowledgeEntry.mutateAsync(entry);
      toast.success('Question converted to knowledge entry');
      setIsConvertDialogOpen(false);
      setSelectedQuestion(null);
      setAnswer('');
      setCategory('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert question');
    }
  };

  const openConvertDialog = (question: UnansweredQuestion) => {
    setSelectedQuestion(question);
    setCategory(question.categorySuggestion);
    setIsConvertDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 shadow-md">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading unanswered questions...</p>
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
            {isPermissionError ? 'Access Denied' : 'Error Loading Questions'}
          </CardTitle>
          <CardDescription>
            {isPermissionError
              ? 'You do not have permission to view unanswered questions'
              : 'Failed to load unanswered questions'}
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
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Unanswered Questions</CardTitle>
              <CardDescription className="text-base mt-1">
                Review and convert unanswered questions into knowledge entries
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {questions?.length === 0 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Great! There are no unanswered questions at the moment.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {questions?.map((question) => (
                <Card key={question.id} className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base mb-2">{question.question}</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{question.categorySuggestion}</Badge>
                          <Badge variant="secondary">
                            Asked {Number(question.interactionCount)} times
                          </Badge>
                        </div>
                      </div>
                      <Button onClick={() => openConvertDialog(question)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Convert
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Convert Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Convert to Knowledge Entry</DialogTitle>
            <DialogDescription>Provide an answer to add this question to the knowledge base</DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <p className="text-sm text-muted-foreground">{selectedQuestion.question}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., General, Ecommerce, Business Operations"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide a detailed answer..."
                  rows={6}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConvertDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvert} disabled={addKnowledgeEntry.isPending}>
              {addKnowledgeEntry.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Convert to Knowledge
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
