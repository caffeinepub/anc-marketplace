import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last Updated: January 1, 2025</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using ANC Marketplace, you accept and agree to be bound by these Terms and Conditions.</p>
          
          <h2>2. Use of Service</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>
          
          <h2>3. Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account and for all activities under your account.</p>
          
          <h2>4. Payments and Fees</h2>
          <p>All fees are as described on our platform. We reserve the right to change fees with notice.</p>
          
          <h2>5. Intellectual Property</h2>
          <p>All content on this platform is protected by copyright and other intellectual property laws.</p>
          
          <h2>6. Limitation of Liability</h2>
          <p>We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
          
          <h2>7. Contact Us</h2>
          <p>For questions about these Terms, contact us at ancelectronicsnservices@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
