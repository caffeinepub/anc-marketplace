import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export default function CustomerBlog() {
  const navigate = useNavigate();

  const posts: BlogPost[] = [
    {
      id: 'getting-started-guide',
      title: 'Getting Started with ANC Electronics N Services',
      excerpt: 'Learn how to create your account, browse products, and make your first purchase on our platform. This comprehensive guide walks you through every step of the process.',
      date: 'February 5, 2026',
      category: 'Getting Started',
      readTime: '5 min read',
    },
    {
      id: 'secure-shopping-tips',
      title: '5 Tips for Secure Online Shopping',
      excerpt: 'Discover best practices for safe online shopping, including how to verify secure connections, protect your payment information, and recognize trusted sellers.',
      date: 'February 3, 2026',
      category: 'Security',
      readTime: '4 min read',
    },
    {
      id: 'product-quality-guide',
      title: 'How to Choose Quality Electronics',
      excerpt: 'A comprehensive guide to evaluating electronics before purchase. Learn about specifications, warranties, and what to look for in quality products.',
      date: 'January 30, 2026',
      category: 'Shopping Tips',
      readTime: '6 min read',
    },
    {
      id: 'subscription-benefits',
      title: 'Understanding Subscription Plans and Their Benefits',
      excerpt: 'Explore the different subscription options available on our platform and discover which plan is right for you. Learn about exclusive benefits and savings.',
      date: 'January 28, 2026',
      category: 'Subscriptions',
      readTime: '5 min read',
    },
    {
      id: 'customer-support-guide',
      title: 'Making the Most of Customer Support',
      excerpt: 'Learn how to get help when you need it, track your orders, and resolve issues quickly. Our customer support team is here to ensure your satisfaction.',
      date: 'January 25, 2026',
      category: 'Support',
      readTime: '3 min read',
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Customer Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips, guides, and insights to help you make the most of your shopping experience.
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
                  onClick={() => navigate({ to: `/customer-blog/${post.id}` })}
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
