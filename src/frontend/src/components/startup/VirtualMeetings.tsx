import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Clock, ExternalLink, Users } from 'lucide-react';
import { useGetUserVirtualMeetings } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { format } from 'date-fns';

export default function VirtualMeetings() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: meetings = [], isLoading } = useGetUserVirtualMeetings(principal);

  const upcomingMeetings = meetings.filter((m) => Number(m.scheduledTime) > Date.now() * 1000000);
  const pastMeetings = meetings.filter((m) => Number(m.scheduledTime) <= Date.now() * 1000000);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading virtual meetings...</p>
        </CardContent>
      </Card>
    );
  }

  const MeetingCard = ({ meeting, isPast = false }: { meeting: any; isPast?: boolean }) => {
    const meetingDate = new Date(Number(meeting.scheduledTime) / 1000000);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-3 rounded-lg ${isPast ? 'bg-muted' : 'bg-primary/10'}`}>
                <Video className={`h-6 w-6 ${isPast ? 'text-muted-foreground' : 'text-primary'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-xl">{meeting.title}</CardTitle>
                  {!isPast && <Badge variant="default">Upcoming</Badge>}
                  {isPast && <Badge variant="secondary">Past</Badge>}
                </div>
                <CardDescription className="text-base mb-3">{meeting.description}</CardDescription>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(meetingDate, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{format(meetingDate, 'hh:mm a')}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button asChild variant={isPast ? 'outline' : 'default'}>
              <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {isPast ? 'View Recording' : 'Join Meeting'}
              </a>
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Interactive Website-Building Workshop
          </CardTitle>
          <CardDescription>
            Join our live virtual sessions to build your business website with step-by-step guidance from expert instructors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Workshop Features:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Live coding sessions with real-time feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Step-by-step activities to build your business website</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Q&A sessions with experienced web developers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Access to workshop recordings and resources</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {meetings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Virtual Meetings Scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Virtual meetings and workshops will appear here once scheduled. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcomingMeetings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Upcoming Meetings</h3>
              {upcomingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          )}

          {pastMeetings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Past Meetings</h3>
              {pastMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} isPast />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
