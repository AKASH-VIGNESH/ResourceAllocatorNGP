import React, { useEffect, useState } from 'react';
import { mockService } from '../../services/mockData';
import { Event } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, AlertTriangle } from 'lucide-react';

const PrincipalDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  
  useEffect(() => {
    setEvents(mockService.getEvents());
  }, []);

  // Compute Stats
  const eventsByDept = events.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(eventsByDept).map(dept => ({
    name: dept,
    events: eventsByDept[dept]
  }));

  const totalStudents = events.reduce((acc, curr) => acc + curr.registrations.length, 0);

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      mockService.deleteEvent(eventToDelete.id);
      setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Principal's Overview</h1>
        <p className="text-gray-500">College-wide resource and event analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Events</p>
          <p className="text-3xl font-bold text-brand-600 mt-2">{events.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Today's Events</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {events.filter(e => e.date === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Student Engagements</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active Conflicts</p>
          <p className="text-3xl font-bold text-red-500 mt-2">0</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Events per Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Upcoming Schedule</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {events.slice(0, 5).map(e => (
               <div key={e.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                 <div className="bg-brand-100 text-brand-600 p-2 rounded-lg mr-4 text-center min-w-[3.5rem]">
                    <span className="block text-xs font-bold uppercase">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="block text-lg font-bold">{new Date(e.date).getDate()}</span>
                 </div>
                 <div className="flex-1">
                   <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{e.title}</h4>
                   <p className="text-xs text-gray-500">{e.department} • {mockService.getHalls().find(h => h.id === e.hallId)?.name}</p>
                 </div>
                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                   {e.startTime}
                 </span>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">All Events Monitor</h3>
          <button className="text-brand-600 text-sm font-medium hover:underline">View All Reports</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Organizer</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Hall</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                  <td className="px-6 py-4 text-gray-600">{event.organizerName}</td>
                  <td className="px-6 py-4 text-gray-500">{event.department}</td>
                  <td className="px-6 py-4 text-gray-500">{mockService.getHalls().find(h => h.id === event.hallId)?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                      event.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(event)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" 
                      title="Permanently Delete Event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Event?</h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              Are you sure you want to permanently delete <strong>{eventToDelete.title}</strong>? 
              <br/>This action cannot be undone and will remove all student registrations.
            </p>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setEventToDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm transition-colors"
              >
                Yes, Delete It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalDashboard;