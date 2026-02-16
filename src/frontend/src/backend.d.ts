import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
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
export interface Transaction {
    id: bigint;
    isExpense: boolean;
    description: string;
    timestamp: Time;
    category: string;
    amount: number;
}
export type AppointmentID = bigint;
export type ServiceID = bigint;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addClient(name: string, contactInfo: string, preferences: string, allergies: string): Promise<ClientID>;
    addProduct(name: string, brand: string, category: string, unit: string, quantity: number, minThreshold: number, supplierNotes: string): Promise<ProductID>;
    addService(name: string, description: string, duration: bigint, price: number): Promise<ServiceID>;
    addTransaction(amount: number, category: string, isExpense: boolean, description: string): Promise<bigint>;
    addVisitToClient(clientId: ClientID, appointmentId: AppointmentID): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAppointment(clientId: ClientID, serviceId: ServiceID, scheduledTime: Time, duration: bigint, notes: string): Promise<AppointmentID>;
    deleteTransaction(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllServices(): Promise<Array<Service>>;
    getAllTransactions(): Promise<Array<Transaction>>;
    getAppointmentsByStatus(status: Status): Promise<Array<Appointment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLowStockProducts(): Promise<Array<Product>>;
    getMonthlyAggregates(year: bigint): Promise<Array<[string, number, number]>>;
    getPortfolioPhotosByServiceTag(serviceTag: string): Promise<Array<PortfolioPhoto>>;
    getProduct(id: ProductID): Promise<Product | null>;
    getService(id: ServiceID): Promise<Service | null>;
    getTodayAppointments(): Promise<Array<Appointment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setServiceStatus(id: ServiceID, active: boolean): Promise<void>;
    updateAdminCredentials(currentPassword: string, newUsername: string | null, newPassword: string | null, confirmPassword: string | null): Promise<void>;
    updateLoyaltyPoints(clientId: ClientID, newPoints: bigint): Promise<void>;
    updateProductQuantity(id: ProductID, newQuantity: number): Promise<void>;
    updateTransaction(id: bigint, amount: number, category: string, isExpense: boolean, description: string): Promise<void>;
    verifyAdminLogin(username: string, password: string): Promise<boolean>;
}
