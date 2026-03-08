import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center justify-center text-center px-4 py-20"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-business.dim_1200x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Our mission is your success
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            ANC Marketplace connects sellers, businesses, and customers on a
            powerful platform built for growth. Start selling, buying, or
            building your business today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base font-semibold">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base font-semibold bg-white/10 border-white text-white hover:bg-white/20"
            >
              <Link to="/faq/customers">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From selling products to building your brand, ANC Marketplace
              provides all the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShoppingBag,
                title: "Free Marketplace Access",
                description:
                  "List and sell your products with no monthly fees. Only pay a small $5 service fee per sale.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: TrendingUp,
                title: "Business Growth Tools",
                description:
                  "Access funnels, analytics, and marketing tools to scale your business faster.",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Users,
                title: "B2B Services",
                description:
                  "Connect with other businesses for partnerships, bulk orders, and collaborative opportunities.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description:
                  "PCI-compliant payment processing powered by Stripe. Your transactions are always protected.",
                color: "text-red-600",
                bg: "bg-red-50",
              },
              {
                icon: Zap,
                title: "Startup Program",
                description:
                  "Get access to lessons, virtual meetings, and business credit building resources.",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                icon: Globe,
                title: "Store Builder",
                description:
                  "Upgrade to a standalone website or app for just $10/month with our Store Builder.",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="border border-border hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div
                    className={`inline-flex p-3 rounded-lg ${feature.bg} mb-4`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mb-10">
            No hidden fees. No monthly subscriptions required to sell.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <span className="font-bold text-primary text-sm uppercase tracking-wider">
                    Free Marketplace
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-foreground mb-1">
                  $0
                </div>
                <div className="text-muted-foreground text-sm mb-6">
                  per month + $5 per sale
                </div>
                <ul className="space-y-3 text-sm text-left mb-6">
                  {[
                    "List unlimited products",
                    "Access to all marketplace features",
                    "Secure Stripe payments",
                    "Customer management tools",
                    "$5 service fee per completed sale",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  <Link to="/register">Start Selling Free</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-yellow-600 text-sm uppercase tracking-wider">
                    Store Builder
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-foreground mb-1">
                  $10
                </div>
                <div className="text-muted-foreground text-sm mb-6">
                  per month (optional upgrade)
                </div>
                <ul className="space-y-3 text-sm text-left mb-6">
                  {[
                    "Everything in Free Marketplace",
                    "Standalone website conversion",
                    "Mobile app builder",
                    "Custom domain support",
                    "Advanced branding tools",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/store-builder">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Join ANC Marketplace today and start reaching more customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="font-semibold"
            >
              <Link to="/register">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/faq/customers">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
