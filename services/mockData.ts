import { User, UserRole, Hall, Event, ExchangeRequest } from '../types';

// --- Seed Data ---

interface MockUser extends User {
  password?: string;
}

export const USERS: MockUser[] = [
  // --- Admin ---
  { id: 'u1', name: 'Dr. Principal', role: UserRole.PRINCIPAL, email: 'principal@drngp.ac.in', password: 'admin' },
  
  // --- Staff (Teachers) ---
  { id: 'u2', name: 'Prof. Sarah Smith', role: UserRole.TEACHER, department: 'Computer Science', email: 'staff@drngp.ac.in', password: 'staff' },
  { id: 'u3', name: 'Prof. Alan Turing', role: UserRole.TEACHER, department: 'Mathematics', email: 'math@drngp.ac.in', password: 'staff' },
  { id: 'u6', name: 'Prof. Grace Hopper', role: UserRole.TEACHER, department: 'Information Technology', email: 'it@drngp.ac.in', password: 'staff' },
  { id: 'u7', name: 'Prof. C.V. Raman', role: UserRole.TEACHER, department: 'Physics', email: 'physics@drngp.ac.in', password: 'staff' },
  { id: 'u8', name: 'Prof. Homi J. Bhabha', role: UserRole.TEACHER, department: 'Chemistry', email: 'chem@drngp.ac.in', password: 'staff' },

  // --- Students ---
  { id: 'u4', name: 'John Doe', role: UserRole.STUDENT, department: 'Computer Science', email: 'student@drngp.ac.in', password: 'student' },
  { id: 'u5', name: 'Jane Roe', role: UserRole.STUDENT, department: 'Biotechnology', email: 'jane@drngp.ac.in', password: 'student' },
  { id: 'u9', name: 'Alice Williams', role: UserRole.STUDENT, department: 'Mathematics', email: 'alice@drngp.ac.in', password: 'student' },
  { id: 'u10', name: 'Bob Johnson', role: UserRole.STUDENT, department: 'Physics', email: 'bob@drngp.ac.in', password: 'student' },
  { id: 'u11', name: 'Charlie Davis', role: UserRole.STUDENT, department: 'Commerce', email: 'charlie@drngp.ac.in', password: 'student' },

  // --- Support Staff (New) ---
  { id: 's1', name: 'Canteen Manager', role: UserRole.STAFF_CANTEEN, email: 'canteen@drngp.ac.in', password: 'staff' },
  { id: 's2', name: 'Security Chief', role: UserRole.STAFF_SECURITY, email: 'security@drngp.ac.in', password: 'staff' },
  { id: 's3', name: 'Electrical Head', role: UserRole.STAFF_ELECTRICAL, email: 'electrical@drngp.ac.in', password: 'staff' },
  { id: 's4', name: 'CS Lab Admin', role: UserRole.STAFF_CS, department: 'Computer Science', email: 'cslab@drngp.ac.in', password: 'staff' },
  { id: 's5', name: 'Store Keeper', role: UserRole.STAFF_STORE, email: 'store@drngp.ac.in', password: 'staff' },
];

