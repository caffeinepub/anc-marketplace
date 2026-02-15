import React from 'react';

interface AdminConsoleLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AdminConsoleLayout({ title, subtitle, children }: AdminConsoleLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h1>
          {subtitle && <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
