import React, { useEffect, useState } from 'react';
import { useAuth } from '../../App';
import { mockService } from '../../services/mockData';
import { Event } from '../../types';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

const MyEvents = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (user) {
      const allEvents = mockService.getEvents();
      // Filter events where registrations array contains current user id
      const registered = allEvents.filter(e => e.registrations.some(r => r.studentId === user.id));
      setMyEvents(registered);
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Registrations</h1>

      {myEvents.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No events found</h3>
          <p className="text-gray-500 mt-2">You haven't registered for any events yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myEvents.map(event => (
            <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-sm text-brand-600 font-semibold mb-1">
                   <span>{event.department}</span>
                   <span className="text-gray-300">•</span>
                   <span className="text-green-600 flex items-center text-xs bg-green-50 px-2 py-0.5 rounded-full">
                     <CheckCircle size={10} className="mr-1" /> Confirmed
                   </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1.5 text-gray-400" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1.5 text-gray-400" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1.5 text-gray-400" />
                    {mockService.getHalls().find(h => h.id === event.hallId)?.name}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 text-right">
                <div className="text-xs text-gray-400 uppercase">Organizer</div>
                <div className="font-medium text-gray-900">{event.organizerName}</div>
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