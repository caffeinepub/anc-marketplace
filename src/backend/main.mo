import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";

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

  func isOwnerAdmin(principal : Principal) : Bool {
    ownerAdmins.values().find(func(p : Principal) : Bool { Principal.equal(p, principal) }) != null;
  };

  func isRoleApplicationRequired(role : UserRole) : Bool {
    switch (role) {
      case (#employee or #admin) { true };
      case (_) { false };
    };
  };

  func isSelfServiceRole(role : UserRole) : Bool {
    switch (role) {
      case (#seller or #customer or #business or #marketer) { true };
      case (_) { false };
    };
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can check Stripe configuration status");
    };
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not isOwnerAdmin(caller)) {
      Runtime.trap("Unauthorized: Only owner admins can update Stripe settings");
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

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func initializeAccessControl() : async () {
    if (isInitialized) {
      Runtime.trap("Access control already initialized");
    };

    // Initialize owner admins first
    for (ownerPrincipal in ownerAdmins.values()) {
      AccessControl.initialize(accessControlState, ownerPrincipal);

      // Create owner admin profiles with associated email
      let ownerProfile : UserProfile = {
        email = ownerEmail;
        fullName = "ANC Owner Admin";
        activeRole = #admin;
        subscriptionId = null;
        accountCreated = Time.now();
      };
      userStore.add(ownerPrincipal, ownerProfile);
    };

    isInitialized := true;
    await updateMarketplaceRoadmapInternal();
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

  public query ({ caller }) func isCallerOwnerAdmin() : async Bool {
    isOwnerAdmin(caller);
  };

  public query ({ caller }) func getOwnerEmail() : async Text {
    if (not isOwnerAdmin(caller)) {
      Runtime.trap("Unauthorized: Only owner admins can view owner email");
    };
    ownerEmail;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    switch (userStore.get(caller)) {
      case (?existingProfile) {
        if (existingProfile.activeRole != profile.activeRole) {
          if (not isSelfServiceRole(profile.activeRole)) {
            switch (roleApplicationStore.get(caller)) {
              case (?application) {
                if (application.status != #approved or application.requestedRole != profile.activeRole) {
                  Runtime.trap("Unauthorized: Cannot set role without approved application");
                };
              };
              case (null) {
                Runtime.trap("Unauthorized: Cannot set role without approved application");
              };
            };
          };
        };
      };
      case (null) {
        if (not isSelfServiceRole(profile.activeRole) and profile.activeRole != #guest) {
          Runtime.trap("Unauthorized: New users can only select self-service roles");
        };
      };
    };

    userStore.add(caller, profile);
  };

  public shared ({ caller }) func submitRoleApplication(requestedRole : UserRole, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply for roles");
    };

    if (not isRoleApplicationRequired(requestedRole)) {
      Runtime.trap("Invalid role: This role does not require an application. Use self-service registration.");
    };

    switch (roleApplicationStore.get(caller)) {
      case (?existingApp) {
        if (existingApp.status == #pending) {
          Runtime.trap("You already have a pending application");
        };
      };
      case (null) {};
    };

    let application : RoleApplication = {
      applicant = caller;
      requestedRole;
      reason;
      applicationDate = Time.now();
      status = #pending;
    };

    roleApplicationStore.add(caller, application);
  };

  public query ({ caller }) func getPendingRoleApplications() : async [RoleApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending role requests");
    };

    roleApplicationStore.values().filter(
      func(application) { application.status == #pending }
    ).toArray();
  };

  public shared ({ caller }) func approveRoleApplication(applicant : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve roles");
    };

    switch (roleApplicationStore.get(applicant)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) {
        if (application.status != #pending) {
          Runtime.trap("Application is not pending");
        };

        let updatedApplication = {
          application with status = #approved;
        };
        roleApplicationStore.add(applicant, updatedApplication);

        switch (userStore.get(applicant)) {
          case (null) { Runtime.trap("User profile not found") };
          case (?profile) {
            let updatedProfile = {
              profile with activeRole = application.requestedRole;
            };
            userStore.add(applicant, updatedProfile);
          };
        };
      };
    };
  };

  public shared ({ caller }) func rejectRoleApplication(applicant : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject roles");
    };

    switch (roleApplicationStore.get(applicant)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) {
        if (application.status != #pending) {
          Runtime.trap("Application is not pending");
        };

        let updatedApplication = {
          application with status = #rejected;
        };
        roleApplicationStore.add(applicant, updatedApplication);
      };
    };
  };

  public shared ({ caller }) func updateAdminDashboardData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update dashboard data");
    };
    await updateMarketplaceRoadmapInternal();
  };

  func updateMarketplaceRoadmapInternal() : async () {
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
        case (#seller or #customer or #business or #marketer or #employee) { userCount += 1 };
        case (#admin) { adminCount += 1 };
      };
    };

    {
      adminCount;
      userCount;
      guestCount;
    };
  };

  public shared ({ caller }) func assignRole(user : Principal, role : AccessControl.UserRole) : async () {
    if (not isOwnerAdmin(caller)) {
      Runtime.trap("Unauthorized: Only owner admins can assign system roles");
    };
    AccessControl.assignRole(accessControlState, caller, user, role);
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

  public query ({ caller }) func getAllUsers() : async [UserWithRole] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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

  public query ({ caller }) func getAllOrders() : async [EcomOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orderStore.values().toArray();
  };

  public query ({ caller }) func getSellerOrders() : async [EcomOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
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

  public query ({ caller }) func getCustomerOrders() : async [EcomOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
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

  public query ({ caller }) func getAdminCenterAnalytics() : async AdminCenterAnalytics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let allOrders = orderStore.values().toArray();
    var totalRevenueCents = 0;
    var successfulPayments = 0;
    var failedPayments = 0;
    var pendingPayments = 0;

    for (order in allOrders.values()) {
      switch (order.status) {
        case (#completed) {
          successfulPayments += 1;
          totalRevenueCents += order.totalAmount;
        };
        case (#cancelled) {
          failedPayments += 1;
        };
        case (#pending or #inProgress) {
          pendingPayments += 1;
        };
      };
    };

    let totalTransactions = allOrders.size();
    let successfulPaymentsFloat = successfulPayments.toFloat();
    let totalRevenueCentsFloat = totalRevenueCents.toFloat();
    let failedPaymentsFloat = failedPayments.toFloat();
    let totalTransactionsFloat = totalTransactions.toFloat();

    let averageTransactionAmountCents = if (successfulPayments > 0) {
      totalRevenueCentsFloat / successfulPaymentsFloat;
    } else {
      0.0;
    };

    let failedToSuccessRatio = if (successfulPayments > 0) {
      failedPaymentsFloat / successfulPaymentsFloat;
    } else {
      0.0;
    };

    let attemptsPerSuccessfulTransaction = if (successfulPayments > 0) {
      totalTransactionsFloat / successfulPaymentsFloat;
    } else {
      0.0;
    };

    {
      totalTransactions;
      totalRevenueCents;
      successfulPayments;
      failedPayments;
      pendingPayments;
      averageTransactionAmountCents;
      failedToSuccessRatio;
      attemptsPerSuccessfulTransaction;
    };
  };

  func filterOrdersByTimeFrame(orders : [EcomOrder], timeFrame : TimeFrame) : [EcomOrder] {
    let now = Time.now();
    let nanosPerDay = 86_400_000_000_000;
    let dayOfWeek = (now % (nanosPerDay * 7)) / nanosPerDay;
    switch (timeFrame) {
      case (#today) {
        orders.filter(func(order) { order.status == #completed });
      };
      case (#thisWeek) {
        orders.filter(func(order) { order.status == #completed });
      };
      case (#thisMonth) {
        orders.filter(func(order) { order.status == #completed });
      };
      case (#allTime) {
        orders.filter(func(order) { order.status == #completed });
      };
    };
  };

  public query ({ caller }) func getSellerEarningsSummary(timeFrame : TimeFrame) : async SellerEarningsSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view earnings");
    };

    let allOrders = orderStore.values().toArray();

    let sellerOrders = allOrders.filter(func(order) : Bool {
      switch (order.sellerPrincipal) {
        case (?seller) { Principal.equal(seller, caller) };
        case (null) { false };
      };
    });

    let filteredOrders = filterOrdersByTimeFrame(sellerOrders, timeFrame);

    var totalEarnings = 0;
    var totalShippingCosts = 0;
    var totalOrders = filteredOrders.size();

    for (order in filteredOrders.values()) {
      totalEarnings += order.totalAmount;
      totalShippingCosts += order.shippingCostCents;
    };

    {
      totalEarnings;
      totalShippingCosts;
      totalOrders;
    };
  };

  public shared ({ caller }) func saveOnboarding(wizardState : SellerOnboardingProgress) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save onboarding progress");
    };
    onboardingStore.add(caller, wizardState);
  };

  public query ({ caller }) func getOnboarding() : async ?SellerOnboardingProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view onboarding progress");
    };
    onboardingStore.get(caller);
  };

  public query ({ caller }) func getAllTransactionHistory() : async [TransactionRecord] {
    if (not isOwnerAdmin(caller)) {
      Runtime.trap("Unauthorized: Only owner admins can view transaction history");
    };
    transactionHistory.toArray();
  };

  public query ({ caller }) func getTransactionRecordById(transactionId : Text) : async ?TransactionRecord {
    if (not isOwnerAdmin(caller)) {
      Runtime.trap("Unauthorized: Only owner admins can view transaction history");
    };
    transactionHistory.values().find(
      func(record) {
        Text.equal(record.transactionId, transactionId);
      }
    );
  };

  public query ({ caller }) func getAdminFinancialState() : async AdminFinancialState {
    if (not isOwnerAdmin(caller)) {
      Runtime.trap("Unauthorized: Only owner admins can view financial state");
    };
    adminFinancialState;
  };

  public shared ({ caller }) func updateAdminFinancialState(newState : AdminFinancialState) : async () {
    if (not isOwnerAdmin(caller)) {
      Runtime.trap("Unauthorized: Only owner admins can update financial state");
    };
    adminFinancialState := newState;
  };

  public query ({ caller }) func getSellerPayoutProfile() : async ?SellerPayoutProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payout profiles");
    };
    sellerPayoutProfiles.get(caller);
  };

  public shared ({ caller }) func updateSellerPayoutProfile(profile : SellerPayoutProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update payout profiles");
    };
    if (not Principal.equal(profile.sellerPrincipal, caller)) {
      Runtime.trap("Unauthorized: Can only update your own payout profile");
    };
    sellerPayoutProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllSellerPayoutProfiles() : async [SellerPayoutProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all payout profiles");
    };
    sellerPayoutProfiles.values().toArray();
  };

  public shared ({ caller }) func createPayoutTransfer(amountCents : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create payout transfers");
    };

    switch (sellerPayoutProfiles.get(caller)) {
      case (null) { Runtime.trap("Payout profile not found. Please set up your payout account first.") };
      case (?profile) {
        if (profile.internalBalanceCents < amountCents) {
          Runtime.trap("Insufficient balance for payout");
        };

        let transferId = "payout_" # Time.now().toText();
        let transfer : SellerPayoutTransferRecord = {
          id = transferId;
          sellerPrincipal = caller;
          amountCents;
          payoutAccount = profile.designatedPayoutAccount;
          status = #pending;
          createdAt = Time.now();
          processedAt = null;
          errorMessage = null;
        };

        sellerPayoutTransfers.add(transferId, transfer);

        let updatedProfile = {
          profile with internalBalanceCents = profile.internalBalanceCents - amountCents;
        };
        sellerPayoutProfiles.add(caller, updatedProfile);

        transferId;
      };
    };
  };

  public query ({ caller }) func getSellerPayoutTransfers() : async [SellerPayoutTransferRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payout transfers");
    };

    sellerPayoutTransfers.values().filter(
      func(transfer) : Bool {
        Principal.equal(transfer.sellerPrincipal, caller);
      }
    ).toArray();
  };

  public query ({ caller }) func getAllPayoutTransfers() : async [SellerPayoutTransferRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all payout transfers");
    };
    sellerPayoutTransfers.values().toArray();
  };

  public shared ({ caller }) func processPayoutTransfer(transferId : Text, success : Bool, errorMessage : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can process payout transfers");
    };

    switch (sellerPayoutTransfers.get(transferId)) {
      case (null) { Runtime.trap("Transfer not found") };
      case (?transfer) {
        let updatedTransfer = {
          transfer with
          status = if (success) { #processed } else { #failed };
          processedAt = ?Time.now();
          errorMessage;
        };
        sellerPayoutTransfers.add(transferId, updatedTransfer);
      };
    };
  };

  public query ({ caller }) func getKnowledgeBase() : async [AssistantKnowledgeEntry] {
    knowledgeBase.values().filter(func(entry) { entry.isActive }).toArray();
  };

  public shared ({ caller }) func addKnowledgeEntry(entry : AssistantKnowledgeEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add knowledge entries");
    };
    knowledgeBase.add(entry.id, entry);
  };

  public shared ({ caller }) func updateKnowledgeEntry(entry : AssistantKnowledgeEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update knowledge entries");
    };
    knowledgeBase.add(entry.id, entry);
  };

  public shared ({ caller }) func deleteKnowledgeEntry(entryId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete knowledge entries");
    };
    knowledgeBase.remove(entryId);
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
          answer = "ANC temporarily holds seller funds in an internal ledger until they are transferred to the seller's designated payout account. Copyright for all products remains with the sellers and service providers. All digital and physical products are sold and delivered by independent merchants. Customers should contact the merchant for product-related guarantees and returns. ANC can be contacted at ancelectronicsnservices@gmail.com regarding any issues, and service fees will be refunded accordingly if necessary.";
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

      let businessOpsEntries = [
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
      for (entry in businessOpsEntries.values()) {
        knowledgeBase.add(entry.id, entry);
      };
    };
  };
};
