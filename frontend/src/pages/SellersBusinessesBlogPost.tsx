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

export default function SellersBusinessesBlogPost() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const postId = params.postId;

  const posts: Record<string, BlogPostContent> = {
    'b2b-dashboard-guide': {
      id: 'b2b-dashboard-guide',
      title: 'Maximizing Your B2B Dashboard for Business Growth',
      date: 'February 6, 2026',
      category: 'B2B Services',
      readTime: '7 min read',
      content: [
        'The B2B Dashboard is your command center for managing business operations. This guide will help you leverage its full potential.',
        'Dashboard Overview: When you first access the B2B Dashboard, you\'ll see key metrics including active projects, total clients, services listed, and monthly revenue. These stats update in real-time to give you an accurate picture of your business health.',
        'Project Management: The Projects tab allows you to track all your active projects, their status, and associated clients. You can view project details, update statuses, and monitor progress. Use this feature to ensure nothing falls through the cracks.',
        'Client Tracking: The Clients tab provides a comprehensive view of your client relationships. Track client history, project associations, and communication logs. Building strong client relationships is key to business growth.',
        'Service Listings: Manage your service offerings through the Services tab. Add new services, update pricing, and control availability. Clear service descriptions help attract the right clients.',
        'Analytics and Insights: The Analytics tab provides detailed reports on your business performance. Track revenue trends, project completion rates, and client acquisition metrics. Use these insights to make data-driven decisions.',
        'Best Practices: Regularly update project statuses, maintain accurate client information, and review your analytics weekly. Set goals based on your metrics and track progress over time.',
      ],
    },
    'startup-program-success': {
      id: 'startup-program-success',
      title: 'Success Stories from the ANC Apprentice Program',
      date: 'February 4, 2026',
      category: 'Startup Program',
      readTime: '8 min read',
      content: [
        'The ANC Apprentice Program Center has helped numerous entrepreneurs launch successful businesses. Here are some inspiring success stories.',
        'From Idea to Launch: Sarah joined the program with just an idea for a tech consulting business. Through our educational content and virtual meetings, she developed a solid business plan, established her LLC, and secured her first clients within three months.',
        'Building Business Credit: Marcus used our business credit building module to establish credit for his e-commerce startup. By following the verification milestones and credit bureau registration process, he qualified for business financing within six months.',
        'Scaling Operations: The Rodriguez family business grew from a local service provider to a regional operation using our B2B tools and startup resources. They credit the program\'s hands-on activities and mentorship for their expansion success.',
        'Key Success Factors: Common themes among successful participants include consistent engagement with educational content, active participation in virtual meetings, completion of all activities, and application of learned concepts to their businesses.',
        'Program Benefits: Participants gain access to comprehensive business education, one-on-one mentorship, networking opportunities, and practical tools for business operations. The program is designed to support you from concept to established business.',
        'Your Success Story: Whether you\'re just starting or looking to scale, the ANC Apprentice Program provides the resources and support you need. Join our community of successful entrepreneurs today.',
      ],
    },
    'store-builder-tutorial': {
      id: 'store-builder-tutorial',
      title: 'Building Your Online Store: A Complete Tutorial',
      date: 'February 1, 2026',
      category: 'Store Builder',
      readTime: '10 min read',
      content: [
        'Creating a professional online store has never been easier. This comprehensive tutorial will guide you through the entire Store Builder process.',
        'Getting Started: First, subscribe to the Store Builder plan ($10/month) from our Store page. Once subscribed, you\'ll have access to all Store Builder features including templates, customization tools, and domain assistance.',
        'Choosing a Template: We offer four professional templates—two for e-commerce and two for service businesses. Preview each template and select the one that best fits your business model and aesthetic preferences.',
        'Branding Your Store: Upload your logo and banner images. Choose your primary brand color to ensure consistency across your store. The customization interface makes it easy to see changes in real-time.',
        'Adding Products or Services: Use the product management tools to add your offerings. Include clear descriptions, high-quality images, and accurate pricing. Organize products into categories for easy navigation.',
        'Domain Setup: Once your store is ready, use our domain purchase assistance to secure your custom domain. We provide links to trusted domain registrars and guidance on connecting your domain to your store.',
        'Launch and Promote: Before launching, preview your store on different devices to ensure it looks great everywhere. Once live, promote your store through social media, email marketing, and other channels.',
        'Ongoing Management: Regularly update your product listings, monitor orders, and engage with customers. Use the analytics tools to track performance and optimize your store for better conversions.',
      ],
    },
    'app-integrations-best-practices': {
      id: 'app-integrations-best-practices',
      title: 'Best Practices for App Integrations',
      date: 'January 29, 2026',
      category: 'Integrations',
      readTime: '6 min read',
      content: [
        'The App Center allows you to connect powerful third-party tools to streamline your business operations. Here\'s how to make the most of integrations.',
        'Understanding App Center: The App Center is your hub for managing all third-party integrations. You can add new apps, configure existing ones, and monitor integration status from a single dashboard.',
        'Choosing the Right Apps: Select integrations that solve specific business problems. Common categories include CRM systems, marketing automation, analytics tools, and communication platforms. Don\'t over-integrate—focus on tools you\'ll actually use.',
        'Setting Up Integrations: Each integration requires specific credentials or webhook URLs. Follow the setup instructions carefully and test the connection before relying on it for critical operations.',
        'Webhook Integrations: For custom integrations, you can add webhook URLs directly. This allows you to connect proprietary systems or specialized tools that aren\'t in our standard catalog.',
        'Monitoring Integration Health: Regularly check the status of your integrations in the App Center. Address any errors promptly to avoid disruptions in your workflow.',
        'Security Considerations: Only integrate apps from trusted sources. Review the permissions each app requests and ensure they align with your security policies. Regularly audit your active integrations.',
        'Maximizing Value: Take time to learn each integrated tool thoroughly. Many apps offer advanced features that can significantly improve your efficiency when used properly.',
      ],
    },
    'sales-funnel-optimization': {
      id: 'sales-funnel-optimization',
      title: 'Optimizing Your Sales Funnels for Maximum Conversion',
      date: 'January 27, 2026',
      category: 'Funnels',
      readTime: '9 min read',
      content: [
        'Sales funnels are critical for converting leads into customers. This guide will help you create and optimize effective funnels.',
        'Understanding Funnels: A sales funnel guides potential customers through stages from awareness to purchase. Our Funnels feature integrates with partner platforms to help you build and manage these customer journeys.',
        'Funnel Stages: Typical stages include awareness (attracting attention), interest (engaging prospects), decision (presenting offers), and action (closing the sale). Each stage requires different content and strategies.',
        'Creating Your First Funnel: Access the Funnels page to configure your funnel partner integration. Once connected, you can create landing pages, email sequences, and conversion paths tailored to your business.',
        'Optimization Strategies: Test different headlines, calls-to-action, and offers. Use A/B testing to identify what resonates with your audience. Small improvements at each stage compound into significant conversion increases.',
        'Tracking Performance: Monitor key metrics like conversion rates at each stage, average time in funnel, and overall ROI. Use this data to identify bottlenecks and opportunities for improvement.',
        'Common Mistakes: Avoid overly complex funnels, unclear value propositions, and neglecting follow-up. Keep your funnels simple, focused, and aligned with customer needs.',
        'Advanced Techniques: Implement retargeting for abandoned carts, create segmented funnels for different customer types, and use automation to nurture leads efficiently.',
      ],
    },
    'business-credit-building': {
      id: 'business-credit-building',
      title: 'Building Business Credit: A Comprehensive Guide',
      date: 'January 24, 2026',
      category: 'Business Credit',
      readTime: '8 min read',
      content: [
        'Building business credit is essential for accessing financing and establishing credibility. Our program makes this process straightforward.',
        'Why Business Credit Matters: Strong business credit allows you to secure loans, negotiate better terms with suppliers, and separate personal and business finances. It\'s a critical asset for any growing business.',
        'Getting Started: Access the Business Credit module in your Startup Dashboard. You\'ll see your current verification status, credit bureau registration status, and overall completion percentage.',
        'Business Verification: The first step is verifying your business entity. This typically involves registering your LLC or corporation, obtaining an EIN, and establishing a business address. Our program guides you through each requirement.',
        'Credit Bureau Registration: Once verified, register with major business credit bureaus (Dun & Bradstreet, Experian Business, Equifax Business). Each bureau has specific requirements—our program provides detailed instructions.',
        'Building Credit History: Start by establishing trade lines with vendors who report to credit bureaus. Pay all bills on time, maintain low credit utilization, and regularly monitor your credit reports.',
        'Monitoring Progress: Track your completion percentage in the dashboard. As you complete milestones, your score improves. The program provides educational content to help you understand each step.',
        'Long-term Strategy: Building strong business credit takes time—typically 6-12 months for initial establishment. Stay consistent, follow best practices, and use credit responsibly to build a strong financial foundation.',
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
          <Button onClick={() => navigate({ to: '/sellers-businesses-blog' })}>
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
          onClick={() => navigate({ to: '/sellers-businesses-blog' })}
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
