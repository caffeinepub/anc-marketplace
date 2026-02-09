import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Briefcase } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export default function SellersBusinessesBlog() {
  const navigate = useNavigate();

  const posts: BlogPost[] = [
    {
      id: 'b2b-dashboard-guide',
      title: 'Maximizing Your B2B Dashboard for Business Growth',
      excerpt: 'Discover how to leverage the B2B Dashboard features to manage projects, track clients, and analyze your business performance effectively.',
      date: 'February 6, 2026',
      category: 'B2B Services',
      readTime: '7 min read',
    },
    {
      id: 'startup-program-success',
      title: 'Success Stories from the ANC Apprentice Program',
      excerpt: 'Read inspiring stories from entrepreneurs who launched successful businesses through our startup assistance program. Learn from their experiences and strategies.',
      date: 'February 4, 2026',
      category: 'Startup Program',
      readTime: '8 min read',
    },
    {
      id: 'store-builder-tutorial',
      title: 'Building Your Online Store: A Complete Tutorial',
      excerpt: 'Step-by-step guide to creating a professional online store using our Store Builder. From template selection to branding and launch.',
      date: 'February 1, 2026',
      category: 'Store Builder',
      readTime: '10 min read',
    },
    {
      id: 'app-integrations-best-practices',
      title: 'Best Practices for App Integrations',
      excerpt: 'Learn how to connect and manage third-party apps through the App Center. Optimize your workflow with the right integrations for your business.',
      date: 'January 29, 2026',
      category: 'Integrations',
      readTime: '6 min read',
    },
    {
      id: 'sales-funnel-optimization',
      title: 'Optimizing Your Sales Funnels for Maximum Conversion',
      excerpt: 'Master the art of creating effective sales funnels. Discover strategies to convert more leads into customers and grow your revenue.',
      date: 'January 27, 2026',
      category: 'Funnels',
      readTime: '9 min read',
    },
    {
      id: 'business-credit-building',
      title: 'Building Business Credit: A Comprehensive Guide',
      excerpt: 'Learn how to establish and build your business credit through our program. Understand credit bureaus, verification processes, and best practices.',
      date: 'January 24, 2026',
      category: 'Business Credit',
      readTime: '8 min read',
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Sellers & Businesses Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert insights, tutorials, and strategies to help your business thrive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <Button
                  variant="ghost"
                  className="w-full justify-between group"
                  onClick={() => navigate({ to: `/sellers-businesses-blog/${post.id}` })}
                >
                  Read More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
