import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Zap } from "lucide-react";
import React from "react";

export default function FinixProcessorCard() {
  return (
    <Card className="border border-purple-200 bg-purple-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-purple-700" />
          Finix
          <Badge variant="secondary" className="ml-auto text-xs">
            Configured
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-muted-foreground text-xs">Application ID</p>
            <p className="font-mono text-xs">APrYhssxJqxc52dmc1giR6FW</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Merchant ID</p>
            <p className="font-mono text-xs">MUhzP3VBRwKEeLELdj5U6q1A</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">
              Merchant Identity ID
            </p>
            <p className="font-mono text-xs">IDfepSCyaxdtSVXKUjuEcfg</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Username</p>
            <p className="font-mono text-xs">US7x1ceurKTubLYUzoVXFhXd</p>
          </div>
        </div>
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              window.open(
                "https://link.live-payments-checkout.com/V4EqCz",
                "_blank",
              )
            }
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Finix Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
