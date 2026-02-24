import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

interface BlogPostContent {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  content: string[];
}

export default function CustomerBlogPost() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const postId = params.postId;

  const posts: Record<string, BlogPostContent> = {
    'getting-started-guide': {
      id: 'getting-started-guide',
      title: 'Getting Started with ANC Electronics N Services',
      date: 'February 5, 2026',
      category: 'Getting Started',
      readTime: '5 min read',
      content: [
        'Welcome to ANC Electronics N Services! This guide will help you get started with our platform and make the most of your shopping experience.',
        'Creating Your Account: Click the "Login" button in the top right corner to authenticate using Internet Identity. This secure authentication method protects your privacy while giving you access to all platform features. Once logged in, you\'ll be prompted to set up your profile with your name and email address.',
        'Browsing Products: Navigate to the Store page to explore our wide selection of products and services. You can browse by category, search for specific items, or view featured products. Each product listing includes detailed descriptions, pricing, and availability information.',
        'Adding to Cart: When you find something you like, simply click "Add to Cart." You can continue shopping and add multiple items before checking out. Your cart is saved automatically, so you can come back later to complete your purchase.',
        'Checkout Process: When you\'re ready to purchase, go to your cart and click "Checkout." You\'ll be guided through a secure payment process powered by Stripe. We accept all major credit and debit cards. Your payment information is encrypted and never stored on our servers.',
        'Order Tracking: After completing your purchase, you can track your order status from your account dashboard. You\'ll also receive email notifications for order updates and shipping information.',
        'Need Help? Our customer support team is always ready to assist you. Contact us at support@ancelectronics.com for any questions or concerns.',
      ],
    },
    'secure-shopping-tips': {
      id: 'secure-shopping-tips',
      title: '5 Tips for Secure Online Shopping',
      date: 'February 3, 2026',
      category: 'Security',
      readTime: '4 min read',
      content: [
        'Online shopping security is our top priority. Here are five essential tips to keep your information safe while shopping on our platform.',
        '1. Use Strong Authentication: Our platform uses Internet Identity for secure, privacy-preserving authentication. This eliminates the need for passwords and protects your account from unauthorized access.',
        '2. Verify Secure Connections: Always ensure you\'re on a secure connection (look for "https://" in the URL). Our platform is built on the Internet Computer blockchain, providing an additional layer of security.',
        '3. Protect Your Payment Information: We use Stripe for payment processing, which means your credit card information is encrypted and handled by a PCI-compliant payment processor. Never share your payment details via email or unsecured channels.',
        '4. Monitor Your Account: Regularly check your order history and account activity. If you notice anything suspicious, contact our support team immediately.',
        '5. Keep Your Device Secure: Use updated browsers, enable security features on your devices, and avoid shopping on public Wi-Fi networks without a VPN.',
        'Remember: We will never ask for your password or payment information via email. If you receive suspicious communications, report them to our security team.',
      ],
    },
    'product-quality-guide': {
      id: 'product-quality-guide',
      title: 'How to Choose Quality Electronics',
      date: 'January 30, 2026',
      category: 'Shopping Tips',
      readTime: '6 min read',
      content: [
        'Choosing quality electronics can be challenging with so many options available. This guide will help you make informed decisions.',
        'Check Specifications: Always review the technical specifications carefully. Compare features, performance metrics, and compatibility with your existing devices. Don\'t just focus on price—consider the value you\'re getting.',
        'Read Product Descriptions: Our detailed product descriptions provide important information about materials, build quality, and intended use. Pay attention to these details to ensure the product meets your needs.',
        'Consider Warranties: Quality products typically come with manufacturer warranties. Check what\'s covered and for how long. This is often a good indicator of the manufacturer\'s confidence in their product.',
        'Look for Reviews: While we\'re building our review system, you can research products independently. Look for professional reviews and user feedback from trusted sources.',
        'Understand Return Policies: Familiarize yourself with our return policy before making a purchase. We want you to be satisfied with your purchase and offer reasonable return options.',
        'Ask Questions: If you\'re unsure about a product, contact our support team. We\'re here to help you make the right choice for your needs and budget.',
      ],
    },
    'subscription-benefits': {
      id: 'subscription-benefits',
      title: 'Understanding Subscription Plans and Their Benefits',
      date: 'January 28, 2026',
      category: 'Subscriptions',
      readTime: '5 min read',
      content: [
        'Our subscription plans offer exclusive benefits and access to premium features. Here\'s what you need to know about each option.',
        'Startup Member Plan: Perfect for entrepreneurs and new business owners. This subscription gives you access to the ANC Apprentice Program Center, including educational content, virtual meetings, hands-on activities, and business credit building resources.',
        'B2B Member Plan: Designed for established businesses and service providers. Access the B2B Dashboard with project management tools, client tracking, analytics, and business growth features.',
        'Store Builder Subscription: Create your own online store with professional templates, branding customization, and domain purchase assistance. Only $10/month to launch your e-commerce presence.',
        'Choosing the Right Plan: Consider your current business stage and goals. Startups benefit most from the Apprentice Program, while established businesses should consider the B2B plan. You can always upgrade or change plans as your needs evolve.',
        'Subscription Management: All subscriptions are managed through your account dashboard. You can view your current plan, billing information, and make changes at any time.',
        'Value Proposition: Our subscriptions provide access to tools and resources that would cost significantly more if purchased separately. We\'re committed to supporting your success at every stage.',
      ],
    },
    'customer-support-guide': {
      id: 'customer-support-guide',
      title: 'Making the Most of Customer Support',
      date: 'January 25, 2026',
      category: 'Support',
      readTime: '3 min read',
      content: [
        'Our customer support team is here to ensure you have the best possible experience. Here\'s how to get help when you need it.',
        'Contact Methods: Reach us via email at support@ancelectronics.com. We typically respond within 24 hours during business days. For urgent matters, please indicate "URGENT" in your subject line.',
        'Order Tracking: You can track your orders directly from your account dashboard. This is the fastest way to get real-time updates on your purchases.',
        'Common Issues: Many questions can be answered in our FAQ section. Check there first for quick answers about accounts, payments, shipping, and returns.',
        'Providing Information: When contacting support, include your order number (if applicable), a clear description of the issue, and any relevant screenshots. This helps us resolve your issue faster.',
        'Feedback Welcome: We value your feedback! Let us know about your experience, suggest improvements, or share what you love about our platform. Your input helps us serve you better.',
      ],
    },
  };

  const post = postId ? posts[postId] : null;

  if (!post) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate({ to: '/customer-blog' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/customer-blog' })}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>
            <CardTitle className="text-3xl mb-4">{post.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {post.date}
            </div>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            {post.content.map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
