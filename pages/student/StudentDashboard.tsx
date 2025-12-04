import React, { useState, useEffect } from 'react';
import { mockService } from '../../services/mockData';
import { Event } from '../../types';
import { useAuth } from '../../App';
import { Calendar, Clock, MapPin, Search, User } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const [regForm, setRegForm] = useState({ rollNo: '', phone: '' });

  useEffect(() => {
    setEvents(mockService.getEvents().filter(e => e.status === 'CONFIRMED' && new Date(e.date) >= new Date()));
  }, []);

  const handleRegisterClick = (eventId: string) => {
    setRegisteringId(eventId);
  };

  const submitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && registeringId) {
      mockService.registerStudent(registeringId, user, regForm);
      setEvents(prev => prev.map(ev => { 
        if (ev.id === registeringId) {
          return {
            ...ev,
            registrations: [...ev.registrations, { studentId: user.id, studentName: user.name, ...regForm, registeredAt: new Date().toISOString() }]
          };
        }
        return ev;
      }));
      setRegisteringId(null);
      setRegForm({ rollNo: '', phone: '' });
      alert("Registration Successful!");
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-2xl font-bold">Upcoming Events</h1>
            <p className="text-gray-500">Discover and participate in college activities</p>
          </div>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search className="text-gray-400" size={18} style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid-3">
        {filteredEvents.map(event => {
          const isRegistered = event.registrations.some(r => r.studentId === user?.id);
          
          return (
            <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '6px', background: 'var(--primary)' }}></div>
              <div className="card-body" style={{ flex: 1 }}>
                <div className="text-xs font-bold mb-2 uppercase" style={{ color: 'var(--primary)' }}>{event.department}</div>
                <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {new Date(event.date).toDateString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Clock size={16} className="mr-2 text-gray-400" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    {mockService.getHalls().find(h => h.id === event.hallId)?.name}
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)', fontSize: '0.875rem' }}>
                  <span className="text-gray-500">Guest: </span>
                  <span className="font-medium">{event.guestName}</span>
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-100)' }}>
                {isRegistered ? (
                  <button disabled className="btn" style={{ width: '100%', background: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid #bbf7d0', cursor: 'default' }}>
                    Registered
                  </button>
                ) : (
                  <button 
                    onClick={() => handleRegisterClick(event.id)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {registeringId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '1.5rem' }}>
            <h3 className="text-xl font-bold mb-4">Complete Registration</h3>
            <p className="text-gray-500 text-sm mb-6">
              You are registering for <strong>{events.find(e => e.id === registeringId)?.title}</strong>.
            </p>
            
            <form onSubmit={submitRegistration}>
               <div className="mb-4">
                <label className="input-label">Student Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} className="text-gray-400" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  <input 
                    type="text" 
                    readOnly
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', background: 'var(--gray-50)' }}
                    value={user?.name || ''}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="rollNo" className="input-label">Roll Number</label>
                <input 
                  id="rollNo"
                  type="text" 
                  required
                  className="form-input"
                  value={regForm.rollNo}
                  onChange={e => setRegForm({...regForm, rollNo: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="input-label">Phone Number</label>
                <input 
                  id="phone"
                  type="tel" 
                  required
                  className="form-input"
                  value={regForm.phone}
                  onChange={e => setRegForm({...regForm, phone: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setRegisteringId(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;