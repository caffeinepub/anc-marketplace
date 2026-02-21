import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Settings,
  Users,
  UserPlus,
  Activity,
  Store,
  FileText,
  DollarSign,
  CreditCard,
  Headphones,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDropdownMenu() {
  const handleMenuClick = (itemName: string) => {
    toast.info(`${itemName} - Coming Soon`, {
      description: 'This feature is currently under development and will be available soon.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Admin Actions
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white border-2 border-menu-border shadow-menu">
        <DropdownMenuLabel>User Management</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('Assign Roles')}
          >
            <Users className="h-4 w-4 mr-2" />
            Assign Roles
          </DropdownMenuItem>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('Review Employees')}
          >
            <Users className="h-4 w-4 mr-2" />
            Review Employees
          </DropdownMenuItem>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('Hire Employee')}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Hire Employee
          </DropdownMenuItem>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('User Accounts')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            User Accounts
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Marketplace Oversight</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('View Marketplace Activity')}
          >
            <Activity className="h-4 w-4 mr-2" />
            View Marketplace Activity
          </DropdownMenuItem>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('Review Seller Activities')}
          >
            <Store className="h-4 w-4 mr-2" />
            Review Seller Activities
          </DropdownMenuItem>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('Manage Applications')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Manage Applications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Financial & Reports</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('Financial Reports')}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Financial Reports
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>System</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('System Settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="menu-item cursor-pointer"
            onClick={() => handleMenuClick('Support Tools')}
          >
            <Headphones className="h-4 w-4 mr-2" />
            Support Tools
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
