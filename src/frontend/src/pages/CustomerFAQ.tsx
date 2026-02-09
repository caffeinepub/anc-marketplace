import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Mail } from 'lucide-react';
import { PRICING_MODEL } from '@/lib/pricingCopy';

export default function CustomerFAQ() {
  const faqs = [
    {
      question: 'What is ANC Electronics N Services?',
      answer: 'ANC Electronics N Services is a comprehensive platform offering e-commerce solutions, startup assistance programs, and business services. We help customers find quality products and services while supporting entrepreneurs and businesses in their growth journey.',
    },
    {
      question: 'How do I create an account?',
      answer: 'Click the "Login" button in the top right corner to authenticate using Internet Identity. Once logged in, you\'ll be prompted to set up your profile with your name and email. Your account will be created automatically.',
    },
    {
      question: 'What products and services are available?',
      answer: 'We offer a wide range of products in our Store, including electronics, business tools, and services. Browse the Store page to see current offerings. New products and services are added regularly.',
    },
    {
      question: 'How much does it cost to use ANC?',
      answer: PRICING_MODEL.detailedDescription,
    },
    {
      question: 'Are there any monthly fees?',
      answer: PRICING_MODEL.faqMonthlyFees,
    },
    {
      question: 'What is the $5 service fee?',
      answer: PRICING_MODEL.faqServiceFee,
    },
    {
      question: 'How do I make a purchase?',
      answer: 'Browse products in the Store, click "Buy Now" on any product, complete the human verification check, and you\'ll be redirected to our secure Stripe checkout. All major credit and debit cards are accepted.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes! All payments are processed through Stripe, a leading payment processor. We never store your payment information on our servers. ANC is PCI DSS compliant and follows industry best practices for security.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards and debit cards through our secure Stripe integration. Payment processing is handled entirely by Stripe for your security.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'Refund policies vary by product and seller. For marketplace products, please contact the seller directly. For subscription services, contact our support team at ancelectronicsnservices@gmail.com within the first 7 days for refund consideration.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach our support team at ancelectronicsnservices@gmail.com or call us at 352-480-9856. We also have an AI assistant available on every page (look for the chat icon in the bottom right) for quick answers to common questions.',
    },
    {
      question: 'What is the Store Builder?',
      answer: `The Store Builder is an optional $${PRICING_MODEL.standaloneWebsiteSubscription} monthly subscription that allows you to convert your marketplace store into a standalone branded website or app. This is completely optional - you can continue selling on the marketplace for free with just the $5 per-sale service fee.`,
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customer FAQ</h1>
          <p className="text-muted-foreground">
            Frequently asked questions about shopping and using ANC Electronics N Services
          </p>
        </div>

        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Quick Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>Platform:</strong> ANC Electronics N Services - Digital transformation platform
            </p>
            <p className="text-sm">
              <strong>Pricing:</strong> {PRICING_MODEL.shortDescription}
            </p>
            <p className="text-sm">
              <strong>Support:</strong> ancelectronicsnservices@gmail.com | 352-480-9856
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still Have Questions?</CardTitle>
            <CardDescription>We're here to help!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">ancelectronicsnservices@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">AI Assistant</p>
                <p className="text-sm text-muted-foreground">
                  Click the chat icon in the bottom right corner for instant answers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
