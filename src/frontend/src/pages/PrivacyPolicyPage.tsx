import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'February 8, 2026';

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground mt-1">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ANC Electronics N More Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6 text-sm">
                <section>
                  <h2 className="text-lg font-semibold mb-3">1. Introduction</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Welcome to ANC Electronics N More ("we," "our," or "us"). We are committed to protecting 
                    your personal information and your right to privacy. This Privacy Policy explains how we 
                    collect, use, disclose, and safeguard your information when you use our marketplace platform 
                    and services.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">2. Information We Collect</h2>
                  <p className="leading-relaxed text-muted-foreground mb-3">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Account information (name, email address, business details)</li>
                    <li>Payment information (processed securely through third-party payment processors)</li>
                    <li>Communication data (support requests, feedback, inquiries)</li>
                    <li>Usage data (how you interact with our platform)</li>
                    <li>Device and browser information</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">3. How We Use Your Information</h2>
                  <p className="leading-relaxed text-muted-foreground mb-3">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send administrative information, updates, and security alerts</li>
                    <li>Respond to your comments, questions, and customer service requests</li>
                    <li>Monitor and analyze trends, usage, and activities</li>
                    <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">4. Information Sharing and Disclosure</h2>
                  <p className="leading-relaxed text-muted-foreground mb-3">
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>With service providers who perform services on our behalf</li>
                    <li>With payment processors to facilitate transactions</li>
                    <li>To comply with legal obligations or respond to lawful requests</li>
                    <li>To protect our rights, privacy, safety, or property</li>
                    <li>In connection with a business transfer or acquisition</li>
                    <li>With your consent or at your direction</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">5. Data Security</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We implement appropriate technical and organizational security measures to protect your 
                    personal information. We are PCI DSS compliant and conduct quarterly security scans. 
                    However, no method of transmission over the Internet or electronic storage is 100% secure, 
                    and we cannot guarantee absolute security.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">6. Cookies and Tracking Technologies</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We use cookies and similar tracking technologies to collect information about your browsing 
                    activities. You can control cookies through your browser settings. Please note that disabling 
                    cookies may affect the functionality of our services.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">7. Your Privacy Rights</h2>
                  <p className="leading-relaxed text-muted-foreground mb-3">
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>The right to access your personal information</li>
                    <li>The right to correct inaccurate information</li>
                    <li>The right to delete your personal information</li>
                    <li>The right to restrict or object to processing</li>
                    <li>The right to data portability</li>
                    <li>The right to withdraw consent</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">8. Children's Privacy</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Our services are not directed to individuals under the age of 18. We do not knowingly collect 
                    personal information from children. If you believe we have collected information from a child, 
                    please contact us immediately.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">9. Third-Party Links</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Our platform may contain links to third-party websites and services. We are not responsible 
                    for the privacy practices of these third parties. We encourage you to review their privacy 
                    policies before providing any personal information.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">10. Changes to This Privacy Policy</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by 
                    posting the new Privacy Policy on this page and updating the "Last updated" date. Your 
                    continued use of our services after any changes constitutes your acceptance of the updated policy.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-lg font-semibold mb-3">11. Contact Us</h2>
                  <p className="leading-relaxed text-muted-foreground mb-3">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium">ANC Electronics N More</p>
                    <p className="text-muted-foreground">Email: support@anc-electronics-n-services.net</p>
                    <p className="text-muted-foreground">
                      Appointment Scheduling:{' '}
                      <a 
                        href="https://calendly.com/anc-electronics-n-services" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground"
                      >
                        https://calendly.com/anc-electronics-n-services
                      </a>
                    </p>
                  </div>
                </section>

                <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium">
                    We guard your information like a pitbull guards its pups - with unwavering dedication and vigilance.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
