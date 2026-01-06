import { User, UserRole, Hall, Event, ExchangeRequest } from '../types';

// --- Seed Data ---

interface MockUser extends User {
  password?: string;
}

export const USERS: MockUser[] = [
  // --- Admin ---
  { id: 'u1', name: 'Root Admin', role: UserRole.PRINCIPAL, email: 'admin@rootflow.io', password: 'admin' },
  
  // --- Staff (Teachers) ---
  { id: 'u2', name: 'Sarah Smith', role: UserRole.TEACHER, department: 'Engineering', email: 'staff@rootflow.io', password: 'staff' },
  { id: 'u3', name: 'Alan Turing', role: UserRole.TEACHER, department: 'Mathematics', email: 'math@rootflow.io', password: 'staff' },
  { id: 'u6', name: 'Grace Hopper', role: UserRole.TEACHER, department: 'Computing', email: 'it@rootflow.io', password: 'staff' },
  { id: 'u7', name: 'C.V. Raman', role: UserRole.TEACHER, department: 'Physics', email: 'physics@rootflow.io', password: 'staff' },
  { id: 'u8', name: 'Homi J. Bhabha', role: UserRole.TEACHER, department: 'Chemistry', email: 'chem@rootflow.io', password: 'staff' },

  // --- Students ---
  { id: 'u4', name: 'John Doe', role: UserRole.STUDENT, department: 'Computing', email: 'user@rootflow.io', password: 'student' },
  { id: 'u5', name: 'Jane Roe', role: UserRole.STUDENT, department: 'Bioscience', email: 'jane@rootflow.io', password: 'student' },
  { id: 'u9', name: 'Alice Williams', role: UserRole.STUDENT, department: 'Mathematics', email: 'alice@rootflow.io', password: 'student' },
  { id: 'u10', name: 'Bob Johnson', role: UserRole.STUDENT, department: 'Physics', email: 'bob@rootflow.io', password: 'student' },
  { id: 'u11', name: 'Charlie Davis', role: UserRole.STUDENT, department: 'Business', email: 'charlie@rootflow.io', password: 'student' },

  // --- Support Staff ---
  { id: 's1', name: 'Logistics Manager', role: UserRole.STAFF_CANTEEN, email: 'logistics@rootflow.io', password: 'staff' },
  { id: 's2', name: 'Safety Chief', role: UserRole.STAFF_SECURITY, email: 'safety@rootflow.io', password: 'staff' },
  { id: 's3', name: 'Infrastructure Head', role: UserRole.STAFF_ELECTRICAL, email: 'infra@rootflow.io', password: 'staff' },
  { id: 's4', name: 'Tech Ops Admin', role: UserRole.STAFF_CS, department: 'Technology', email: 'ops@rootflow.io', password: 'staff' },
  { id: 's5', name: 'Inventory Keeper', role: UserRole.STAFF_STORE, email: 'store@rootflow.io', password: 'staff' },
];

export const HALLS: Hall[] = [
  { id: 'h1', name: 'Root Arena', capacity: 500, location: 'Central Hub', amenities: ['Projector', 'AC', 'Surround Sound'] },
  { id: 'h2', name: 'Innovation Hub', capacity: 150, location: 'East Wing', amenities: ['Projector', 'Smart Board'] },
  { id: 'h3', name: 'The Grand Atrium', capacity: 1000, location: 'Plaza Area', amenities: ['Stage', 'Lighting', 'Modular Seating'] },
  { id: 'h4', name: 'Visionary Lab', capacity: 50, location: 'Level 5', amenities: ['8K TV', 'Holographic Ready'] },
];

const today = new Date().toISOString().split('T')[0];

const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Future of AI Summit',
    department: 'Engineering',
    date: today,
    startTime: '10:00',
    endTime: '12:00',
    hallId: 'h1',
    organizerId: 'u2',
    organizerName: 'Sarah Smith',
    organizerContact: '1122334455',
    guestName: 'Dr. Jane Watson',
    expectedParticipants: 120,
    status: 'CONFIRMED',
    registrations: [
      { studentId: 'u4', studentName: 'John Doe', rollNo: 'RF-2024-001', phone: '9988776655', registeredAt: new Date().toISOString() }
    ],
    refreshments: ['Premium catering for 130 people', 'Barista station'],
    refreshmentsDelivered: false,
    securityNeeds: 'Encryption verification at entry.',
    vipArrival: '10:00 AM Front Plaza',
    electricalNeeds: ['Fiber Uplink', '3-Phase Power', 'Stage Lighting'],
    labRequirements: [],
    storeItems: ['Smart Badges x150', 'RFID Pens x150']
  }
];