export const HALLS: Hall[] = [
  { id: 'h1', name: 'N.G.P. Conference Center', capacity: 500, location: 'Main Block', amenities: ['Projector', 'AC', 'Sound System'] },
  { id: 'h2', name: 'Seminar Hall A', capacity: 150, location: 'Science Block', amenities: ['Projector', 'Whiteboard'] },
  { id: 'h3', name: 'Auditorium', capacity: 1000, location: 'East Wing', amenities: ['Stage', 'Lighting', 'Premium Sound'] },
  { id: 'h4', name: 'Lab Conference Room', capacity: 50, location: 'Lab Block', amenities: ['Smart TV', 'Video Conf'] },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'AI in Healthcare Seminar',
    department: 'Computer Science',
    date: today,
    startTime: '10:00',
    endTime: '12:00',
    hallId: 'h1',
    organizerId: 'u2',
    organizerName: 'Prof. Sarah Smith',
    organizerContact: '9876543210',
    guestName: 'Dr. A. Kumar',
    expectedParticipants: 120,
    status: 'CONFIRMED',
    registrations: [
      { studentId: 'u4', studentName: 'John Doe', rollNo: 'CS2021001', phone: '9988776655', registeredAt: new Date().toISOString() }
    ],
    // Logistical Data
    refreshments: ['High tea and samosas for 130 pax', '5 VIP lunch packets'],
    refreshmentsDelivered: false,
    securityNeeds: 'Check IDs at entry. Reserve front row for VIPs.',
    vipArrival: '10:00 AM Main Gate - White SUV',
    electricalNeeds: ['Podium Mic', 'Handheld Mic x2', 'Projector HDMI', 'Spotlight'],
    labRequirements: [],
    storeItems: ['Notepads x10', 'Pens x10', 'Flower Bouquet x1', 'Welcome Banner']
  },
  {
    id: 'e2',
    title: 'Mathematics Symposium',
    department: 'Mathematics',
    date: tomorrow,
    startTime: '09:00',
    endTime: '16:00',
    hallId: 'h2',
    organizerId: 'u3',
    organizerName: 'Prof. Alan Turing',
    organizerContact: '9123456780',
    guestName: 'Prof. R. Ramanujan',
    expectedParticipants: 80,
    status: 'CONFIRMED',
    registrations: [],
    // Logistical Data
    refreshments: ['Morning coffee & biscuits', 'Veg Lunch Buffet for 90 pax'],
    refreshmentsDelivered: false,
    securityNeeds: 'Standard hall security.',
    electricalNeeds: ['Projector', 'Laptop Audio Connection'],
    storeItems: ['Whiteboard markers (Blue/Black)', 'Water bottles x20']
  },
  {
    id: 'e3',
    title: 'Quantum Physics Workshop',
    department: 'Physics',
    date: dayAfter,
    startTime: '14:00',
    endTime: '17:00',
    hallId: 'h4',
    organizerId: 'u7',
    organizerName: 'Prof. C.V. Raman',
    organizerContact: '9988776611',
    guestName: 'Dr. S. Hawking',
    expectedParticipants: 40,
    status: 'CONFIRMED',
    registrations: [],
    refreshments: ['Evening tea and snacks'],
    refreshmentsDelivered: false,
    electricalNeeds: ['Smart TV Remote', 'Extension Cord']
  },
  {
    id: 'e4',
    title: 'CS Lab Demo: Cloud Computing',
    department: 'Computer Science',
    date: today,
    startTime: '14:00',
    endTime: '16:00',
    hallId: 'h4',
    organizerId: 'u2',
    organizerName: 'Prof. Sarah Smith',
    organizerContact: '9876543210',
    guestName: 'Internal Faculty',
    expectedParticipants: 30,
    status: 'CONFIRMED',
    registrations: [],
    labRequirements: ['Access to Lab 3', 'AWS Credentials ready on 30 terminals', 'Ubuntu OS required'],
    electricalNeeds: ['UPS Check for Lab 3'],
    storeItems: ['Chart paper x5']
  }
];

// --- Mock Service ---

class MockService {
  private events: Event[] = [...INITIAL_EVENTS];
  private exchangeRequests: ExchangeRequest[] = [];
  private currentUser: User | null = null;

  // Auth
  authenticate(email: string, password: string): User | null {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      this.currentUser = userWithoutPassword;
      return userWithoutPassword;
    }
    return null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }

  // Getters
  getHalls() { return HALLS; }
  
  getEvents() { return this.events; }
  
  getEventsByDate(date: string) {
    return this.events.filter(e => e.date === date && e.status !== 'CANCELLED');
  }

  // Booking Logic
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

  // Support Actions
  markRefreshmentsDelivered(eventId: string) {
    this.events = this.events.map(e => 
      e.id === eventId ? { ...e, refreshmentsDelivered: true } : e
    );
  }

  // Student Actions
  registerStudent(eventId: string, student: User, details: { rollNo: string, phone: string }) {
    this.events = this.events.map(e => {
      if (e.id === eventId) {
        if (e.registrations.some(r => r.studentId === student.id)) return e; // Already registered
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

  // Exchange Logic
  requestExchange(requesterId: string, conflictEvent: Event, proposedEventDetails: Omit<Event, 'id' | 'registrations' | 'status'>): boolean {
    // In a real app, this sends an email via Nodemailer
    console.log(`[EMAIL SENT] To: ${conflictEvent.organizerName} | Subject: Hall Exchange Request for ${conflictEvent.title}`);
    
    this.exchangeRequests.push({
      id: `ex${Date.now()}`,
      requesterId,
      requesterName: this.currentUser?.name || 'Unknown',
      targetEventId: conflictEvent.id,
      targetEventTitle: conflictEvent.title,
      proposedEventDetails: proposedEventDetails,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });
    return true;
  }

  getPendingRequestsForUser(userId: string): ExchangeRequest[] {
    // Find requests where the target event is organized by this user
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

    // IF APPROVED:
    // 1. Cancel the target event
    this.cancelEvent(request.targetEventId);

    // 2. Book the new event
    this.bookEvent(request.proposedEventDetails);

    // 3. Update request status
    this.exchangeRequests[requestIndex].status = 'APPROVED';
    
    console.log(`[EMAIL SENT] To: ${request.requesterName} | Subject: Exchange Approved!`);
  }
}

export const mockService = new MockService();