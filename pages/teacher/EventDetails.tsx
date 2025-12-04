import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockService } from '../../services/mockData';
import { Event } from '../../types';
import { Download, Calendar, MapPin, User, ArrowLeft, Ban, AlertTriangle } from 'lucide-react';
import { exportToExcel } from '../../utils/excelExport';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (eventId) {
      const found = mockService.getEvents().find(e => e.id === eventId);
      setEvent(found || null);
    }
  }, [eventId]);

  const handleExport = () => {
    if (!event) return;
    const dataToExport = event.registrations.map(reg => ({
      "Name": reg.studentName,
      "Roll No": reg.rollNo,
      "Phone": reg.phone,
      "Registered At": new Date(reg.registeredAt).toLocaleString()
    }));
    exportToExcel(dataToExport, `${event.title}_Students`);
  };

  const confirmCancel = () => {
    if (!event) return;
    mockService.cancelEvent(event.id);
    setEvent(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
    setShowCancelModal(false);
  };

  if (!event) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="fade-in">
      <Link to="/teacher" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--gray-500)', marginBottom: '1rem', textDecoration: 'none' }}>
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>

      <div className="card">
        <div className="card-header" style={{ background: 'var(--primary-bg)', display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <p style={{ color: 'var(--primary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center' }}>
                <Calendar size={16} className="mr-2" />
                {new Date(event.date).toDateString()} • {event.startTime} - {event.endTime}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span className={`badge ${event.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                  {event.status}
               </span>

               {event.status === 'CONFIRMED' && (
                 <button 
                   onClick={() => setShowCancelModal(true)}
                   className="btn"
                   style={{ border: '1px solid var(--danger-bg)', color: 'var(--danger)', fontSize: '0.875rem' }}
                 >
                   <Ban size={16} className="mr-1" />
                   Cancel Event
                 </button>
               )}
            </div>
          </div>
        </div>

        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid-2">
              <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                <p className="text-xs font-bold text-gray-500 uppercase">Venue</p>
                <p className="font-medium mt-1 flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {mockService.getHalls().find(h => h.id === event.hallId)?.name}
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                <p className="text-xs font-bold text-gray-500 uppercase">Chief Guest</p>
                <p className="font-medium mt-1 flex items-center">
                  <User size={16} className="mr-2 text-gray-400" />
                  {event.guestName}
                </p>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="text-lg font-bold">Registered Students</h3>
                <button 
                  onClick={handleExport}
                  disabled={event.registrations.length === 0}
                  className="btn btn-success"
                  style={{ fontSize: '0.875rem' }}
                >
                  <Download size={16} />
                  <span>Export Excel</span>
                </button>
              </div>
              
              <div className="table-container" style={{ border: '1px solid var(--gray-200)', borderRadius: '0.5rem' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.registrations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-500" style={{ padding: '2rem' }}>No registrations yet.</td>
                      </tr>
                    ) : (
                      event.registrations.map((reg, idx) => (
                        <tr key={idx}>
                          <td style={{ fontFamily: 'monospace' }}>{reg.rollNo}</td>
                          <td className="font-medium">{reg.studentName}</td>
                          <td>{reg.phone}</td>
                          <td style={{ color: 'var(--gray-500)' }}>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '0.75rem', height: 'fit-content' }}>
            <h3 className="text-sm font-bold uppercase mb-4">Organizer Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-gray-500">Name</span>
                <span className="font-medium">{event.organizerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-gray-500">Contact</span>
                <span className="font-medium">{event.organizerContact}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-gray-500">Department</span>
                <span className="font-medium">{event.department}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '1.5rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Cancel Event?</h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              This will notify students and free up the hall. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowCancelModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Keep Event</button>
              <button onClick={confirmCancel} className="btn btn-danger" style={{ flex: 1 }}>Yes, Cancel It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;