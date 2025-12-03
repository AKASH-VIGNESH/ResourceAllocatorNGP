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

  // Form state for registration modal
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
      setEvents(prev => prev.map(ev => { // Optimistic update
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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="text-gray-500">Discover and participate in college activities</p>
        </div>
        <div className="mt-4 md:mt-0 relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          const isRegistered = event.registrations.some(r => r.studentId === user?.id);
          
          return (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="h-2 bg-brand-500"></div>
              <div className="p-6 flex-1">
                <div className="text-xs font-semibold text-brand-600 mb-2 uppercase tracking-wide">{event.department}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{event.title}</h3>
                
                <div className="space-y-2 mt-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {new Date(event.date).toDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    {mockService.getHalls().find(h => h.id === event.hallId)?.name}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">Guest: </span>
                  <span className="font-medium text-gray-800">{event.guestName}</span>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                {isRegistered ? (
                  <button disabled className="w-full bg-green-100 text-green-700 font-medium py-2 rounded-lg cursor-default border border-green-200">
                    Registered
                  </button>
                ) : (
                  <button 
                    onClick={() => handleRegisterClick(event.id)}
                    className="w-full bg-brand-600 text-white font-medium py-2 rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {registeringId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold mb-4">Complete Registration</h3>
            <p className="text-gray-500 text-sm mb-6">
              You are registering for <strong>{events.find(e => e.id === registeringId)?.title}</strong>.
            </p>
            
            <form onSubmit={submitRegistration} className="space-y-4">
               {/* Read-only Student Name */}
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Student Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    readOnly
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none text-gray-600"
                    value={user?.name || ''}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-1.5">Roll Number</label>
                <input 
                  id="rollNo"
                  type="text" 
                  required
                  placeholder="e.g., CS2023001"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={regForm.rollNo}
                  onChange={e => setRegForm({...regForm, rollNo: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input 
                  id="phone"
                  type="tel" 
                  required
                  placeholder="e.g., 9876543210"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={regForm.phone}
                  onChange={e => setRegForm({...regForm, phone: e.target.value})}
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setRegisteringId(null)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium shadow-sm"
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