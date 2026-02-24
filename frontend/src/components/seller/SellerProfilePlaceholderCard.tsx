import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SellerProfilePlaceholderCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

export default function SellerProfilePlaceholderCard({
  icon,
  title,
  description,
  badge = 'Coming Soon',
}: SellerProfilePlaceholderCardProps) {
  return (
    <Card className="border-2 border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100">
              {icon}
            </div>
            <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-slate-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
