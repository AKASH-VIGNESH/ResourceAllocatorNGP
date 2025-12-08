import React, { useEffect, useState } from 'react';
import { useAuth } from '../../App';
import { mockService } from '../../services/mockData';
import { Event } from '../../types';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MyEvents = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (user) {
      const allEvents = mockService.getEvents();
      const registered = allEvents.filter(e => e.registrations.some(r => r.studentId === user.id));
      setMyEvents(registered);
    }
  }, [user]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="text-2xl font-bold mb-6">My Registrations</h1>

      {myEvents.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ background: 'var(--gray-100)', width: '4rem', height: '4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Calendar className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-gray-500 mt-2">You haven't registered for any events yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myEvents.map(event => (
            <div key={event.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', opacity: event.status === 'CANCELLED' ? 0.8 : 1 }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                   <span style={{ color: 'var(--primary)' }}>{event.department}</span>
                   <span style={{ margin: '0 0.5rem', color: 'var(--gray-300)' }}>•</span>
                   
                   {event.status === 'CONFIRMED' && (
                     <span className="badge badge-success">
                       <CheckCircle size={10} className="mr-1" /> Confirmed
                     </span>
                   )}
                   {event.status === 'CANCELLED' && (
                     <span className="badge badge-danger">
                       <XCircle size={10} className="mr-1" /> Cancelled
                     </span>
                   )}
                   {event.status === 'COMPLETED' && (
                     <span className="badge badge-gray">
                       Completed
                     </span>
                   )}
                </div>
                
                <h3 className="text-xl font-bold" style={{ textDecoration: event.status === 'CANCELLED' ? 'line-through' : 'none', color: event.status === 'CANCELLED' ? 'var(--gray-500)' : 'inherit' }}>
                  {event.title}
                </h3>

                {event.status === 'CANCELLED' && (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '0.5rem', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center' }}>
                    <AlertCircle size={16} className="mr-2" />
                    <span><strong>Event Cancelled:</strong> Please contact the organizer for more info.</span>
                  </div>
                )}

                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar size={16} className="mr-1 text-gray-400" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Clock size={16} className="mr-1 text-gray-400" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MapPin size={16} className="mr-1 text-gray-400" />
                    {mockService.getHalls().find(h => h.id === event.hallId)?.name}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div className="text-xs text-gray-400 uppercase">Organizer</div>
                <div className="font-medium">{event.organizerName}</div>
                <div className="text-sm text-gray-500">{event.organizerContact}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;