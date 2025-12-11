export enum UserRole {
  PRINCIPAL = 'PRINCIPAL',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  // New Support Roles
  STAFF_CANTEEN = 'STAFF_CANTEEN',
  STAFF_SECURITY = 'STAFF_SECURITY',
  STAFF_ELECTRICAL = 'STAFF_ELECTRICAL',
  STAFF_CS = 'STAFF_CS',
  STAFF_STORE = 'STAFF_STORE'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  email: string;
  avatar?: string;
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
}

export interface StudentRegistration {
  studentId: string;
  studentName: string;
  rollNo: string;
  phone: string;
  registeredAt: string;
}

export interface Event {
  id: string;
  title: string;
  department: string;
  date: string; // ISO Date string YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  hallId: string;
  organizerId: string;
  organizerName: string;
  organizerContact: string;
  guestName: string;
  expectedParticipants: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  registrations: StudentRegistration[];
  
  // Logistical Requirements
  refreshments?: string[]; // Canteen - Changed to Array
  refreshmentsDelivered?: boolean; // Canteen Status
  securityNeeds?: string; // Security - Keeps as string (instructions)
  vipArrival?: string; // Security
  electricalNeeds?: string[]; // Electrical
  labRequirements?: string[]; // CS - Changed to Array
  storeItems?: string[]; // General Store
}

export interface ExchangeRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetEventId: string; // The event currently occupying the slot
  targetEventTitle: string;
  proposedEventDetails: Omit<Event, 'id' | 'registrations' | 'status'>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}