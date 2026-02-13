import React from 'react';
import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { SiVisa, SiMastercard, SiAmericanexpress, SiDiscover } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'anc-electronics-n-services'
  );

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal & Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/pci-compliance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  PCI Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">ANC Electronics N More and ANC Marketplace</p>
              <p>EIN: 33-3107359</p>
              <p>Florida DBA G25000056278</p>
              <p className="mt-3">Owner: Angela MW Miller</p>
              <p>Email: <a href="mailto:support@anc-electronics-n-services.net" className="hover:text-primary transition-colors">support@anc-electronics-n-services.net</a></p>
              <p className="text-xs italic">Customer Service is contacted by email.</p>
              <p className="mt-2">Administration: <a href="tel:903-993-7369" className="hover:text-primary transition-colors">903-993-7369</a></p>
              <p className="mt-3">5253 SE 38th St<br />Ocala, FL 34480</p>
            </div>
          </div>

          {/* Payment & Partners */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Payment & Partners</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">We Accept:</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <SiVisa className="h-8 w-12 text-muted-foreground" />
                  <SiMastercard className="h-8 w-12 text-muted-foreground" />
                  <SiAmericanexpress className="h-8 w-12 text-muted-foreground" />
                  <SiDiscover className="h-8 w-12 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Payment Partners:</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Authorize.net</p>
                  <p>Zen dash</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>© {currentYear} ANC Electronics N More</p>
              <p className="hidden md:block">•</p>
              <p>PCI Compliant # 201100278838</p>
            </div>
            <div className="flex items-center gap-1">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
