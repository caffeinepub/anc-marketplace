import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import React from "react";

export default function AuthorizeNetCard() {
  return (
    <Card className="border border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-5 w-5 text-blue-700" />
          Authorize.Net
          <Badge variant="secondary" className="ml-auto text-xs">
            Configured
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-muted-foreground text-xs">Merchant</p>
            <p className="font-medium">ANC Electronics and More</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Login ID</p>
            <p className="font-mono">9JQ6vkk8W3DA</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Payment Gateway ID</p>
            <p className="font-mono">2820497</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">PCI Merchant #</p>
            <p className="font-mono">201100278838</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Processor</p>
            <p>TSYS Acquiring Solutions</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Currency</p>
            <p>US Dollar (USD)</p>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-1">Accepted Cards</p>
          <p className="text-xs">
            American Express, Diners Club, Discover, EnRoute, JCB, MasterCard,
            Visa
          </p>
        </div>
        <div className="pt-1">
          <p className="text-muted-foreground text-xs mb-1">
            Processor Details
          </p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
            <span>
              <span className="text-muted-foreground">Acquirer BIN:</span>{" "}
              422108
            </span>
            <span>
              <span className="text-muted-foreground">Store:</span> 0001
            </span>
            <span>
              <span className="text-muted-foreground">Terminal:</span> 7000
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Verified by Authorize.Net &mdash; Seal ID:
            69e552d5-1a3c-4d50-9640-bb4bd9180566
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
