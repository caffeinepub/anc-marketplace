import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import Int "mo:core/Int";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  include MixinStorage();

  public type SellerOnboardingStep = {
    #signup;
    #companyDetails;
    #websiteIntegration;
    #termsAndConditions;
    #storeSetup;
    #marketing;
  };

  public type SellerOnboardingProgress = {
    currentStep : SellerOnboardingStep;
    completedSteps : [SellerOnboardingStep];
    timestamps : [(SellerOnboardingStep, Int)];
    lastUpdated : Int;
    isCompleted : Bool;
  };

  public type PolicyIdentifier = {
    #privacy;
    #shipping;
    #returns;
    #terms;
    #marketplaceWide;
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

  public type UserRole = {
    #guest;
    #seller;
    #customer;
    #business;
    #marketer;
    #employee;
    #admin;
  };

  public type UserRoleSummary = {
    adminCount : Nat;
    userCount : Nat;
    guestCount : Nat;
  };

  public type UserProfile = {
    email : Text;
    fullName : Text;
    activeRole : UserRole;
    subscriptionId : ?Text;
    accountCreated : Int;
  };

  public type RoleApplication = {
    applicant : Principal;
    requestedRole : UserRole;
    reason : Text;
    applicationDate : Int;
    status : RoleApplicationStatus;
  };

  public type RoleApplicationStatus = {
    #pending;
    #approved;
    #rejected;
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
    sellerPrincipal : ?Principal;
    shippingCostCents : Nat;
  };

  module EcomOrder {
    public func compare(order1 : EcomOrder, order2 : EcomOrder) : Order.Order {
      OrderStatus.compare(order1.status, order2.status);
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

  public type AdminCenterAnalytics = {
    totalTransactions : Nat;
    totalRevenueCents : Nat;
    successfulPayments : Nat;
    failedPayments : Nat;
    pendingPayments : Nat;
    averageTransactionAmountCents : Float;
    failedToSuccessRatio : Float;
    attemptsPerSuccessfulTransaction : Float;
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
    internalBalanceCents : Nat;
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

  public type SellerEarningsSummary = {
    totalEarnings : Nat;
    totalShippingCosts : Nat;
    totalOrders : Nat;
  };

  public type TimeFrame = {
    #today;
    #thisWeek;
    #thisMonth;
    #allTime;
  };

  public type TransactionRecord = {
    id : Text;
    transactionType : { #deposit; #creditFunding };
    amountCents : Nat;
    date : Text;
    source : Text;
    status : { #successful; #failed };
    transactionId : Text;
  };

  public type PayoutTransactionRecord = {
    id : Text;
    amount : Nat;
    currency : Blob;
    description : Text;
    status : { #pending; #completed; #failed };
    createdAt : Time.Time;
  };

  let accessControlState = AccessControl.initState();

  var ownerAdmins : List.List<Principal> = List.fromArray([
    Principal.fromText("e6nnr-cosry-qkhze-ku7xv-mkip5-7r7jv-vzev3-rtopc-4na67-4flnw-oqe"),
    Principal.fromText("jghzz-cnbjn-dw57n-z26cp-muyrx-mwdbf-xr3i7-y73da-5qlgr-kxe4h-4qe")
  ]);

  let ownerEmail : Text = "anc.electronics.n.more@gmail.com";

  var isInitialized = false;

  let onboardingStore = Map.empty<Principal, SellerOnboardingProgress>();
  let userStore = Map.empty<Principal, UserProfile>();
  let roleApplicationStore = Map.empty<Principal, RoleApplication>();
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
  var saleServiceFee : Nat = 500;
  var merchantFunnelPartner : FunnelPartner = {
    partnerName = "ClickFunnels";
    signupLink = "https://clickfunnels.com/signup-flow?aff=anc_marketplace_sellers";
    profileLink = "https://app.clickfunnels.com/my-profile";
  };

  let knowledgeBase = Map.empty<Text, AssistantKnowledgeEntry>();
  let unansweredQuestions = Map.empty<Text, UnansweredQuestion>();

  var adminFinancialState : AdminFinancialState = {
    availableFundsCents = 7_025_98;
    creditAccount = {
      creditLimitCents = 10_000_00;
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

  let transactionHistory = List.fromArray<TransactionRecord>([
    {
      id = "txn_58655951";
      transactionType = #deposit;
      amountCents = 7_797_538;
      date = "02/09/2026";
      source = "ANC_E_N_S-Paypal electronic transfer/wire from account ending in #$#&@7736";
      status = #successful;
      transactionId = "TXN-0058655951";
    },
    {
      id = "txn_67850006186";
      transactionType = #creditFunding;
      amountCents = 3_000_077;
      date = "02/10/2026";
      source = "Zen payments electronic transfer/wire from account ending in #$#&@3385";
      status = #successful;
      transactionId = "TXN-67850006186";
    },
  ]);

  let payoutTransactions = List.empty<PayoutTransactionRecord>();
  var sellerBalance : Int = 0;

  // Required AccessControl functions
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
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

  // Stripe configuration - Admin only
  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can check Stripe configuration");
    };
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  // Stripe session - Users only
  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userStore.add(caller, profile);
  };

  // Onboarding - Users only
  public query ({ caller }) func getOnboarding() : async ?SellerOnboardingProgress {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view onboarding");
    };
    onboardingStore.get(caller);
  };

  // Admin-only: View all users
  public query ({ caller }) func getAllUsers() : async [UserWithRole] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userStore.entries().map(
      func((principal, profile) : (Principal, UserProfile)) : UserWithRole {
        {
          principal;
          profile;
          systemRole = AccessControl.getUserRole(accessControlState, principal);
        };
      }
    ).toArray();
  };

  // Admin-only: View all orders
  public query ({ caller }) func getAllOrders() : async [EcomOrder] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orderStore.values().toArray();
  };

  // Users can view their own seller orders
  public query ({ caller }) func getSellerOrders() : async [EcomOrder] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view seller orders");
    };
    orderStore.values().filter(
      func(order) : Bool {
        switch (order.sellerPrincipal) {
          case (?seller) { Principal.equal(seller, caller) };
          case (null) { false };
        };
      }
    ).toArray();
  };

  // Users can view their own customer orders
  public query ({ caller }) func getCustomerOrders() : async [EcomOrder] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view customer orders");
    };
    orderStore.values().filter(
      func(order) : Bool {
        switch (order.customerPrincipal) {
          case (?customer) { Principal.equal(customer, caller) };
          case (null) { false };
        };
      }
    ).toArray();
  };

  // Public: Dashboard data - no authorization required
  public query ({ caller }) func getFinancialOverview() : async AdminDashboardData {
    {
      adminSections : [AdminPageSectionStatus] = Array.tabulate<AdminPageSectionStatus>(
        adminSections.size(),
        func(i) { adminSections[i] },
      );
      marketplaceRoadmap = marketplaceRoadmap.values().toArray();
    };
  };

  public query ({ caller }) func getTransactionLedger() : async [TransactionRecord] {
    transactionHistory.toArray();
  };

  public query ({ caller }) func getUserRoleSummary() : async UserRoleSummary {
    let adminCount = ownerAdmins.size();
    {
      adminCount;
      userCount = 1;
      guestCount = 0;
    };
  };

  public query ({ caller }) func getTransactionRecordById(transactionId : Text) : async ?TransactionRecord {
    transactionHistory.values().find(
      func(record) {
        Text.equal(record.transactionId, transactionId);
      }
    );
  };

  // Public: Financial state - no authorization required
  public query ({ caller }) func getAdminFinancialState() : async AdminFinancialState {
    adminFinancialState;
  };

  // Users can view their own payout profile
  public query ({ caller }) func getSellerPayoutProfile() : async ?SellerPayoutProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view payout profiles");
    };
    sellerPayoutProfiles.get(caller);
  };

  // Admin-only: View all payout profiles
  public query ({ caller }) func getAllSellerPayoutProfiles() : async [SellerPayoutProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all payout profiles");
    };
    sellerPayoutProfiles.values().toArray();
  };

  // Users can view their own transfers
  public query ({ caller }) func getSellerPayoutTransfers() : async [SellerPayoutTransferRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view payout transfers");
    };
    sellerPayoutTransfers.values().filter(
      func(transfer) : Bool {
        Principal.equal(transfer.sellerPrincipal, caller);
      }
    ).toArray();
  };

  // Admin-only: View all transfers
  public query ({ caller }) func getAllPayoutTransfers() : async [SellerPayoutTransferRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all payout transfers");
    };
    sellerPayoutTransfers.values().toArray();
  };

  // Users can view knowledge base
  public query ({ caller }) func getKnowledgeBase() : async [AssistantKnowledgeEntry] {
    knowledgeBase.values().filter(func(entry) { entry.isActive }).toArray();
  };

  // Admin-only: Record a payout transaction and update the seller balance
  public shared ({ caller }) func recordTransaction(transaction : PayoutTransactionRecord) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can record transactions");
    };
    payoutTransactions.add(transaction);
    sellerBalance += transaction.amount;
  };

  // Admin-only: Retrieve all payout transactions
  public query ({ caller }) func getTransactions() : async [PayoutTransactionRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view payout transactions");
    };
    payoutTransactions.toArray();
  };

  // Admin-only: Retrieve the current seller balance
  public query ({ caller }) func getSellerBalance() : async Int {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view the seller balance");
    };
    sellerBalance;
  };
};
