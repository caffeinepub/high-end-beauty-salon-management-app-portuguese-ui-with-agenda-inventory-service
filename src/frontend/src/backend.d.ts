import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ProductID = bigint;
export type Time = bigint;
export interface PortfolioPhoto {
    id: string;
    serviceTags: Array<string>;
    clientId: ClientID;
    blob: string;
    date: Time;
    caption: string;
    appointmentId?: AppointmentID;
}
export interface Service {
    id: ServiceID;
    duration: bigint;
    active: boolean;
    name: string;
    description: string;
    price: number;
}
export type ClientID = bigint;
export type AppointmentID = bigint;
export type ServiceID = bigint;
export interface Client {
    id: ClientID;
    contactInfo: string;
    visitHistory: Array<AppointmentID>;
    name: string;
    loyaltyPoints: bigint;
    preferences: string;
    allergies: string;
}
export interface Appointment {
    id: AppointmentID;
    status: Status;
    duration: bigint;
    clientId: ClientID;
    scheduledTime: Time;
    notes: string;
    serviceId: ServiceID;
}
export interface Product {
    id: ProductID;
    name: string;
    unit: string;
    minThreshold: number;
    supplierNotes: string;
    quantity: number;
    category: string;
    brand: string;
}
export enum Status {
    finished = "finished",
    confirmed = "confirmed",
    inProgress = "inProgress"
}
export interface backendInterface {
    addClient(name: string, contactInfo: string, preferences: string, allergies: string): Promise<ClientID>;
    addProduct(name: string, brand: string, category: string, unit: string, quantity: number, minThreshold: number, supplierNotes: string): Promise<ProductID>;
    addService(name: string, description: string, duration: bigint, price: number): Promise<ServiceID>;
    addVisitToClient(clientId: ClientID, appointmentId: AppointmentID): Promise<void>;
    createAppointment(clientId: ClientID, serviceId: ServiceID, scheduledTime: Time, duration: bigint, notes: string): Promise<AppointmentID>;
    getAllClients(): Promise<Array<Client>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllServices(): Promise<Array<Service>>;
    getAppointmentsByStatus(status: Status): Promise<Array<Appointment>>;
    getLowStockProducts(): Promise<Array<Product>>;
    getPortfolioPhotosByServiceTag(serviceTag: string): Promise<Array<PortfolioPhoto>>;
    getProduct(id: ProductID): Promise<Product | null>;
    getService(id: ServiceID): Promise<Service | null>;
    getTodayAppointments(): Promise<Array<Appointment>>;
    setServiceStatus(id: ServiceID, active: boolean): Promise<void>;
    updateLoyaltyPoints(clientId: ClientID, newPoints: bigint): Promise<void>;
    updateProductQuantity(id: ProductID, newQuantity: number): Promise<void>;
}
