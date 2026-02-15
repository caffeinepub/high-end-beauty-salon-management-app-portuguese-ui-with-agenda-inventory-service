import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Float "mo:core/Float";

actor {
  include MixinStorage();

  type ProductID = Nat;
  type ServiceID = Nat;
  type ClientID = Nat;
  type AppointmentID = Nat;

  type Status = {
    #confirmed;
    #inProgress;
    #finished;
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

  type Service = {
    id : ServiceID;
    name : Text;
    description : Text;
    duration : Nat; // duration in minutes
    price : Float;
    active : Bool;
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

  type PortfolioPhoto = {
    id : Text;
    clientId : ClientID;
    appointmentId : ?AppointmentID;
    caption : Text;
    blob : Text; // Reference to external file (URL)
    serviceTags : [Text];
    date : Time.Time;
  };

  var productIdCounter = 0 : ProductID;
  var serviceIdCounter = 0 : ServiceID;
  var clientIdCounter = 0 : ClientID;
  var appointmentIdCounter = 0 : AppointmentID;

  let products = Map.empty<ProductID, Product>();
  let services = Map.empty<ServiceID, Service>();
  let clients = Map.empty<ClientID, Client>();
  let appointments = Map.empty<AppointmentID, Appointment>();
  let portfolioPhotos = Map.empty<Text, PortfolioPhoto>();

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func addProduct(
    name : Text,
    brand : Text,
    category : Text,
    unit : Text,
    quantity : Float,
    minThreshold : Float,
    supplierNotes : Text,
  ) : async ProductID {
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
    products.get(id);
  };

  public shared ({ caller }) func updateProductQuantity(id : ProductID, newQuantity : Float) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = { product with quantity = newQuantity };
        products.add(id, updatedProduct);
      };
    };
  };

  public query ({ caller }) func getLowStockProducts() : async [Product] {
    let lowStockProducts = products.values().toArray().filter(
      func(p) { p.quantity <= p.minThreshold }
    );
    lowStockProducts;
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray();
  };

  public shared ({ caller }) func addService(
    name : Text,
    description : Text,
    duration : Nat,
    price : Float,
  ) : async ServiceID {
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
    services.get(id);
  };

  public shared ({ caller }) func setServiceStatus(id : ServiceID, active : Bool) : async () {
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) {
        let updatedService = { service with active };
        services.add(id, updatedService);
      };
    };
  };

  public query ({ caller }) func getAllClients() : async [Client] {
    clients.values().toArray();
  };

  public shared ({ caller }) func addClient(
    name : Text,
    contactInfo : Text,
    preferences : Text,
    allergies : Text,
  ) : async ClientID {
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
    switch (clients.get(clientId)) {
      case (null) { Runtime.trap("Client not found") };
      case (?client) {
        let updatedClient = { client with loyaltyPoints = newPoints };
        clients.add(clientId, updatedClient);
      };
    };
  };

  public query ({ caller }) func getPortfolioPhotosByServiceTag(serviceTag : Text) : async [PortfolioPhoto] {
    portfolioPhotos.values().toArray().filter(
      func(photo) {
        photo.serviceTags.findIndex(func(tag) { tag == serviceTag }) != null
      }
    );
  };

  public shared ({ caller }) func createAppointment(
    clientId : ClientID,
    serviceId : ServiceID,
    scheduledTime : Time.Time,
    duration : Nat,
    notes : Text,
  ) : async AppointmentID {
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

  module Appointment {
    public func compareByTime(a1 : Appointment, a2 : Appointment) : Order.Order {
      if (a1.scheduledTime < a2.scheduledTime) {
        #less;
      } else if (a1.scheduledTime > a2.scheduledTime) {
        #greater;
      } else { #equal };
    };
  };

  public query ({ caller }) func getAppointmentsByStatus(status : Status) : async [Appointment] {
    let matchingAppointments = appointments.values().toArray().filter(
      func(a) { a.status == status }
    );
    matchingAppointments.sort(Appointment.compareByTime);
  };
};
