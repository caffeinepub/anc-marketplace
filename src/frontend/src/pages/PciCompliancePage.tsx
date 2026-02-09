import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ExternalLink, Shield } from 'lucide-react';

export default function PciCompliancePage() {
  const certificateUrl = '/assets/Screenshot_20260205-073626.Drive-1.png';

  const handleOpenInNewTab = () => {
    window.open(certificateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = 'ANC-PCI-Compliance-Certificate.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">PCI DSS Compliance Certificate</h1>
            <p className="text-muted-foreground mt-1">
              ANC Electronics N More - Certificate Number: 02202604883801
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About Our PCI Compliance</CardTitle>
            <CardDescription>
              Your security and privacy are our top priorities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              ANC Electronics N More is PCI DSS (Payment Card Industry Data Security Standard) compliant. 
              This certification demonstrates our commitment to maintaining the highest standards of security 
              for processing, storing, and transmitting credit card information.
            </p>
            <p className="text-sm leading-relaxed">
              Our compliance is verified through quarterly security scans and regular assessments by certified 
              security assessors. We guard your information like a pitbull guards its pups - with unwavering 
              dedication and vigilance.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button onClick={handleOpenInNewTab} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Certificate
              </Button>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-muted/30">
              <img
                src={certificateUrl}
                alt="PCI DSS Compliance Certificate for ANC Electronics N More"
                className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleOpenInNewTab}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Click the image to view full size in a new tab
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">What This Means For You</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Your payment information is processed securely</li>
            <li>✓ We follow industry-leading security standards</li>
            <li>✓ Regular security audits and vulnerability scans</li>
            <li>✓ Encrypted data transmission and storage</li>
            <li>✓ Continuous monitoring and improvement of security measures</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
