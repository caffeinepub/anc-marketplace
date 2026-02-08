import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Calendar } from 'lucide-react';

export default function AppointmentDashboard53() {
  const calendlyUrl = 'https://calendly.com/anc-electronics-n-services';

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Appointment Dashboard53
          </h1>
          <p className="text-muted-foreground text-lg">
            Schedule your appointment with ANC Apprentice Program Center
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Your Appointment
            </CardTitle>
            <CardDescription>
              Book a time that works best for you to discuss our startup assistance program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <Button asChild size="lg" className="gap-2">
                <a 
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Calendly in New Tab
                </a>
              </Button>
            </div>

            <div className="w-full bg-muted/30 rounded-lg overflow-hidden border">
              <div className="relative w-full" style={{ paddingBottom: '120%', minHeight: '600px' }}>
                <iframe
                  src={calendlyUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  title="Calendly Scheduling Page"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Having trouble with the embedded calendar?{' '}
                <a 
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground inline-flex items-center gap-1"
                >
                  Click here to open in a new window
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">About ANC Apprentice Program Center</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our startup assistance program is designed to help entrepreneurs and small business owners 
              navigate the challenges of starting and growing their businesses. Schedule an appointment 
              to learn more about how we can support your entrepreneurial journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
