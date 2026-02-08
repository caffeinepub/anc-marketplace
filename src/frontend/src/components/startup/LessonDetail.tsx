import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PlayCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { Lesson } from '../../backend';
import { useCompleteLesson } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function LessonDetail({ lesson, onBack }: LessonDetailProps) {
  const completeLesson = useCompleteLesson();

  const handleComplete = async () => {
    try {
      await completeLesson.mutateAsync(lesson.id);
      toast.success('Lesson marked as complete!');
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold">{lesson.title}</h2>
          <p className="text-muted-foreground mt-1">{lesson.description}</p>
        </div>
      </div>

      {lesson.videoLink && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              Video Lesson
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <iframe
                src={lesson.videoLink}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary">
                <ExternalLink className="h-3 w-3 mr-1" />
                Live Stream
              </Badge>
              <a
                href={lesson.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Open in new window
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Ready to move forward?</h3>
              <p className="text-sm text-muted-foreground">Mark this lesson as complete to track your progress</p>
            </div>
            <Button onClick={handleComplete} disabled={completeLesson.isPending} size="lg">
              {completeLesson.isPending ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
