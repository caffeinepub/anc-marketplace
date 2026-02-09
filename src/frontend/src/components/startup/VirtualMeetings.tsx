import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, ExternalLink, Clock } from 'lucide-react';
import { useGetUserVirtualMeetings } from '../../hooks/useQueries';
import { VirtualMeeting } from '../../types';

export default function VirtualMeetings() {
  const { data: meetings = [], isLoading } = useGetUserVirtualMeetings();

  const now = Date.now();
  const upcomingMeetings = meetings.filter((m) => Number(m.scheduledTime) / 1000000 > now);
  const pastMeetings = meetings.filter((m) => Number(m.scheduledTime) / 1000000 <= now);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading meetings...</p>
        </CardContent>
      </Card>
    );
  }

  const MeetingCard = ({ meeting, isPast }: { meeting: VirtualMeeting; isPast: boolean }) => {
    const meetingDate = new Date(Number(meeting.scheduledTime) / 1000000);

    return (
      <Card className={isPast ? 'opacity-60' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-3 rounded-lg ${isPast ? 'bg-muted' : 'bg-primary/10'}`}>
                <Video className={`h-6 w-6 ${isPast ? 'text-muted-foreground' : 'text-primary'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-xl">{meeting.title}</CardTitle>
                  {isPast && <Badge variant="secondary">Past</Badge>}
                  {!isPast && <Badge variant="default">Upcoming</Badge>}
                </div>
                <CardDescription className="mt-2">{meeting.description}</CardDescription>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{meetingDate.toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{meetingDate.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => window.open(meeting.meetingLink, '_blank')}
            className="w-full gap-2"
            disabled={isPast}
          >
            <ExternalLink className="h-4 w-4" />
            {isPast ? 'Meeting Ended' : 'Join Meeting'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {upcomingMeetings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
          {upcomingMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} isPast={false} />
          ))}
        </div>
      )}

      {pastMeetings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Past Meetings</h3>
          {pastMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} isPast={true} />
          ))}
        </div>
      )}

      {meetings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Meetings Scheduled</h3>
            <p className="text-muted-foreground">
              Virtual meetings will appear here once scheduled. Check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
