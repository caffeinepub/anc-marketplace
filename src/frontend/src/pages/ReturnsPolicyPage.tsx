import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReturnsPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Returns Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last Updated: January 1, 2025</p>
          
          <h2>1. Return Eligibility</h2>
          <p>Items may be returned within 30 days of delivery in original condition with all packaging and accessories.</p>
          
          <h2>2. Non-Returnable Items</h2>
          <p>Digital products, personalized items, and clearance items are not eligible for return.</p>
          
          <h2>3. Return Process</h2>
          <p>Contact us at ancelectronicsnservices@gmail.com to initiate a return. You will receive return instructions and a return authorization number.</p>
          
          <h2>4. Refund Processing</h2>
          <p>Refunds are processed within 5-7 business days after we receive and inspect the returned item.</p>
          
          <h2>5. Return Shipping</h2>
          <p>Customers are responsible for return shipping costs unless the item is defective or we made an error.</p>
          
          <h2>6. Contact Us</h2>
          <p>For return inquiries, contact us at ancelectronicsnservices@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
