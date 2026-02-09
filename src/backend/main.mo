import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";



actor {
  include MixinStorage();

  public type ShoppingItem = Stripe.ShoppingItem;

  public type AccessRole = {
    #guest;
    #startUpMember;
    #b2bMember;
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
    partnerLink : Text;
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

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;
  var ownerPrincipal : ?Principal = null;
  var saleServiceFee : Nat = 500; // $5 fee represented in cents
  var merchantFunnelPartner : FunnelPartner = {
    partnerName = "funnels";
    partnerLink = "https://app.funnels.link";
  };

  let knowledgeBase = Map.empty<Text, AssistantKnowledgeEntry>();
  let unansweredQuestions = Map.empty<Text, UnansweredQuestion>();

  func hasStartupMemberRole(principal : Principal) : Bool {
    switch (userStore.get(principal)) {
      case (null) { false };
      case (?userData) {
        switch (userData.activeRole) {
          case (#startUpMember) { true };
          case (_) { false };
        };
      };
    };
  };

  func hasB2BMemberRole(principal : Principal) : Bool {
    switch (userStore.get(principal)) {
      case (null) { false };
      case (?userData) {
        switch (userData.activeRole) {
          case (#b2bMember) { true };
          case (_) { false };
        };
      };
    };
  };

  func initSeededKnowledge() {
    if (knowledgeBase.isEmpty()) {
      let entries = [
        {
          id = "anc_general_info";
          question = "What is ANC Electronics N Services?";
          answer = "ANC Electronics N Services is a digital transformation platform offering a suite of business solutions including e-commerce, startup assistance, B2B services, and educational content for entrepreneurs and businesses. ANC was established in Texas and now operates in both Texas and Georgia.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_apprentice_program";
          question = "What is the ANC Apprentice Program Center?";
          answer = "The ANC Apprentice Program Center provides a comprehensive startup assistance program including educational content, virtual meetings, activities, and business credit building resources. It serves as a dedicated learning and development hub for entrepreneurs.";
          category = "Startup Program";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_ecommerce";
          question = "What e-commerce services does ANC offer?";
          answer = "ANC offers a suite of e-commerce solutions including store builder templates, product catalog management, payment processing, and dropshipping partnerships with third-party suppliers.";
          category = "Ecommerce";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_veteran_support";
          question = "Does ANC support veterans?";
          answer = "Yes, ANC is veteran-owned and actively supports veterans through specialized programs, discounts, and educational initiatives tailored to their entrepreneurial needs.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_women_family_owned";
          question = "Is ANC women or family owned?";
          answer = "ANC is a family-run business with significant female leadership and active support for women entrepreneurs through dedicated resources and support programs.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_motto";
          question = "What is ANC's motto?";
          answer = "The core motto of ANC is 'Build the Bridge to Success', and the company is committed to empowering entrepreneurs and helping businesses thrive.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_marketplace_pricing";
          question = "What is ANC's marketplace pricing model?";
          answer = "Store access and service access are free; the charge is a $5 service fee per sale. There is no monthly bill unless the user converts their online store/service profile into a standalone website or app, which costs $10/month.";
          category = "Ecommerce";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_contacts";
          question = "How does ANC handle payments and copyright matters?";
          answer = "ANC does not process seller/merchant money directly. Copyright for all products remains with the sellers and service providers. All digital and physical products are sold and delivered by independent merchants. Customers should contact the merchant for product-related guarantees and returns. ANC can be contacted at ancelectronicsnservices@gmail.com regarding any of these issues, and service fees will be refunded accordingly.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_pci_compliance";
          question = "Is ANC PCI DSS compliant?";
          answer = "ANC is committed to maintaining compliance with the PCI Data Security Standard (PCI DSS) for secure payment processing. All transactions are handled through trusted third-party payment providers, and no sensitive payment data is stored on ANC servers.";
          category = "General";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
        {
          id = "anc_marketing_platforms";
          question = "What marketing platforms does ANC support?";
          answer = "ANC supports the integration of store and advertising platforms using advanced digital products, such as AI video services and training, as a core part of the business. This enables companies to run their entire business and brand on the Internet Computer blockchain.";
          category = "Marketing";
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        },
      ];

      for (entry in entries.values()) {
        knowledgeBase.add(entry.id, entry);
      };
    };
  };

  public shared ({ caller }) func setOwnerPrincipal() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set owner principal");
    };
    ownerPrincipal := ?caller;
    initSeededKnowledge();
  };

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
    initSeededKnowledge();
  };

  public query ({ caller }) func getAssistantKnowledgeBase() : async [AssistantKnowledgeEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access knowledge base");
    };
    knowledgeBase.values().toArray();
  };

  public shared ({ caller }) func addAssistantKnowledgeEntry(entry : AssistantKnowledgeEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add knowledge entries");
    };
    knowledgeBase.add(entry.id, entry);
  };

  public shared ({ caller }) func updateAssistantKnowledgeEntry(entry : AssistantKnowledgeEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update knowledge entries");
    };
    knowledgeBase.add(entry.id, entry);
  };

  public shared ({ caller }) func removeAssistantKnowledgeEntry(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove knowledge entries");
    };
    knowledgeBase.remove(id);
  };

  public query ({ caller }) func getUnansweredQuestions() : async [UnansweredQuestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access unanswered questions");
    };
    unansweredQuestions.values().toArray();
  };

  public shared ({ caller }) func markQuestionAsAnswered(questionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark questions as answered");
    };
    unansweredQuestions.remove(questionId);
  };

  public shared ({ caller }) func convertQuestionToKnowledgeEntry(questionId : Text, answer : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can convert questions to knowledge entries");
    };

    switch (unansweredQuestions.get(questionId)) {
      case (null) { Runtime.trap("Question not found") };
      case (?question) {
        let newEntry = {
          id = questionId;
          question = question.question;
          answer;
          category;
          lastUpdated = Time.now();
          isActive = true;
          usageCount = 0;
        };
        knowledgeBase.add(questionId, newEntry);
        unansweredQuestions.remove(questionId);
      };
    };
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

  func getBestMatchingAnswer(question : Text) : ?AssistantKnowledgeEntry {
    var bestMatch : ?AssistantKnowledgeEntry = null;
    var bestScore : Float = 0.0;

    for ((_, entry) in knowledgeBase.entries()) {
      let score = calculateSimilarity(question, entry.question);
      if (score > bestScore and score > 0.5) {
        bestMatch := ?entry;
        bestScore := score;
      };
    };

    bestMatch;
  };

  public query ({ caller }) func askAssistant(question : Text, category : Text) : async ?Text {
    let normalizedQuestion = question.toLower();

    let bestMatch = getBestMatchingAnswer(normalizedQuestion);

    switch (bestMatch) {
      case (null) {
        unansweredQuestions.add(Time.now().toText(), {
          id = Time.now().toText();
          question = normalizedQuestion;
          categorySuggestion = category;
          creationTime = Time.now();
          interactionCount = 1;
        });
        null;
      };
      case (?matchingEntry) {
        ?matchingEntry.answer;
      };
    };
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

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ... (rest of the unchanged code)
};
