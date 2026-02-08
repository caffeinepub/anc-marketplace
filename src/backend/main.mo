import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";

actor {
  include MixinStorage();

  public type ShoppingItem = Stripe.ShoppingItem;

  // Core Types
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

  // Data Stores
  let accessControlState = AccessControl.initState();
  let userStore = Map.empty<Principal, UserProfile>();
  let productStore = Map.empty<Text, Product>();
  let cartStore = Map.empty<Principal, ShoppingCart>();
  let orderStore = Map.empty<Text, EcomOrder>();
  let startupProgramStore = Map.empty<Principal, StartupProgramData>();
  let dropshippingPartners = Map.empty<Text, DropshippingPartner>();
  let appIntegrations = Map.empty<Text, AppIntegration>();
  let b2bServices = Map.empty<Text, B2BService>();
  let appIntegrationStore = Map.empty<Text, AppIntegrationRecord>();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;
  var ownerPrincipal : ?Principal = null;
  var saleServiceFee : Float = 0.05;
  var merchantFunnelPartner : FunnelPartner = {
    partnerName = "funnels";
    partnerLink = "https://app.funnels.link";
  };

  // Helper function to check if user has startup member role
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

  // Helper function to check if user has B2B member role
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

  public shared ({ caller }) func setOwnerPrincipal() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set owner principal");
    };
    ownerPrincipal := ?caller;
  };

  public query ({ caller }) func isOwner() : async Bool {
    switch (ownerPrincipal) {
      case (null) { false };
      case (?owner) { caller == owner };
    };
  };

  // ---------------------------------------------------
  // ----------- Vendor Service Fees -------------------
  // ---------------------------------------------------

  public query ({ caller }) func getServiceFeePercentage() : async Float {
    switch (ownerPrincipal, caller) {
      case (null, _) { saleServiceFee };
      case (?owner, c) {
        if (owner == c) { 0.0 } else { saleServiceFee };
      };
    };
  };

  public shared ({ caller }) func getServiceFee(priceCents : Nat) : async Nat {
    let percentage = await getServiceFeePercentage();
    (percentage * priceCents.toFloat()).toInt().toNat();
  };

  public shared ({ caller }) func setServiceFeePercentage(percentage : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set service fee percentage");
    };
    if (percentage > 0.2) {
      Runtime.trap("Service fee cannot be higher than 20%");
    };
    saleServiceFee := percentage;
  };

  public query ({ caller }) func isServiceFeeActive() : async Bool {
    saleServiceFee != 0.0;
  };

  // ---------------------------------------------------
  // ----------- App Integrations ----------------------
  // ---------------------------------------------------
  public shared ({ caller }) func addAppIntegrationRecord(record : AppIntegrationRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add app integrations");
    };
    appIntegrationStore.add(record.id, record);
  };

  public shared ({ caller }) func updateAppIntegrationRecord(record : AppIntegrationRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update app integrations");
    };
    appIntegrationStore.add(record.id, record);
  };

  public shared ({ caller }) func removeAppIntegrationRecord(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove app integrations");
    };
    appIntegrationStore.remove(id);
  };

  public query ({ caller }) func getAppIntegrationRecord(id : Text) : async ?AppIntegrationRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get app integrations");
    };
    appIntegrationStore.get(id);
  };

  public query ({ caller }) func getAllAppIntegrations() : async [AppIntegrationRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get app integrations");
    };
    appIntegrationStore.values().toArray();
  };

  public shared ({ caller }) func addWebhookIntegrationRecord(webhookUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add webhook integrations");
    };

    let (id, name, description, iconUrl) = ("webhook".concat(Time.now().toText()), "Webhook", "Default webhook integration", "https://example.com/icon.png");

    let record = {
      id;
      name;
      description;
      webhookUrl;
      iconUrl;
      status = #active;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    appIntegrationStore.add(record.id, record);
  };

  // ---------------------------------------------------
  // ----------- Funnel Partners ------------------
  // ---------------------------------------------------
  public shared ({ caller }) func setMerchantFunnelPartner(partnerName : Text, partnerLink : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set merchant funnel partner");
    };
    merchantFunnelPartner := {
      partnerName;
      partnerLink;
    };
  };

  public query ({ caller }) func getMerchantFunnelPartner() : async FunnelPartner {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view merchant funnel partner");
    };
    merchantFunnelPartner;
  };

  // ---------------------------------------------------
  // ----------- Authentication & Payments -------------
  // ---------------------------------------------------
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside AccessControl.assignRole
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func isAuthenticated() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #user);
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    not (stripeConfiguration == null);
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

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createCheckoutSession(items : [ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func registerUserWithPaidPlan(email : Text, fullName : Text, role : AccessRole, _stripeSessionId : Text) : async () {
    // Registration is open to anyone (including anonymous/guest users)
    // No permission check needed here as this is the entry point for new users
    let newUser : UserProfile = {
      email;
      fullName;
      activeRole = #guest; // Always start as guest, admin upgrades after payment
      subscriptionId = ?_stripeSessionId;
      accountCreated = Time.now();
    };
    userStore.add(caller, newUser);
  };

  public shared ({ caller }) func updateSubscriptionRole(userPrincipal : Principal, newRole : AccessRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update subscription roles");
    };
    switch (userStore.get(userPrincipal)) {
      case (null) { Runtime.trap("User not found. Please register first.") };
      case (?existing) {
        let updated = { existing with activeRole = newRole };
        userStore.add(userPrincipal, updated);
      };
    };
  };

  // --------------------- User Profile ----------------------
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
    // Users cannot change their own activeRole through profile save
    switch (userStore.get(caller)) {
      case (null) {
        userStore.add(caller, profile);
      };
      case (?existing) {
        let updated = {
          profile with activeRole = existing.activeRole;
        };
        userStore.add(caller, updated);
      };
    };
  };

  // ---------------------------------------------------
  // ----------- User & Role Management (Admin) --------
  // ---------------------------------------------------

  public query ({ caller }) func listAllUsersWithRoles() : async [UserWithRole] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users with roles");
    };
    let users = userStore.entries().toArray();
    users.map(
      func((principal, profile) : (Principal, UserProfile)) : UserWithRole {
        {
          principal;
          profile;
          systemRole = AccessControl.getUserRole(accessControlState, principal);
        };
      }
    );
  };

  public shared ({ caller }) func assignUserAccessRole(userPrincipal : Principal, newRole : AccessRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign access roles");
    };
    switch (userStore.get(userPrincipal)) {
      case (null) { Runtime.trap("User not found") };
      case (?existing) {
        let updated = { existing with activeRole = newRole };
        userStore.add(userPrincipal, updated);
      };
    };
  };

  public query ({ caller }) func getRoleSummary() : async {
    adminCount : Nat;
    userCount : Nat;
    guestCount : Nat;
    startupMemberCount : Nat;
    b2bMemberCount : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view role summary");
    };
    var adminCount = 0;
    var userCount = 0;
    var guestCount = 0;
    var startupMemberCount = 0;
    var b2bMemberCount = 0;

    for ((principal, profile) in userStore.entries()) {
      let systemRole = AccessControl.getUserRole(accessControlState, principal);
      switch (systemRole) {
        case (#admin) { adminCount += 1 };
        case (#user) { userCount += 1 };
        case (#guest) { guestCount += 1 };
      };

      switch (profile.activeRole) {
        case (#startUpMember) { startupMemberCount += 1 };
        case (#b2bMember) { b2bMemberCount += 1 };
        case (#guest) {};
      };
    };

    {
      adminCount;
      userCount;
      guestCount;
      startupMemberCount;
      b2bMemberCount;
    };
  };

  // ---------------------------------------------------
  // ----------- E-commerce Functions ------------------
  // ---------------------------------------------------
  func genOrderId() : Text {
    Time.now().toText();
  };

  // Public product listing - accessible to all including guests
  public query func listProductsByName() : async [Product] {
    productStore.values().toArray().sort();
  };

  public query func listProductsByPrice() : async [Product] {
    productStore.values().toArray().sort(Product.compareByPrice);
  };

  public query func getProduct(productId : Text) : async ?Product {
    productStore.get(productId);
  };

  // Admin-only product management
  public shared ({ caller }) func addOrUpdateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage products");
    };
    productStore.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    productStore.remove(productId);
  };

  // Cart Management - User only
  public shared ({ caller }) func addToCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };
    switch (productStore.get(productId)) {
      case (null) { return };
      case (?product) {
        let existingCart = switch (cartStore.get(caller)) {
          case (null) { { products = [] } };
          case (?cart) { cart };
        };

        var newProducts = existingCart.products;
        if (product.inStock > 0) {
          newProducts := newProducts.concat([productId]);
        };

        cartStore.add(caller, { products = newProducts });
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };
    switch (cartStore.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        let updatedProducts = cart.products.filter(func(p) { p != productId });
        cartStore.add(caller, { cart with products = updatedProducts });
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };
    cartStore.remove(caller);
  };

  public query ({ caller }) func getCart() : async ?ShoppingCart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    cartStore.get(caller);
  };

  func calculateTotal(products : [Text]) : Nat {
    var total = 0;
    for (productId in products.values()) {
      switch (productStore.get(productId)) {
        case (null) {};
        case (?product) {
          total += product.priceCents;
        };
      };
    };
    total;
  };

  public shared ({ caller }) func checkoutCart(_stripeSessionId : Text) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };
    switch (cartStore.get(caller)) {
      case (null) { null };
      case (?cart) {
        if (cart.products.size() > 0) {
          let orderId = genOrderId();
          let order = {
            orderId;
            products = cart.products;
            totalAmount = calculateTotal(cart.products);
            customerPrincipal = ?caller;
            status = #pending;
          };

          orderStore.add(orderId, order);
          cartStore.remove(caller);
          ?orderId;
        } else {
          null;
        };
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Text) : async ?EcomOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (orderStore.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          switch (order.customerPrincipal) {
            case (null) { null };
            case (?principal) {
              if (principal == caller) {
                ?order;
              } else {
                Runtime.trap("Unauthorized: Can only view your own orders");
              };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getUserOrders() : async [EcomOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    let allOrders = orderStore.values().toArray();
    allOrders.filter(
      func(order) {
        switch (order.customerPrincipal) {
          case (null) { false };
          case (?principal) { principal == caller };
        };
      }
    );
  };

  public query ({ caller }) func getPendingOrders() : async [EcomOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all pending orders");
    };
    let orders = orderStore.values().toArray();
    orders.filter(func(order) { order.status == #pending });
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orderStore.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orderStore.add(orderId, updatedOrder);
      };
    };
  };

  // ---------------------------------------------------
  // ----------- Startup Program Module ----------------
  // ---------------------------------------------------

  // Admin functions for managing startup program content
  public shared ({ caller }) func addLesson(lesson : Lesson) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add lessons");
    };
    // Store lesson in a global curriculum structure
    // Implementation depends on how curriculum is structured
  };

  public shared ({ caller }) func updateLesson(lesson : Lesson) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update lessons");
    };
    // Update lesson in curriculum
  };

  public shared ({ caller }) func deleteLesson(lessonId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete lessons");
    };
    // Remove lesson from curriculum
  };

  public shared ({ caller }) func addVirtualMeeting(meeting : VirtualMeeting) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add virtual meetings");
    };
    // Store virtual meeting
  };

  public shared ({ caller }) func updateVirtualMeeting(meeting : VirtualMeeting) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update virtual meetings");
    };
    // Update virtual meeting
  };

  public shared ({ caller }) func deleteVirtualMeeting(meetingId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete virtual meetings");
    };
    // Remove virtual meeting
  };

  public shared ({ caller }) func addActivity(activity : Activity) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add activities");
    };
    // Store activity
  };

  public shared ({ caller }) func updateActivity(activity : Activity) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update activities");
    };
    // Update activity
  };

  public shared ({ caller }) func deleteActivity(activityId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete activities");
    };
    // Remove activity
  };

  // User functions for startup program - requires startup member role
  public shared ({ caller }) func completeLesson(lessonId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete lessons");
    };
    if (not hasStartupMemberRole(caller)) {
      Runtime.trap("Unauthorized: Startup program access requires startup member subscription");
    };
    switch (startupProgramStore.get(caller)) {
      case (null) { Runtime.trap("No academic record found") };
      case (?startupData) {
        let updatedLessons = startupData.educationalContent.lessons.map(
          func(lesson) {
            if (lesson.id == lessonId) { lesson } else { lesson };
          }
        );
        let updatedEducationalContent = {
          startupData.educationalContent with
          lessons = updatedLessons;
        };
        let updatedStartupData = {
          startupData with
          educationalContent = updatedEducationalContent;
        };
        startupProgramStore.add(caller, updatedStartupData);
      };
    };
  };

  public shared ({ caller }) func completeActivity(activityId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete activities");
    };
    if (not hasStartupMemberRole(caller)) {
      Runtime.trap("Unauthorized: Startup program access requires startup member subscription");
    };
    switch (startupProgramStore.get(caller)) {
      case (null) { Runtime.trap("No academic record found") };
      case (?startupData) {
        let updatedActivities = startupData.educationalContent.activities.map(
          func(activity) {
            if (activity.id == activityId) {
              { activity with isCompleted = true };
            } else { activity };
          }
        );
        let updatedEducationalContent = {
          startupData.educationalContent with
          activities = updatedActivities;
        };
        let updatedStartupData = {
          startupData with
          educationalContent = updatedEducationalContent;
        };
        startupProgramStore.add(caller, updatedStartupData);
      };
    };
  };

  public shared ({ caller }) func updateBusinessVerificationStatus(status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update business verification status");
    };
    if (not hasStartupMemberRole(caller)) {
      Runtime.trap("Unauthorized: Startup program access requires startup member subscription");
    };
    switch (startupProgramStore.get(caller)) {
      case (null) { Runtime.trap("No business credit record found") };
      case (?startupData) {
        let updatedBusinessCredit = {
          startupData.businessCredit with
          businessVerificationStatus = status;
        };
        let updatedStartupData = {
          startupData with
          businessCredit = updatedBusinessCredit;
        };
        startupProgramStore.add(caller, updatedStartupData);
      };
    };
  };

  public shared ({ caller }) func updateCreditBureauRegistrationStatus(status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update credit bureau registration status");
    };
    if (not hasStartupMemberRole(caller)) {
      Runtime.trap("Unauthorized: Startup program access requires startup member subscription");
    };
    switch (startupProgramStore.get(caller)) {
      case (null) { Runtime.trap("No business credit record found") };
      case (?startupData) {
        let updatedBusinessCredit = {
          startupData.businessCredit with
          creditBureauRegistrationStatus = status;
        };
        let updatedStartupData = {
          startupData with
          businessCredit = updatedBusinessCredit;
        };
        startupProgramStore.add(caller, updatedStartupData);
      };
    };
  };

  public shared ({ caller }) func saveStartupProgramData(startupData : StartupProgramData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save startup program data");
    };
    if (not hasStartupMemberRole(caller)) {
      Runtime.trap("Unauthorized: Startup program access requires startup member subscription");
    };
    startupProgramStore.add(caller, startupData);
  };

  public query ({ caller }) func getStartupProgramData(userPrincipal : Principal) : async ?StartupProgramData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view startup program data");
    };
    if (caller != userPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view own startup program data");
    };
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not hasStartupMemberRole(userPrincipal)) {
        Runtime.trap("Unauthorized: Startup program access requires startup member subscription");
      };
    };
    startupProgramStore.get(userPrincipal);
  };

  // ----------------------------------------
  // ------ B2B Services Management ---------
  // ----------------------------------------

  // Admin functions for managing B2B services
  public shared ({ caller }) func addB2BService(service : B2BService) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add B2B services");
    };
    b2bServices.add(service.id, service);
  };

  public shared ({ caller }) func updateB2BService(service : B2BService) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update B2B services");
    };
    b2bServices.add(service.id, service);
  };

  public shared ({ caller }) func deleteB2BService(serviceId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete B2B services");
    };
    b2bServices.remove(serviceId);
  };

  public query ({ caller }) func getB2BService(serviceId : Text) : async ?B2BService {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view B2B services");
    };
    if (not hasB2BMemberRole(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: B2B services access requires B2B member subscription");
    };
    b2bServices.get(serviceId);
  };

  public query ({ caller }) func listB2BServices() : async [B2BService] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view B2B services");
    };
    if (not hasB2BMemberRole(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: B2B services access requires B2B member subscription");
    };
    b2bServices.values().toArray();
  };

  public shared ({ caller }) func toggleB2BServiceStatus(serviceId : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update service status");
    };
    switch (b2bServices.get(serviceId)) {
      case (null) { Runtime.trap("B2B service not found") };
      case (?service) {
        let updatedService = { service with isActive };
        b2bServices.add(serviceId, updatedService);
      };
    };
  };

  // ----------------------------------------
  // ------ Dropshipping Partners -----------
  // ----------------------------------------
  public shared ({ caller }) func addDropshippingPartner(partner : DropshippingPartner) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add dropshipping partners");
    };
    dropshippingPartners.add(partner.id, partner);
  };

  public shared ({ caller }) func updateDropshippingPartner(partner : DropshippingPartner) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update dropshipping partners");
    };
    dropshippingPartners.add(partner.id, partner);
  };

  public shared ({ caller }) func deleteDropshippingPartner(partnerId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete dropshipping partners");
    };
    dropshippingPartners.remove(partnerId);
  };

  public query ({ caller }) func getDropshippingPartner(partnerId : Text) : async ?DropshippingPartner {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view dropshipping partners");
    };
    dropshippingPartners.get(partnerId);
  };

  public query ({ caller }) func listDropshippingPartners() : async [DropshippingPartner] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view dropshipping partners");
    };
    dropshippingPartners.values().toArray();
  };

  public shared ({ caller }) func updateDropshippingPartnerHealthMetrics(partnerId : Text, successfulSyncs : Nat, failedSyncs : Nat, lastSyncTime : ?Int, uptimePercent : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update health metrics");
    };
    switch (dropshippingPartners.get(partnerId)) {
      case (null) { Runtime.trap("Dropshipping partner not found") };
      case (?partner) {
        let updatedPartner = {
          partner with healthMetrics = {
            successfulSyncs;
            failedSyncs;
            lastSyncTime;
            uptimePercent;
          };
        };
        dropshippingPartners.add(partnerId, updatedPartner);
      };
    };
  };

  // ----------------------------------------
  // ------ App Integrations ---------------
  // ----------------------------------------
  public shared ({ caller }) func addAppIntegration(integration : AppIntegration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add app integrations");
    };
    appIntegrations.add(integration.id, integration);
  };

  public shared ({ caller }) func updateAppIntegration(integration : AppIntegration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update app integrations");
    };
    appIntegrations.add(integration.id, integration);
  };

  public shared ({ caller }) func deleteAppIntegration(integrationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete app integrations");
    };
    appIntegrations.remove(integrationId);
  };

  public query ({ caller }) func getAppIntegration(integrationId : Text) : async ?AppIntegration {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view app integrations");
    };
    appIntegrations.get(integrationId);
  };

  public query ({ caller }) func listAppIntegrations() : async [AppIntegration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view app integrations");
    };
    appIntegrations.values().toArray();
  };

  public shared ({ caller }) func toggleAppIntegrationStatus(integrationId : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update integration status");
    };
    switch (appIntegrations.get(integrationId)) {
      case (null) { Runtime.trap("App integration not found") };
      case (?integration) {
        let updatedIntegration = { integration with isActive };
        appIntegrations.add(integrationId, updatedIntegration);
      };
    };
  };

  // ----------------------------------------
  // ------ Admin Dashboard -----------------
  // ----------------------------------------
  public query ({ caller }) func getAdminDashboardStats() : async {
    productCount : Nat;
    orderCount : Nat;
    userCount : Nat;
    cartCount : Nat;
    dropshippingPartnerCount : Nat;
    appIntegrationCount : Nat;
    b2bServiceCount : Nat;
    pendingOrderCount : Nat;
    completedOrderCount : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view dashboard stats");
    };
    let ordersArray = orderStore.values().toArray();
    let pendingOrders = ordersArray.filter(func(order) { order.status == #pending });
    let completedOrders = ordersArray.filter(func(order) { order.status == #completed });
    {
      productCount = productStore.size();
      orderCount = orderStore.size();
      userCount = userStore.size();
      cartCount = cartStore.size();
      dropshippingPartnerCount = dropshippingPartners.size();
      appIntegrationCount = appIntegrations.size();
      b2bServiceCount = b2bServices.size();
      pendingOrderCount = pendingOrders.size();
      completedOrderCount = completedOrders.size();
    };
  };

  public query ({ caller }) func listAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userStore.values().toArray();
  };

  public query ({ caller }) func listAllOrders() : async [EcomOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orderStore.values().toArray();
  };
};
