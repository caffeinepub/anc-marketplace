import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Shipping Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last Updated: January 1, 2025</p>
          
          <h2>1. Shipping Methods</h2>
          <p>We offer standard and expedited shipping options. Shipping times vary based on destination and selected method.</p>
          
          <h2>2. Shipping Costs</h2>
          <p>Shipping costs are calculated at checkout based on order weight, dimensions, and destination.</p>
          
          <h2>3. Processing Time</h2>
          <p>Orders are typically processed within 1-2 business days. You will receive a tracking number once your order ships.</p>
          
          <h2>4. International Shipping</h2>
          <p>We ship to select international destinations. Additional customs fees and duties may apply.</p>
          
          <h2>5. Contact Us</h2>
          <p>For shipping inquiries, contact us at ancelectronicsnservices@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
