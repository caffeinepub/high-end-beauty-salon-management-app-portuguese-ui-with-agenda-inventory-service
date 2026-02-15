import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Int "mo:core/Int";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var productIdCounter = 0;
  var serviceIdCounter = 0;
  var clientIdCounter = 0;
  var appointmentIdCounter = 0;
  var transactionIdCounter = 0;

  // Types
  type ProductID = Nat;
  type ServiceID = Nat;
  type ClientID = Nat;
  type AppointmentID = Nat;

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type Category = {
    catName : Text;
    catUnit : Text;
  };

  var categories = [
    {
      catName = "permanentes";
      catUnit = "unidades";
    }
  ];

  type Service = {
    id : ServiceID;
    name : Text;
    description : Text;
    duration : Nat;
    price : Float;
    active : Bool;
  };

  type Product = {
    id : ProductID;
    name : Text;
    brand : Text;
    category : Text;
    unit : Text;
    quantity : Float;
    minThreshold : Float;
    supplierNotes : Text;
  };

  type Client = {
    id : ClientID;
    name : Text;
    contactInfo : Text;
    preferences : Text;
    loyaltyPoints : Nat;
    allergies : Text;
    visitHistory : [AppointmentID];
  };

  type Appointment = {
    id : AppointmentID;
    clientId : ClientID;
    serviceId : ServiceID;
    scheduledTime : Time.Time;
    duration : Nat;
    notes : Text;
    status : Status;
  };

  type Status = {
    #confirmed;
    #inProgress;
    #finished;
  };

  type PortfolioPhoto = {
    id : Text;
    clientId : ClientID;
    appointmentId : ?AppointmentID;
    caption : Text;
    blob : Text;
    serviceTags : [Text];
    date : Time.Time;
  };

  type Transaction = {
    id : Nat;
    amount : Float;
    category : Text;
    timestamp : Time.Time;
    isExpense : Bool;
    description : Text;
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<ProductID, Product>();
  let services = Map.empty<ServiceID, Service>();
  let clients = Map.empty<ClientID, Client>();
  let appointments = Map.empty<AppointmentID, Appointment>();
  let portfolioPhotos = Map.empty<Text, PortfolioPhoto>();
  let transactions = Map.empty<Nat, Transaction>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Products (Admin-only for modifications)
  public shared ({ caller }) func addProduct(
    name : Text,
    brand : Text,
    category : Text,
    unit : Text,
    quantity : Float,
    minThreshold : Float,
    supplierNotes : Text,
  ) : async ProductID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    productIdCounter += 1;
    let product = {
      id = productIdCounter;
      name;
      brand;
      category;
      unit;
      quantity;
      minThreshold;
      supplierNotes;
    };
    products.add(productIdCounter, product);
    productIdCounter;
  };

  public query ({ caller }) func getProduct(id : ProductID) : async ?Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    products.values().toArray();
  };

  public shared ({ caller }) func updateProductQuantity(id : ProductID, newQuantity : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update product quantities");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = { product with quantity = newQuantity };
        products.add(id, updatedProduct);
      };
    };
  };

  public query ({ caller }) func getLowStockProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view products");
    };

    let lowStockProducts = products.values().toArray().filter(
      func(p) { p.quantity <= p.minThreshold }
    );
    lowStockProducts;
  };

  // Services
  public query ({ caller }) func getAllServices() : async [Service] {
    // Public access - any user including guests
    services.values().toArray();
  };

  public shared ({ caller }) func addService(
    name : Text,
    description : Text,
    duration : Nat,
    price : Float,
  ) : async ServiceID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };

    serviceIdCounter += 1;
    let service = {
      id = serviceIdCounter;
      name;
      description;
      duration;
      price;
      active = true;
    };
    services.add(serviceIdCounter, service);
    serviceIdCounter;
  };

  public query ({ caller }) func getService(id : ServiceID) : async ?Service {
    // Public access - any user including guests
    services.get(id);
  };

  public shared ({ caller }) func setServiceStatus(id : ServiceID, active : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update service status");
    };

    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) {
        let updatedService = { service with active };
        services.add(id, updatedService);
      };
    };
  };

  // Clients (Admin-only for modifications)
  public shared ({ caller }) func addClient(
    name : Text,
    contactInfo : Text,
    preferences : Text,
    allergies : Text,
  ) : async ClientID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add clients");
    };

    clientIdCounter += 1;
    let client = {
      id = clientIdCounter;
      name;
      contactInfo;
      preferences;
      loyaltyPoints = 0;
      allergies;
      visitHistory = [];
    };
    clients.add(clientIdCounter, client);
    clientIdCounter;
  };

  public shared ({ caller }) func addVisitToClient(clientId : ClientID, appointmentId : AppointmentID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update client visits");
    };

    switch (clients.get(clientId)) {
      case (null) { Runtime.trap("Client not found") };
      case (?client) {
        let updatedVisitHistory = client.visitHistory.concat([appointmentId]);
        let updatedClient = { client with visitHistory = updatedVisitHistory };
        clients.add(clientId, updatedClient);
      };
    };
  };

  public shared ({ caller }) func updateLoyaltyPoints(clientId : ClientID, newPoints : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update loyalty points");
    };

    switch (clients.get(clientId)) {
      case (null) { Runtime.trap("Client not found") };
      case (?client) {
        let updatedClient = { client with loyaltyPoints = newPoints };
        clients.add(clientId, updatedClient);
      };
    };
  };

  public query ({ caller }) func getPortfolioPhotosByServiceTag(serviceTag : Text) : async [PortfolioPhoto] {
    // Public access - any user including guests
    portfolioPhotos.values().toArray().filter(
      func(photo) {
        photo.serviceTags.findIndex(func(tag) { tag == serviceTag }) != null
      }
    );
  };

  // Appointments
  public shared ({ caller }) func createAppointment(
    clientId : ClientID,
    serviceId : ServiceID,
    scheduledTime : Time.Time,
    duration : Nat,
    notes : Text,
  ) : async AppointmentID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create appointments");
    };

    appointmentIdCounter += 1;
    let appointment = {
      id = appointmentIdCounter;
      clientId;
      serviceId;
      scheduledTime;
      duration;
      notes;
      status = #confirmed;
    };
    appointments.add(appointmentIdCounter, appointment);
    appointmentIdCounter;
  };

  public query ({ caller }) func getTodayAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view appointments");
    };

    let now = Time.now();
    let dayStart = now - (now % (86_400_000_000_000 : Int));
    let dayEnd = dayStart + (86_400_000_000_000 : Int);

    let todayAppointments = appointments.values().toArray().filter(
      func(a) {
        a.scheduledTime >= dayStart and a.scheduledTime < dayEnd
      }
    );
    todayAppointments;
  };

  public query ({ caller }) func getAppointmentsByStatus(status : Status) : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view appointments");
    };

    type AppointmentType = {
      id : AppointmentID;
      clientId : ClientID;
      serviceId : ServiceID;
      scheduledTime : Time.Time;
      duration : Nat;
      notes : Text;
      status : Status;
    };

    module AppointmentModule {
      public func compareByTime(a1 : AppointmentType, a2 : AppointmentType) : Order.Order {
        if (a1.scheduledTime < a2.scheduledTime) {
          #less;
        } else if (a1.scheduledTime > a2.scheduledTime) {
          #greater;
        } else { #equal };
      };
    };

    let matchingAppointments = appointments.values().toArray().filter(
      func(a) { a.status == status }
    );
    matchingAppointments.sort(AppointmentModule.compareByTime);
  };

  // Expenses/Transactions (Admin Only)
  public shared ({ caller }) func addTransaction(
    amount : Float,
    category : Text,
    isExpense : Bool,
    description : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add transactions");
    };

    let id = transactionIdCounter;
    transactionIdCounter += 1;

    let transaction : Transaction = {
      id;
      amount;
      category;
      timestamp = Time.now();
      isExpense;
      description;
    };
    transactions.add(id, transaction);
    id;
  };

  public shared ({ caller }) func updateTransaction(
    id : Nat,
    amount : Float,
    category : Text,
    isExpense : Bool,
    description : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update transactions");
    };

    switch (transactions.get(id)) {
      case (null) { Runtime.trap("Transaction not found") };
      case (?existing) {
        let updatedTransaction : Transaction = {
          id;
          amount;
          category;
          timestamp = existing.timestamp; // Keep original timestamp
          isExpense;
          description;
        };
        transactions.add(id, updatedTransaction);
      };
    };
  };

  public shared ({ caller }) func deleteTransaction(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete transactions");
    };

    switch (transactions.get(id)) {
      case (null) { Runtime.trap("Transaction not found") };
      case (?_) {
        transactions.remove(id);
      };
    };
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view transactions");
    };

    transactions.values().toArray();
  };

  public query ({ caller }) func getMonthlyAggregates(year : Int) : async [(Text, Float, Float)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view monthly aggregates");
    };

    let monthMap = Map.empty<Text, (Float, Float)>();

    for ((_, transaction) in transactions.entries()) {
      let timestamp = transaction.timestamp / 1_000_000_000;
      let (txYear, month, _) = toYearMonthDay(timestamp);

      // Only include transactions from the requested year
      if (txYear == year) {
        let oldValue = switch (monthMap.get(month)) {
          case (null) { (0.0, 0.0) };
          case (?v) { v };
        };

        let newValue = if (transaction.isExpense) {
          (oldValue.0, oldValue.1 + transaction.amount);
        } else {
          (oldValue.0 + transaction.amount, oldValue.1);
        };

        monthMap.add(month, newValue);
      };
    };

    let entries = monthMap.entries().toArray();
    entries.map(
      func((month, (income, expenses))) {
        (month, income, expenses);
      }
    );
  };

  // Helper function
  func toYearMonthDay(timestamp : Int) : (Int, Text, Int) {
    let days = timestamp / 86_400;
    let year = 1970 + (days / 365);
    let monthNumber = (days / 30) % 12 + 1;
    let month = switch (monthNumber) {
      case (1) { "January" };
      case (2) { "February" };
      case (3) { "March" };
      case (4) { "April" };
      case (5) { "May" };
      case (6) { "June" };
      case (7) { "July" };
      case (8) { "August" };
      case (9) { "September" };
      case (10) { "October" };
      case (11) { "November" };
      case (12) { "December" };
      case (_) { "January" };
    };
    let day = (days % 365) % 30 + 1;
    (year, month, day);
  };
};
