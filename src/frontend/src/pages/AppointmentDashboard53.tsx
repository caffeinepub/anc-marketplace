import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, ExternalLink, Users } from "lucide-react";
import React from "react";

const CALENDLY_URL = "https://calendly.com/anc-apprentice-program";

export default function AppointmentDashboard53() {
  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            ANC Apprentice Program Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule appointments and manage your apprentice program sessions
          </p>
        </div>

        {/* Program Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Apprentice Program</CardTitle>
                <CardDescription>
                  Join our structured apprentice program to learn and grow
                </CardDescription>
              </div>
              <Badge className="ml-auto bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The ANC Apprentice Program provides hands-on training, mentorship,
              and real-world experience in e-commerce, business operations, and
              digital marketing. Schedule your intake appointment below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[
                { icon: Clock, label: "Duration", value: "3-6 months" },
                { icon: Users, label: "Cohort Size", value: "Up to 10" },
                { icon: Calendar, label: "Sessions", value: "Weekly" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendly Embed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Your Appointment
            </CardTitle>
            <CardDescription>
              Book a session using our scheduling system below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full rounded-lg overflow-hidden border border-border bg-white">
              <iframe
                src={`${CALENDLY_URL}?embed_domain=${encodeURIComponent(window.location.hostname)}&embed_type=Inline`}
                width="100%"
                height="600"
                frameBorder="0"
                title="Schedule Appointment"
                className="block"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Having trouble with the embedded scheduler?
              </p>
              <Button variant="outline" asChild>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Scheduling Page
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
