import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last Updated: January 1, 2025</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including name, email address, and payment information processed through our secure payment partners.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
          
          <h2>3. Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information with service providers who assist us in operating our platform.</p>
          
          <h2>4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. All payment processing is handled by PCI-compliant payment processors.</p>
          
          <h2>5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us at ancelectronicsnservices@gmail.com for assistance.</p>
          
          <h2>6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at ancelectronicsnservices@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
