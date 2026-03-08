import { Link } from "@tanstack/react-router";
import {
  ExternalLink,
  Heart,
  Lock,
  Mail,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== "undefined"
      ? window.location.hostname
      : "anc-marketplace",
  );

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/assets/generated/anc-logo-transparent.dim_200x200.png"
                alt="ANC Marketplace"
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold text-white text-lg">
                ANC Marketplace
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted platform for buying, selling, and growing your
              business.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="h-4 w-4 shrink-0" />
              <a
                href="mailto:anc.electronics.n.more@gmail.com"
                className="hover:text-white transition-colors"
              >
                anc.electronics.n.more@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/faq/customers"
                  className="hover:text-white transition-colors"
                >
                  Customer FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/blog/customers"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="hover:text-white transition-colors"
                >
                  Apply for Role
                </Link>
              </li>
            </ul>
          </div>

          {/* Sellers & Businesses */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Sellers & Businesses
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faq/sellers-businesses"
                  className="hover:text-white transition-colors"
                >
                  Sellers FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/blog/sellers-businesses"
                  className="hover:text-white transition-colors"
                >
                  Sellers Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/store-builder"
                  className="hover:text-white transition-colors"
                >
                  Store Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/app-center"
                  className="hover:text-white transition-colors"
                >
                  App Center
                </Link>
              </li>
              <li>
                <Link
                  to="/funnels"
                  className="hover:text-white transition-colors"
                >
                  Funnels
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Legal & Security
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns-policy"
                  className="hover:text-white transition-colors"
                >
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace-policy"
                  className="hover:text-white transition-colors"
                >
                  Marketplace Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/pci-compliance"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Shield className="h-3 w-3" />
                  PCI Compliance
                </Link>
              </li>
            </ul>

            {/* Admin / Employee access */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
              <Link
                to="/admin"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Lock className="h-3 w-3" />
                Admin Center
              </Link>
              <Link
                to="/employee-dashboard"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Users className="h-3 w-3" />
                Employee Section
              </Link>
            </div>
          </div>
        </div>

        {/* Payment logos */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Accepted Payments:
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="px-2 py-1 border border-gray-600 rounded text-xs">
                VISA
              </span>
              <span className="px-2 py-1 border border-gray-600 rounded text-xs">
                MC
              </span>
              <span className="px-2 py-1 border border-gray-600 rounded text-xs">
                AMEX
              </span>
              <span className="px-2 py-1 border border-gray-600 rounded text-xs">
                DISCOVER
              </span>
              <span className="px-2 py-1 border border-gray-600 rounded text-xs">
                PayPal
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Payment partner:{" "}
              <span className="text-gray-300 font-medium">Stripe</span>
            </span>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>
              &copy; {year} ANC Electronics N Services. All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Built with{" "}
              <Heart className="h-3 w-3 text-red-500 fill-red-500 mx-0.5" />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
