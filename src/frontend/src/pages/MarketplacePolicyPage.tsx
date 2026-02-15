import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarketplacePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Marketplace Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last Updated: January 1, 2025</p>
          
          <h2>1. Marketplace Overview</h2>
          <p>ANC Marketplace connects buyers and sellers in a secure, transparent platform.</p>
          
          <h2>2. Seller Responsibilities</h2>
          <p>Sellers must accurately describe products, fulfill orders promptly, and provide customer support.</p>
          
          <h2>3. Buyer Protection</h2>
          <p>We work to ensure fair transactions. Contact us if you experience issues with a purchase.</p>
          
          <h2>4. Fees and Payments</h2>
          <p>Marketplace access is free. A $5 service fee applies per sale. Funds are temporarily held until transferred to seller payout accounts.</p>
          
          <h2>5. Prohibited Items</h2>
          <p>Certain items are prohibited from sale on our platform, including illegal goods and counterfeit products.</p>
          
          <h2>6. Dispute Resolution</h2>
          <p>We provide dispute resolution services for transaction issues. Contact ancelectronicsnservices@gmail.com for assistance.</p>
          
          <h2>7. Contact Us</h2>
          <p>For marketplace policy questions, contact us at ancelectronicsnservices@gmail.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
