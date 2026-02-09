/**
 * Centralized pricing model copy for ANC Electronics N Services
 * 
 * Pricing Model:
 * - Free access to list and sell products/services on the marketplace
 * - $5 service fee per sale (charged to sellers)
 * - $10/month subscription only for converting to standalone website/app (Store Builder)
 */

export const PRICING_MODEL = {
  // Core pricing structure
  marketplaceAccess: 'Free',
  serviceFeePerSale: '$5',
  standaloneWebsiteSubscription: '$10/month',
  
  // User-facing copy
  shortDescription: 'Free to list and sell. $5 service fee per sale. $10/month only for standalone website/app conversion.',
  
  detailedDescription: 'Store access and service access are completely free. We only charge a $5 service fee per sale. There is no monthly bill unless you convert your online store or service profile into a standalone website or app, which costs $10/month.',
  
  marketplaceBenefit: 'Start selling immediately with no upfront costs or monthly fees.',
  
  serviceFeeBenefit: 'Only pay when you make a sale - no monthly bills to worry about.',
  
  standaloneWebsiteBenefit: 'Upgrade to a custom branded website or app for just $10/month.',
  
  // FAQ answers
  faqMarketplaceCost: 'Listing products and services on the ANC marketplace is completely free. You only pay a $5 service fee when you make a sale.',
  
  faqMonthlyFees: 'There are no monthly fees for using the marketplace. The only monthly charge is $10/month if you choose to convert your store or service profile into a standalone website or app using our Store Builder.',
  
  faqServiceFee: 'We charge a flat $5 service fee per sale. This fee is automatically calculated at checkout and helps us maintain the platform and provide support.',
};

export const STORE_BUILDER_PRICING = {
  monthlyPrice: 10.00,
  description: 'Convert your marketplace store into a standalone website or app',
  features: [
    'Custom branded website',
    'Professional templates',
    'Full branding customization',
    'Domain purchase assistance',
    'No marketplace service fees on your standalone site',
  ],
};
