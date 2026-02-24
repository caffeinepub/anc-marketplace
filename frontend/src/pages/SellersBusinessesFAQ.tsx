import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Mail } from 'lucide-react';

export default function SellersBusinessesFAQ() {
  const faqs = [
    {
      question: 'What B2B services does ANC Electronics N Services offer?',
      answer: 'We provide comprehensive B2B services including project management, client relationship management, service listings, analytics, and business growth tools. Our platform is designed to help businesses scale and manage their operations efficiently.',
    },
    {
      question: 'How do I access B2B features?',
      answer: 'To access B2B features, you need a B2B Member subscription. Visit our Store page, purchase a B2B subscription plan, and your account will be upgraded automatically. You\'ll then have access to the B2B Dashboard and all related features.',
    },
    {
      question: 'What is the Startup Assistance Program?',
      answer: 'The ANC Apprentice Program Center is our comprehensive startup assistance program offering educational content, virtual meetings, hands-on activities, and business credit building resources. It\'s designed to help entrepreneurs launch and grow their businesses successfully.',
    },
    {
      question: 'Can I integrate third-party apps with my account?',
      answer: 'Yes! Our App Center allows you to integrate various third-party applications and services. You can connect tools for marketing, analytics, CRM, and more to streamline your business operations.',
    },
    {
      question: 'What is the Store Builder feature?',
      answer: 'Store Builder is a powerful tool that lets you create your own online store. Choose from professional templates, customize your branding, and launch your e-commerce presence. The subscription is $10/month and includes domain purchase assistance.',
    },
    {
      question: 'How do Funnels work?',
      answer: 'Funnels help you create and manage sales funnels for your business. Our platform integrates with funnel partners to provide you with tools to convert leads into customers effectively.',
    },
    {
      question: 'What are dropshipping integrations?',
      answer: 'Our platform supports dropshipping partner integrations, allowing you to connect with suppliers and automate your product fulfillment process. This is managed through the Admin Dashboard for authorized users.',
    },
    {
      question: 'How does payment processing work for my business?',
      answer: 'We use Stripe for secure payment processing. As a business user, you can receive payments from customers, and our platform handles the transaction security and processing. Service fees may apply based on your account type.',
    },
    {
      question: 'Can I manage multiple team members?',
      answer: 'Yes, administrators can manage user roles and access levels through the Admin Dashboard. You can assign different roles (Admin, User, Guest) and access levels (Startup Member, B2B Member) to team members.',
    },
    {
      question: 'What analytics and reporting are available?',
      answer: 'B2B members have access to comprehensive analytics including project tracking, client metrics, revenue reports, and performance indicators. The B2B Dashboard provides real-time insights into your business operations.',
    },
    {
      question: 'How do I schedule appointments with the ANC team?',
      answer: 'You can schedule appointments through our Appointment Dashboard53, which integrates with Calendly. This is perfect for consultations, program enrollment, or business discussions.',
    },
    {
      question: 'What support is available for business users?',
      answer: 'Business users receive priority support via email. We also offer virtual meetings and consultations as part of our startup assistance program. Contact us to discuss your specific needs.',
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Sellers & Businesses FAQ</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our B2B services, startup programs, and business tools.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About Our Business Services</CardTitle>
            <CardDescription>Empowering entrepreneurs and businesses to succeed</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              ANC Electronics N Services provides a comprehensive suite of business tools and services designed to help 
              entrepreneurs and established businesses thrive. Our platform combines e-commerce capabilities with 
              professional business services, startup assistance programs, and powerful integrations.
            </p>
            <p>
              Whether you're launching a new startup through our Apprentice Program Center, managing B2B operations, 
              or building your online store, we provide the tools, resources, and support you need. Our platform is 
              built on the Internet Computer blockchain, ensuring security, transparency, and reliability.
            </p>
            <p>
              Key features include: B2B Dashboard for project and client management, Store Builder for creating your 
              online presence, App Center for integrations, Funnels for sales optimization, and comprehensive analytics 
              to track your business performance.
            </p>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Need Business Support?
            </CardTitle>
            <CardDescription>
              Our team is ready to help you grow your business.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              For business inquiries and support, contact us at{' '}
              <a href="mailto:business@ancelectronics.com" className="text-primary hover:underline">
                business@ancelectronics.com
              </a>
              {' '}or schedule a consultation through our{' '}
              <a href="/appointment-dashboard53" className="text-primary hover:underline">
                Appointment Dashboard
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
