import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, RefreshCw } from 'lucide-react';
import { useGetUnansweredQuestions } from '../../../hooks/useQueries';

export default function UnansweredQuestionsAdmin() {
  const { data: questions = [], isLoading, refetch } = useGetUnansweredQuestions();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Unanswered Questions
            </CardTitle>
            <CardDescription>Questions the assistant could not answer</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No unanswered questions at this time.
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="border rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium">{q.question}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{q.categorySuggestion}</Badge>
                  <span className="text-xs text-muted-foreground">Asked {q.interactionCount}x</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