class MockService {
  private events: Event[] = [...INITIAL_EVENTS];
  private exchangeRequests: ExchangeRequest[] = [];
  private currentUser: User | null = null;

  authenticate(email: string, password: string): User | null {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      this.currentUser = userWithoutPassword;
      return userWithoutPassword;
    }
    return null;
  }

  getCurrentUser() { return this.currentUser; }
  logout() { this.currentUser = null; }
  getHalls() { return HALLS; }
  getEvents() { return this.events; }
  getEventsByDate(date: string) {
    return this.events.filter(e => e.date === date && e.status !== 'CANCELLED');
  }

  checkAvailability(hallId: string, date: string, start: string, end: string): { available: boolean; conflictEvent?: Event } {
    const existing = this.events.find(e => 
      e.hallId === hallId && 
      e.date === date &&
      e.status !== 'CANCELLED' &&
      (
        (start >= e.startTime && start < e.endTime) ||
        (end > e.startTime && end <= e.endTime) ||
        (start <= e.startTime && end >= e.endTime)
      )
    );
    return { available: !existing, conflictEvent: existing };
  }

  bookEvent(eventData: Omit<Event, 'id' | 'registrations' | 'status'>): Event {
    const newEvent: Event = {
      ...eventData,
      id: `e${Date.now()}`,
      status: 'CONFIRMED',
      registrations: []
    };
    this.events.push(newEvent);
    return newEvent;
  }

  cancelEvent(eventId: string) {
    this.events = this.events.map(e => e.id === eventId ? { ...e, status: 'CANCELLED' } : e);
  }

  deleteEvent(eventId: string) {
    this.events = this.events.filter(e => e.id !== eventId);
  }

  markRefreshmentsDelivered(eventId: string) {
    this.events = this.events.map(e => 
      e.id === eventId ? { ...e, refreshmentsDelivered: true } : e
    );
  }

  registerStudent(eventId: string, student: User, details: { rollNo: string, phone: string }) {
    this.events = this.events.map(e => {
      if (e.id === eventId) {
        if (e.registrations.some(r => r.studentId === student.id)) return e;
        return {
          ...e,
          registrations: [
            ...e.registrations,
            {
              studentId: student.id,
              studentName: student.name,
              rollNo: details.rollNo,
              phone: details.phone,
              registeredAt: new Date().toISOString()
            }
          ]
        };
      }
      return e;
    });
  }

  requestExchange(requesterId: string, conflictEvent: Event, proposedEventDetails: Omit<Event, 'id' | 'registrations' | 'status'>): boolean {
    console.log(`[ROOTFLOW ALERT] Target: ${conflictEvent.organizerName} | Slot Negotiation initiated for ${conflictEvent.title}`);
    this.exchangeRequests.push({
      id: `ex${Date.now()}`,
      requesterId,
      requesterName: this.currentUser?.name || 'Anonymous',
      targetEventId: conflictEvent.id,
      targetEventTitle: conflictEvent.title,
      proposedEventDetails: proposedEventDetails,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });
    return true;
  }

  getPendingRequestsForUser(userId: string): ExchangeRequest[] {
    return this.exchangeRequests.filter(req => {
      const event = this.events.find(e => e.id === req.targetEventId);
      return event && event.organizerId === userId && req.status === 'PENDING';
    });
  }

  resolveExchangeRequest(requestId: string, approved: boolean) {
    const requestIndex = this.exchangeRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return;
    const request = this.exchangeRequests[requestIndex];
    if (!approved) {
      this.exchangeRequests[requestIndex].status = 'REJECTED';
      return;
    }
    this.cancelEvent(request.targetEventId);
    this.bookEvent(request.proposedEventDetails);
    this.exchangeRequests[requestIndex].status = 'APPROVED';
  }
}

export const mockService = new MockService();