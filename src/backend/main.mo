import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";



actor {
  include MixinStorage();

  public type PolicyIdentifier = {
    #privacy;
    #shipping;
    #returns;
    #terms;
    #marketplaceWide; // New variant for marketplace-wide policy
  };

  public type PolicyVersion = {
    policyIdentifier : PolicyIdentifier;
    version : Text;
    lastUpdated : Int;
  };

  public type PolicySignatureRecord = {
    policyIdentifier : PolicyIdentifier;
    policyVersion : Text;
    signerName : Text;
    signature : Text;
    timestamp : Int;
  };

  public type ShoppingItem = Stripe.ShoppingItem;

  public type AccessRole = {
    #guest;
    #startUpMember;
    #b2bMember;
  };

  public type UserRoleSummary = {
    adminCount : Nat;
    userCount : Nat;
    guestCount : Nat;
  };

  public type UserProfile = {
    email : Text;
    fullName : Text;
    activeRole : AccessRole;
    subscriptionId : ?Text;
    accountCreated : Int;
  };

  public type PaymentStatus = {
    #initialized;
    #pending;
    #successful;
    #failed;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    image : ?Text;
    inStock : Nat;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      product1.id.compare(product2.id);
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.priceCents, product2.priceCents);
    };
  };

  public type OrderStatus = {
    #pending;
    #inProgress;
    #completed;
    #cancelled;
  };

  module OrderStatus {
    public func compare(a : OrderStatus, b : OrderStatus) : Order.Order {
      switch (a, b) {
        case (#pending, #pending) { #equal };
        case (#pending, _) { #less };
        case (#inProgress, #pending) { #greater };
        case (#inProgress, #inProgress) { #equal };
        case (#inProgress, _) { #less };
        case (#completed, #cancelled) { #less };
        case (#completed, #completed) { #equal };
        case (_, _) { #greater };
      };
    };
  };

  public type EcomOrder = {
    orderId : Text;
    products : [Text];
    totalAmount : Nat;
    status : OrderStatus;
    customerPrincipal : ?Principal;
  };

  module EcomOrder {
    public func compare(order1 : EcomOrder, order2 : EcomOrder) : Order.Order {
      switch (OrderStatus.compare(order1.status, order2.status)) {
        case (#equal) { order1.orderId.compare(order2.orderId) };
        case (order) { order };
      };
    };
  };

  public type Lesson = {
    id : Text;
    title : Text;
    description : Text;
    content : Text;
    videoLink : ?Text;
  };

  public type VirtualMeeting = {
    id : Text;
    title : Text;
    description : Text;
    meetingLink : Text;
    scheduledTime : Int;
  };

  public type Activity = {
    id : Text;
    title : Text;
    description : Text;
    resourceLink : Text;
    isCompleted : Bool;
  };

  public type EducationalContent = {
    lessons : [Lesson];
    virtualMeetings : [VirtualMeeting];
    activities : [Activity];
  };

  public type BusinessCreditData = {
    businessVerificationStatus : Text;
    creditBureauRegistrationStatus : Text;
    completionPercentage : Float;
  };

  public type StartupProgramData = {
    educationalContent : EducationalContent;
    businessCredit : BusinessCreditData;
  };

  public type ShoppingCart = {
    products : [Text];
  };

  public type DropshippingPartner = {
    id : Text;
    name : Text;
    apiUrl : Text;
    apiKey : Text;
    connectionStatus : { #connected; #disconnected };
    healthMetrics : {
      successfulSyncs : Nat;
      failedSyncs : Nat;
      lastSyncTime : ?Int;
      uptimePercent : Float;
    };
  };

  public type AppIntegration = {
    id : Text;
    name : Text;
    category : Text;
    description : Text;
    apiCredentials : Text;
    isActive : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type B2BService = {
    id : Text;
    name : Text;
    category : Text;
    description : Text;
    pricingModel : Text;
    isActive : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type UserWithRole = {
    principal : Principal;
    profile : UserProfile;
    systemRole : AccessControl.UserRole;
  };

  public type AppIntegrationRecord = {
    id : Text;
    name : Text;
    description : Text;
    webhookUrl : Text;
    iconUrl : Text;
    status : { #active; #inactive; #error; #syncing };
    createdAt : Int;
    updatedAt : Int;
  };

  public type FunnelPartner = {
    partnerName : Text;
    signupLink : Text;
    profileLink : Text;
  };

  public type StoreTemplate = {
    id : Text;
    name : Text;
    description : Text;
    previewImage : Text;
    type_ : { #ecommerce; #service };
  };

  public type BrandingAsset = {
    id : Text;
    url : Text;
    type_ : AssetType;
  };

  public type AssetType = {
    #logo;
    #productImage;
    #banner;
    #icon;
    #document;
  };

  public type StoreCustomization = {
    brandName : Text;
    tagline : Text;
    primaryColor : Text;
    assets : [BrandingAsset];
  };

  public type StoreBuilderConfig = {
    subscriptionActive : Bool;
    selectedTemplateId : ?Text;
    customization : StoreCustomization;
    domainPurchaseLink : ?Text;
  };

  public type AssistantKnowledgeEntry = {
    id : Text;
    question : Text;
    answer : Text;
    category : Text;
    lastUpdated : Int;
    isActive : Bool;
    usageCount : Nat;
    isBusinessOps : Bool;
  };

  public type UnansweredQuestion = {
    id : Text;
    question : Text;
    categorySuggestion : Text;
    creationTime : Int;
    interactionCount : Nat;
  };

  public type AffiliatePayoutPreference = {
    #paypal : Text;
    #cashapp : Text;
  };

  public type Affiliate = {
    id : Text;
    name : Text;
    email : Text;
    payoutPreference : AffiliatePayoutPreference;
    commissionRate : Float;
    successfulReferrals : Nat;
    lifetimeRecurringCommission : Bool;
    recurringBonusClaimed : Nat;
    commissionBalanceCents : Nat;
    totalEarningsCents : Nat;
    lastUpdated : Int;
  };

  public type AffiliatePayoutRecord = {
    id : Text;
    affiliateId : Text;
    amountCents : Nat;
    payoutPreference : AffiliatePayoutPreference;
    createdAt : Int;
    processed : Bool;
    processingDate : ?Int;
  };

  public type AdminPageSection = {
    #businessDetails;
    #marketplace;
    #assistants;
    #b2b;
    #affiliate;
    #funding;
    #startups;
  };

  public type AdminPageStatusDetails = {
    version : Text;
    notes : Text;
  };

  public type AdminPageSectionStatus = {
    section : AdminPageSection;
    status : { #inProgress; #comingSoon; #completed };
    details : ?AdminPageStatusDetails;
  };

  public type MarketplaceRoadmap = {
    roadmapId : Text;
    name : Text;
    progressPercentage : Nat;
    completed : Bool;
    lastUpdated : Int;
    notes : Text;
  };

  public type AdminDashboardData = {
    adminSections : [AdminPageSectionStatus];
    marketplaceRoadmap : [MarketplaceRoadmap];
  };

  public type AssistantCategory = {
    #general;
    #ecommerce;
    #startupProgram;
    #b2b;
    #marketingTools;
    #affiliateProgram;
  };

  public type SellerPayoutProfile = {
    sellerPrincipal : Principal;
    designatedPayoutAccount : Text;
    internalBalanceCents : Nat; // Held funds
    createdAt : Int;
    lastUpdated : Int;
  };

  public type PayoutTransferStatus = {
    #pending;
    #processed;
    #failed;
  };

  public type SellerPayoutTransferRecord = {
    id : Text;
    sellerPrincipal : Principal;
    amountCents : Nat;
    payoutAccount : Text;
    status : PayoutTransferStatus;
    createdAt : Int;
    processedAt : ?Int;
    errorMessage : ?Text;
  };

  public type AccountAssignment = {
    sellerPrincipal : Principal;
    accountNumber : Text;
    createdAt : Int;
    active : Bool;
  };

  public type DebitCardRequestStatus = {
    #draft;
    #submitted;
    #under_review;
    #approved;
    #rejected;
  };

  public type BusinessDebitCardRequest = {
    id : Text;
    sellerPrincipal : Principal;
    businessName : Text;
    requestStatus : DebitCardRequestStatus;
    submissionTimestamp : Int;
    reviewTimestamp : ?Int;
    approvalTimestamp : ?Int;
    rejectionTimestamp : ?Int;
  };

  public type CreditCardApplicationStatus = {
    #draft;
    #submitted;
    #under_review;
    #approved;
    #rejected;
  };

  public type BusinessCreditCardApplication = {
    id : Text;
    sellerPrincipal : Principal;
    businessName : Text;
    applicationStatus : CreditCardApplicationStatus;
    submissionTimestamp : Int;
    reviewTimestamp : ?Int;
    approvalTimestamp : ?Int;
    rejectionTimestamp : ?Int;
  };

  public type CreditAccount = {
    creditLimitCents : Nat;
    usedAmountCents : Nat;
  };

  public type AdminFinancialState = {
    availableFundsCents : Nat;
    creditAccount : CreditAccount;
  };

  let accessControlState = AccessControl.initState();

  let userStore = Map.empty<Principal, UserProfile>();
  let storeBuilderConfigStore = Map.empty<Principal, StoreBuilderConfig>();
  var globalDomainPurchaseLink : ?Text = null;
  let productStore = Map.empty<Text, Product>();
  let cartStore = Map.empty<Principal, ShoppingCart>();
  let orderStore = Map.empty<Text, EcomOrder>();
  let startupProgramStore = Map.empty<Principal, StartupProgramData>();
  let dropshippingPartners = Map.empty<Text, DropshippingPartner>();
  let appIntegrations = Map.empty<Text, AppIntegration>();
  let b2bServices = Map.empty<Text, B2BService>();
  let appIntegrationStore = Map.empty<Text, AppIntegrationRecord>();
  let affiliateStore = Map.empty<Text, Affiliate>();
  let affiliatePayoutStore = Map.empty<Text, AffiliatePayoutRecord>();
  let policySignaturesByUser = Map.empty<Principal, List.List<PolicySignatureRecord>>();

  let sellerPayoutProfiles = Map.empty<Principal, SellerPayoutProfile>();
  let payoutAccountAssignments = Map.empty<Principal, AccountAssignment>();
  let sellerPayoutTransfers = Map.empty<Text, SellerPayoutTransferRecord>();

  let debitCardRequests = Map.empty<Text, BusinessDebitCardRequest>();
  let creditCardApplications = Map.empty<Text, BusinessCreditCardApplication>();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;
  var ownerPrincipal : ?Principal = null;
  var saleServiceFee : Nat = 500; // $5 fee represented in cents
  var merchantFunnelPartner : FunnelPartner = {
    partnerName = "ClickFunnels";
    signupLink = "https://clickfunnels.com/signup-flow?aff=anc_marketplace_sellers";
    profileLink = "https://app.clickfunnels.com/my-profile";
  };

  let knowledgeBase = Map.empty<Text, AssistantKnowledgeEntry>();
  let unansweredQuestions = Map.empty<Text, UnansweredQuestion>();

  // New persistent state for admin financial data
  var adminFinancialState : AdminFinancialState = {
    availableFundsCents = 702598; // $7,025.98 initial
    creditAccount = {
      creditLimitCents = 10_000_00; // $10,000.00 initial
      usedAmountCents = 0;
    };
  };

  let adminSections : [AdminPageSectionStatus] = [
    {
      section = #businessDetails;
      status = #inProgress;
      details = ?{
        version = "1.0";
        notes = "Due to legal requirements, this section is not completed";
      };
    },
    {
      section = #marketplace;
      status = #inProgress;
      details = ?{
        version = "1.0";
        notes = "Functionality for more than one store must be added";
      };
    },
    {
      section = #assistants;
      status = #comingSoon;
      details = ?{
        version = "1.0";
        notes = "Currently not available in this version";
      };
    },
    {
      section = #b2b;
      status = #comingSoon;
      details = ?{
        version = "1.0";
        notes = "Currently not available in this version";
      };
    },
    {
      section = #affiliate;
      status = #comingSoon;
      details = ?{
        version = "1.0";
        notes = "Currently not available in this version";
      };
    },
    {
      section = #funding;
      status = #comingSoon;
      details = ?{
        version = "1.0";
        notes = "Currently not available in this version";
      };
    },
    {
      section = #startups;
      status = #comingSoon;
      details = ?{
        version = "1.0";
        notes = "Currently not available in this version";
      };
    },
  ];

  let marketplaceInitRoadmap = [
    {
      roadmapId = "profiles-menus";
      name = "1. Profiles + menus";
      progressPercentage = 90;
      completed = false;
      lastUpdated = Time.now();
      notes = "Profiles + menus upgrade 90% done";
    },
    {
      roadmapId = "sellers-items";
      name = "2. Sellers + items";
      progressPercentage = 70;
      completed = false;
      lastUpdated = Time.now();
      notes = "Estimated 70% done, requires multi admin + payments first";
    },
    {
      roadmapId = "orders-tracking";
      name = "3. Orders + tracking";
      progressPercentage = 50;
      completed = false;
      lastUpdated = Time.now();
      notes = "Estimated to be 50% done, requires multi-user stores";
    },
    {
      roadmapId = "ai-personalization";
      name = "4. AI personalization";
      progressPercentage = 20;
      completed = false;
      lastUpdated = Time.now();
      notes = "Estimated 20% done, no current timeline";
    },
    {
      roadmapId = "payments";
      name = "5. Payments";
      progressPercentage = 100;
      completed = true;
      lastUpdated = Time.now();
      notes = "100% done, will be optimized";
    },
  ];

  let marketplaceRoadmap = Map.empty<Text, MarketplaceRoadmap>();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
    await updateMarketplaceRoadmap();
    initSeededKnowledge();
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userStore.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userStore.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userStore.add(caller, profile);
  };

  public shared ({ caller }) func setOwnerPrincipal() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set owner principal");
    };
    ownerPrincipal := ?caller;
    await updateMarketplaceRoadmap();
    initSeededKnowledge();
  };

  public shared ({ caller }) func updateAdminDashboardData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update dashboard data");
    };
    await updateMarketplaceRoadmap();
  };

  public query ({ caller }) func getUserRoleSummary() : async UserRoleSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user roles");
    };

    var adminCount = 0;
    var userCount = 0;
    var guestCount = 0;

    let allUsers = userStore.values().toArray();

    for (user in allUsers.values()) {
      switch (user.activeRole) {
        case (#guest) { guestCount += 1 };
        case (#startUpMember) { userCount += 1 };
        case (#b2bMember) { userCount += 1 };
      };
    };

    {
      adminCount;
      userCount;
      guestCount;
    };
  };

  public shared ({ caller }) func assignRole(user : Principal, role : AccessControl.UserRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public shared ({ caller }) func updateMarketplaceRoadmap() : async () {
    marketplaceRoadmap.clear();

    for (initEntry in marketplaceInitRoadmap.values()) {
      marketplaceRoadmap.add(initEntry.roadmapId, {
        initEntry with progressPercentage = 100;
        completed = true;
        notes = initEntry.name # " - stable features coming soon";
        lastUpdated = Time.now();
      });
    };

    for (initEntry in marketplaceInitRoadmap.values()) {
      marketplaceRoadmap.add(initEntry.roadmapId, initEntry);
    };
  };

  public query ({ caller }) func getAdminDashboardData() : async AdminDashboardData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access dashboard data");
    };
    getAdminDashboardDataInternal();
  };

  func getAdminDashboardDataInternal() : AdminDashboardData {
    {
      adminSections : [AdminPageSectionStatus] = Array.tabulate<AdminPageSectionStatus>(
        adminSections.size(),
        func(i) { adminSections[i] },
      );
      marketplaceRoadmap = marketplaceRoadmap.values().toArray();
    };
  };

  func initSeededKnowledge() {
    if (knowledgeBase.isEmpty()) {
      let generalEntries = [
        {
          id = "anc_general_info";
          question = "What is ANC Marketplace?";
          answer = "ANC Marketplace is a digital transformation platform offering a suite of business solutions including e-commerce, startup assistance, B2B services, and educational content for entrepreneurs and businesses. ANC was established in Texas and now operates in both Texas and Georgia. ANC Electronics N Services is a store within ANC Marketplace, specializing in business and industrial products leveraging dropshipping for nationwide distribution.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
        {
          id = "anc_veteran_support";
          question = "Does ANC support veterans?";
          answer = "Yes, ANC is veteran-owned and actively supports veterans through specialized programs, discounts, and educational initiatives tailored to their entrepreneurial needs.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
        {
          id = "anc_women_family_owned";
          question = "Is ANC women or family owned?";
          answer = "ANC is a family-run business with significant female leadership and active support for women entrepreneurs through dedicated resources and support programs.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
        {
          id = "anc_contacts";
          question = "How does ANC handle seller funds and payments?";
          answer = "ANC temporarily holds seller funds in an internal ledger until they are transferred to the seller’s designated payout account. Copyright for all products remains with the sellers and service providers. All digital and physical products are sold and delivered by independent merchants. Customers should contact the merchant for product-related guarantees and returns. ANC can be contacted at ancelectronicsnservices@gmail.com regarding any issues, and service fees will be refunded accordingly if necessary.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
        {
          id = "anc_pci_compliance";
          question = "Is ANC PCI DSS compliant?";
          answer = "ANC is committed to maintaining compliance with the PCI Data Security Standard (PCI DSS) for secure payment processing. All transactions are handled through trusted third-party payment providers, and no sensitive payment data is stored on ANC servers.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
      ];

      let ecommerceEntries = [
        {
          id = "anc_ecommerce";
          question = "What ecommerce services does ANC offer?";
          answer = "ANC offers a suite of ecommerce solutions including store builder templates, product catalog management, payment processing, and dropshipping partnerships with third-party suppliers.";
          category = "Ecommerce";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
        {
          id = "anc_marketplace_pricing";
          question = "What is ANC's marketplace pricing model?";
          answer = "Store access and service access are free; the charge is a $5 service fee per sale. There is no monthly bill unless the user converts their online store/service profile into a standalone website or app, which costs $10/month.";
          category = "Ecommerce";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
      ];

      let marketingEntries = [
        {
          id = "anc_marketing_platforms";
          question = "What marketing platforms does ANC support?";
          answer = "ANC supports the integration of store and advertising platforms using advanced digital products, such as AI video services and training, as a core part of the business. This enables companies to run their entire business and brand on the Internet Computer blockchain.";
          category = "Marketing";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
      ];

      let startupEntries = [
        {
          id = "anc_apprentice_program";
          question = "What is the ANC Apprentice Program Center?";
          answer = "The ANC Apprentice Program Center provides a comprehensive startup assistance program including educational content, virtual meetings, activities, and business credit building resources. It serves as a dedicated learning and development hub for entrepreneurs.";
          category = "Startup Program";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = false;
        },
      ];

      // Add business-operations-focused knowledge entries
      let businessOpsEntries = [
        // Funnel generation/setup
        {
          id = "funnel_guidance";
          question = "How do I set up a marketing funnel using the platform?";
          answer = "Follow these steps: (1) Sign up with ClickFunnels using our partner link; (2) Choose a funnel template aligned with your goals; (3) Customize the funnel within the ClickFunnels dashboard; (4) Integrate the funnel with your ANC storefront or offer links in the dashboard. Our business consultants are available for personalized guidance - contact us to schedule a session.";
          category = "Business Operations";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = true;
        },
        {
          id = "business_reports_guidance";
          question = "What's the app's current capability for generating business reports?";
          answer = "The app doesn't currently generate reports. Reports should be handled as an export through Stripe and/or ClickFunnels, with integration on the product and admin dashboard roadmap moving forward.";
          category = "Business Operations";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = true;
        },
        {
          id = "employee_onboarding_guidance";
          question = "Can the app support employee and seller onboarding?";
          answer = "Onboarding is available only as a business consultancy service through our company. Contact us to schedule a session for personalized onboarding assistance.";
          category = "Business Operations";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = true;
        },
        {
          id = "external_advertising_guidance";
          question = "Does the app support external advertising?";
          answer = "The app does not support advertising directly. However, your business can be promoted in-app. Contact us to discuss advertising opportunities within our app.";
          category = "Business Operations";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = true;
        },
        {
          id = "business_ops_consulting";
          question = "What support does ANC offer for business operations?";
          answer = "ANC provides business consulting services covering strategy, marketing, financial planning, and operations optimization. Our expert consultants offer both individual and group consulting packages tailored to your specific needs. Contact us to schedule an introductory meeting and discuss how we can help you achieve your business goals.";
          category = "Business Operations";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = true;
        },
        {
          id = "feature_request_process";
          question = "What is the process for requesting new features or submitting feedback?";
          answer = "We encourage users to submit feature requests and feedback through the app's contact form or by emailing ancelectronicsnservices@gmail.com. Our development team reviews all submissions and prioritizes them based on demand and strategic goals.";
          category = "Business Operations";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
          isBusinessOps = true;
        },
      ];

      // Manually add all entries
      for (entry in generalEntries.values()) {
        knowledgeBase.add(entry.id, entry);
      };
      for (entry in ecommerceEntries.values()) {
        knowledgeBase.add(entry.id, entry);
      };
      for (entry in marketingEntries.values()) {
        knowledgeBase.add(entry.id, entry);
      };
      for (entry in startupEntries.values()) {
        knowledgeBase.add(entry.id, entry);
      };
      // Add business-operations-focused entries
      for (entry in businessOpsEntries.values()) {
        knowledgeBase.add(entry.id, entry);
      };
    };
  };

  public shared ({ caller }) func signPolicy(policyRecord : PolicySignatureRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can sign policies");
    };

    // Get current policy signatures for user or create new empty list
    let currentSignatures : List.List<PolicySignatureRecord> = switch (policySignaturesByUser.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<PolicySignatureRecord>() };
    };

    // Check if user already signed this policy version
    switch (currentSignatures.find(func(record) { record.policyIdentifier == policyRecord.policyIdentifier and record.policyVersion == policyRecord.policyVersion })) {
      case (?_) { Runtime.trap("Policy already signed") };
      case (null) {
        currentSignatures.add(policyRecord);
        policySignaturesByUser.add(caller, currentSignatures);
      };
    };
  };

  public query ({ caller }) func getSignatureByPolicy(policyIdentifier : PolicyIdentifier) : async ?PolicySignatureRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access policy signatures");
    };
    let currentSignatures : List.List<PolicySignatureRecord> = switch (policySignaturesByUser.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<PolicySignatureRecord>() };
    };
    currentSignatures.find(func(record) { record.policyIdentifier == policyIdentifier });
  };

  public query ({ caller }) func verifyPolicySignature(policyIdentifier : PolicyIdentifier, policyVersion : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can verify policy signatures");
    };
    let currentSignatures : List.List<PolicySignatureRecord> = switch (policySignaturesByUser.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<PolicySignatureRecord>() };
    };

    let matchingSignature = currentSignatures.find(func(record) { record.policyIdentifier == policyIdentifier and record.policyVersion == policyVersion });
    switch (matchingSignature) {
      case (null) { false };
      case (?_) { true };
    };
  };

  // Public read access - no authorization needed (guests can view)
  public query ({ caller }) func getAssistantKnowledgeBase() : async [AssistantKnowledgeEntry] {
    let values = knowledgeBase.values().toArray();
    values;
  };

  // Public read access - no authorization needed (guests can view)
  public query ({ caller }) func getActiveKnowledgeByCategory(category : Text) : async [AssistantKnowledgeEntry] {
    let filteredEntries = List.empty<AssistantKnowledgeEntry>();

    for ((_, entry) in knowledgeBase.entries()) {
      if (entry.category.toLower() == category.toLower() and entry.isActive) {
        filteredEntries.add(entry);
      };
    };

    filteredEntries.toArray();
  };

  func calculateSimilarity(question1 : Text, question2 : Text) : Float {
    if (question1 == question2) { return 1.0 };

    let words1 = question1.toArray().toText().split(#char(' ')).toArray();
    let words2 = question2.toArray().toText().split(#char(' ')).toArray();

    if (words1.size() == 0 or words2.size() == 0) { return 0.0 };

    func wordMatches(word1 : Text) : Bool {
      words2.any(func(word2) { word1 == word2 });
    };

    let commonWordsCount = words1.foldLeft(
      0,
      func(acc, word) {
        if (wordMatches(word)) { acc + 1 } else { acc };
      },
    );

    let totalWords = Nat.max(words1.size(), words2.size());

    if (totalWords == 0) {
      0.0;
    } else {
      let similarity = commonWordsCount.toFloat() / totalWords.toFloat();
      similarity;
    };
  };

  func getBestMatchingAnswer(question : Text, category : Text) : ?AssistantKnowledgeEntry {
    let categoryLower = category.toLower();
    var bestMatch : ?AssistantKnowledgeEntry = null;
    var bestScore : Float = 0.0;

    for ((_, entry) in knowledgeBase.entries()) {
      if (entry.category.toLower().startsWith(#text(categoryLower))) {
        let score = calculateSimilarity(question, entry.question);
        if (score > bestScore and score > 0.5) {
          bestMatch := ?entry;
          bestScore := score;
        };
      };
    };

    bestMatch;
  };

  // Public access - no authorization needed (guests can ask questions)
  public query ({ caller }) func askAssistant(question : Text, category : Text) : async ?Text {
    let normalizedQuestion = question.toLower();

    let bestMatch = getBestMatchingAnswer(normalizedQuestion, category);

    switch (bestMatch) {
      case (null) {
        addUnansweredQuestion(normalizedQuestion, category);
        null;
      };
      case (?matchingEntry) {
        ?matchingEntry.answer;
      };
    };
  };

  func addUnansweredQuestion(question : Text, category : Text) {
    let id = Time.now().toText() # "_" # category;
    let unansweredQuestion : UnansweredQuestion = {
      id;
      question;
      categorySuggestion = category;
      creationTime = Time.now();
      interactionCount = 1;
    };

    unansweredQuestions.add(id, unansweredQuestion);
  };

  // Admin-only access - contains sensitive data
  public query ({ caller }) func getUnansweredQuestions() : async [UnansweredQuestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view unanswered questions");
    };
    unansweredQuestions.values().toArray();
  };

  public shared ({ caller }) func updateKnowledgeEntry(id : Text, newAnswer : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update knowledge entries");
    };
    switch (knowledgeBase.get(id)) {
      case (null) {
        Runtime.trap("Knowledge entry not found");
      };
      case (?entry) {
        let updatedEntry = {
          entry with
          lastUpdated = Time.now();
          answer = newAnswer;
        };
        knowledgeBase.add(id, updatedEntry);
      };
    };
  };

  public shared ({ caller }) func addKnowledgeEntry(entry : AssistantKnowledgeEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add knowledge entries");
    };
    knowledgeBase.add(entry.id, entry);
  };

  // User-only access - requires authentication to submit questions
  public shared ({ caller }) func submitBusinessOpsQuestion(question : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit business operations questions");
    };
    addUnansweredQuestion(question, "Business Operations");
  };

  // Stripe Integration
  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Public access - funnel partners are marketing information accessible to all
  public query ({ caller }) func getFunnelPartner() : async FunnelPartner {
    merchantFunnelPartner;
  };

  public shared ({ caller }) func updateFunnelPartner(partner : FunnelPartner) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update funnel partners");
    };
    merchantFunnelPartner := partner;
  };

  // Seller Payout Profile Management

  public shared ({ caller }) func createOrUpdatePayoutProfile(payoutAccount : Text) : async SellerPayoutProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create payout profiles");
    };

    let newProfile : SellerPayoutProfile = {
      sellerPrincipal = caller;
      designatedPayoutAccount = payoutAccount;
      internalBalanceCents = 0;
      createdAt = Time.now();
      lastUpdated = Time.now();
    };

    sellerPayoutProfiles.add(caller, newProfile);
    newProfile;
  };

  public query ({ caller }) func getPayoutProfile() : async ?SellerPayoutProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access payout profiles");
    };
    sellerPayoutProfiles.get(caller);
  };

  public shared ({ caller }) func recordCredit(amountCents : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record credits");
    };

    switch (sellerPayoutProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Payout profile not found. Please create one first.");
      };
      case (?profile) {
        let updatedProfile = {
          profile with
          internalBalanceCents = profile.internalBalanceCents + amountCents;
          lastUpdated = Time.now();
        };
        sellerPayoutProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func recordPayoutTransfer(amountCents : Nat, payoutAccount : Text) : async SellerPayoutTransferRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record payouts");
    };

    let newTransfer : SellerPayoutTransferRecord = {
      id = Time.now().toText();
      sellerPrincipal = caller;
      amountCents;
      payoutAccount;
      status = #pending;
      createdAt = Time.now();
      processedAt = null;
      errorMessage = null;
    };

    sellerPayoutTransfers.add(newTransfer.id, newTransfer);
    newTransfer;
  };

  // Seller Account Number Management

  public shared ({ caller }) func createOrGetAccountNumber() : async AccountAssignment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create account numbers");
    };

    let newAssignment : AccountAssignment = {
      sellerPrincipal = caller;
      accountNumber = Time.now().toText();
      createdAt = Time.now();
      active = true;
    };

    payoutAccountAssignments.add(caller, newAssignment);
    newAssignment;
  };

  public query ({ caller }) func getAccountNumber() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access account numbers");
    };
    switch (payoutAccountAssignments.get(caller)) {
      case (null) { null };
      case (?assignment) { ?assignment.accountNumber };
    };
  };

  // Seller Debit Card Request Management

  public shared ({ caller }) func requestBusinessDebitCard(businessName : Text) : async BusinessDebitCardRequest {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request business debit cards");
    };

    let newRequest : BusinessDebitCardRequest = {
      id = Time.now().toText();
      sellerPrincipal = caller;
      businessName;
      requestStatus = #submitted;
      submissionTimestamp = Time.now();
      reviewTimestamp = null;
      approvalTimestamp = null;
      rejectionTimestamp = null;
    };

    debitCardRequests.add(newRequest.id, newRequest);
    newRequest;
  };

  // Seller Credit Card Application Management

  public shared ({ caller }) func submitBusinessCreditCardApplication(businessName : Text) : async BusinessCreditCardApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit credit card applications");
    };

    let newApplication : BusinessCreditCardApplication = {
      id = Time.now().toText();
      sellerPrincipal = caller;
      businessName;
      applicationStatus = #submitted;
      submissionTimestamp = Time.now();
      reviewTimestamp = null;
      approvalTimestamp = null;
      rejectionTimestamp = null;
    };

    creditCardApplications.add(newApplication.id, newApplication);
    newApplication;
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  //////////////////// FUNDING /////////////////////

  public query ({ caller }) func getAdminFinancialState() : async AdminFinancialState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access financial data");
    };
    adminFinancialState;
  };

  public shared ({ caller }) func updateAvailableFunds(amountCents : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update available funds");
    };
    adminFinancialState := {
      adminFinancialState with
      availableFundsCents = amountCents;
    };
  };

  public shared ({ caller }) func updateCreditUsedAmount(usedAmountCents : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update credit usage");
    };
    adminFinancialState := {
      adminFinancialState with
      creditAccount = {
        adminFinancialState.creditAccount with
        usedAmountCents;
      };
    };
  };

  public shared ({ caller }) func repayCredit(amountCents : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can repay credit");
    };

    if (amountCents > adminFinancialState.creditAccount.usedAmountCents) {
      Runtime.trap("Cannot repay more than outstanding debt. Credit cannot be overpaid");
    };

    adminFinancialState := {
      adminFinancialState with
      creditAccount = {
        adminFinancialState.creditAccount with
        usedAmountCents = adminFinancialState.creditAccount.usedAmountCents
        - amountCents;
      };
    };
  };
};
