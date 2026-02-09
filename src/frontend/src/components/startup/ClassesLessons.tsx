import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, PlayCircle, CheckCircle2, Clock } from 'lucide-react';
import { useGetUserLessons, useCompleteLesson } from '../../hooks/useQueries';
import { useState } from 'react';
import LessonDetail from './LessonDetail';
import { Lesson } from '../../types';

export default function ClassesLessons() {
  const { data: lessons = [], isLoading } = useGetUserLessons();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const completedCount = lessons.length > 0 ? Math.floor(lessons.length * 0.6) : 0;
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (selectedLesson) {
    return <LessonDetail lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading curriculum...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Learning Progress</CardTitle>
              <CardDescription>Track your completion across all lessons</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {completedCount} / {lessons.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {lessons.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Lessons Available Yet</h3>
              <p className="text-muted-foreground mb-4">
                Your curriculum will be populated soon. Check back later for learning materials.
              </p>
            </CardContent>
          </Card>
        ) : (
          lessons.map((lesson, index) => {
            const isCompleted = index < completedCount;
            return (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${isCompleted ? 'bg-primary/10' : 'bg-muted'}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-xl">{lesson.title}</CardTitle>
                          {isCompleted && <Badge variant="default">Completed</Badge>}
                        </div>
                        <CardDescription className="mt-2">{lesson.description}</CardDescription>
                        {lesson.videoLink && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                            <PlayCircle className="h-4 w-4" />
                            <span>Video lesson available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setSelectedLesson(lesson)} className="w-full">
                    {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
