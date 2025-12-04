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
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Principal's Overview</h1>
        <p className="text-gray-500">College-wide resource and event analytics</p>
      </div>

      <div className="grid-4 mb-6">
        <div className="card" style={{ padding: '1.5rem' }}>
          <p className="text-sm font-medium text-gray-500">Total Events</p>
          <p className="text-2xl font-bold mt-2" style={{ color: 'var(--primary)' }}>{events.length}</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p className="text-sm font-medium text-gray-500">Today's Events</p>
          <p className="text-2xl font-bold mt-2" style={{ color: 'var(--success)' }}>
            {events.filter(e => e.date === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p className="text-sm font-medium text-gray-500">Student Engagements</p>
          <p className="text-2xl font-bold mt-2" style={{ color: 'var(--purple)' }}>{totalStudents}</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p className="text-sm font-medium text-gray-500">Active Conflicts</p>
          <p className="text-2xl font-bold mt-2" style={{ color: 'var(--danger)' }}>0</p>
        </div>
      </div>

      <div className="grid-2 mb-6">
        <div className="card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="text-lg font-bold mb-4">Events per Department</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="text-lg font-bold mb-4">Upcoming Schedule</h3>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {events.slice(0, 5).map(e => (
               <div key={e.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', marginBottom: '0.5rem', border: '1px solid var(--gray-100)', borderRadius: '0.5rem' }}>
                 <div style={{ background: 'var(--primary-bg)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem', marginRight: '1rem', textAlign: 'center', minWidth: '3.5rem' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                    <span style={{ display: 'block', fontSize: '1.125rem', fontWeight: 'bold' }}>{new Date(e.date).getDate()}</span>
                 </div>
                 <div style={{ flex: 1 }}>
                   <h4 className="text-sm font-bold" style={{ marginBottom: '0.125rem' }}>{e.title}</h4>
                   <p className="text-xs text-gray-500">{e.department} • {mockService.getHalls().find(h => h.id === e.hallId)?.name}</p>
                 </div>
                 <span style={{ fontSize: '0.75rem', background: 'var(--gray-100)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                   {e.startTime}
                 </span>
               </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-bold">All Events Monitor</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Organizer</th>
                <th>Department</th>
                <th>Hall</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td className="font-medium">{event.title}</td>
                  <td>{event.organizerName}</td>
                  <td>{event.department}</td>
                  <td>{mockService.getHalls().find(h => h.id === event.hallId)?.name}</td>
                  <td>
                    <span className={`badge ${event.status === 'CONFIRMED' ? 'badge-success' : 'badge-gray'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => handleDeleteClick(event)}
                      className="btn"
                      style={{ color: 'var(--danger)', padding: '0.5rem' }}
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

      {eventToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '1.5rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Delete Event?</h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              Are you sure you want to permanently delete <strong>{eventToDelete.title}</strong>? 
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setEventToDelete(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={confirmDelete} className="btn btn-danger" style={{ flex: 1 }}>Yes, Delete It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalDashboard;