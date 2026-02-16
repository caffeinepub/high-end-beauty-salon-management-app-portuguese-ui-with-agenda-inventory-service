import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Time "mo:core/Time";

module {
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

  type OldActor = {
    adminUsername : Text;
    adminPassword : Text;
    productIdCounter : Nat;
    serviceIdCounter : Nat;
    clientIdCounter : Nat;
    appointmentIdCounter : Nat;
    transactionIdCounter : Nat;
    categories : [Category];
    userProfiles : Map.Map<Principal, UserProfile>;
    products : Map.Map<ProductID, Product>;
    services : Map.Map<ServiceID, Service>;
    clients : Map.Map<ClientID, Client>;
    appointments : Map.Map<AppointmentID, Appointment>;
    portfolioPhotos : Map.Map<Text, PortfolioPhoto>;
    transactions : Map.Map<Nat, Transaction>;
  };

  type NewActor = {
    adminUsername : Text;
    adminPassword : Text;
    productIdCounter : Nat;
    serviceIdCounter : Nat;
    clientIdCounter : Nat;
    appointmentIdCounter : Nat;
    transactionIdCounter : Nat;
    categories : [Category];
    userProfiles : Map.Map<Principal, UserProfile>;
    products : Map.Map<ProductID, Product>;
    services : Map.Map<ServiceID, Service>;
    clients : Map.Map<ClientID, Client>;
    appointments : Map.Map<AppointmentID, Appointment>;
    portfolioPhotos : Map.Map<Text, PortfolioPhoto>;
    transactions : Map.Map<Nat, Transaction>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      adminPassword = "joana 123"
    };
  };
};
