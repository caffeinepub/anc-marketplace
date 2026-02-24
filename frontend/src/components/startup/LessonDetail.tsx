import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Lesson } from '../../types';

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function LessonDetail({ lesson, onBack }: LessonDetailProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Lessons
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{lesson.title}</CardTitle>
          <p className="text-muted-foreground mt-2">{lesson.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {lesson.videoLink && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                src={lesson.videoLink}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          )}

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Mark as Complete
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Lessons
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
