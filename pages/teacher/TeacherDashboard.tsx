import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockService } from '../../services/mockData';
import { Event, ExchangeRequest } from '../../types';
import { Calendar, Users, MapPin, ArrowRight, Inbox, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../App';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([]);
  
  const [actionConfirmation, setActionConfirmation] = useState<{
    request: ExchangeRequest;
    isApproving: boolean;
  } | null>(null);

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const refreshData = () => {
    if (!user) return;
    const allEvents = mockService.getEvents();
    setMyEvents(allEvents.filter(e => e.organizerId === user.id));
    setExchangeRequests(mockService.getPendingRequestsForUser(user.id));
  };

  const initiateAction = (request: ExchangeRequest, isApproving: boolean) => {
    setActionConfirmation({ request, isApproving });
  };

  const confirmAction = () => {
    if (!actionConfirmation) return;
    const { request, isApproving } = actionConfirmation;
    mockService.resolveExchangeRequest(request.id, isApproving);
    refreshData();
    setActionConfirmation(null);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <Link 
          to="/teacher/book" 
          className="btn btn-primary"
        >
          <span className="mr-2">+</span> Book a Hall
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid-3 mb-6">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
            <p className="text-2xl font-bold mt-2">
              {myEvents.filter(e => new Date(e.date) >= new Date()).length}
            </p>
          </div>
          <div style={{ background: 'var(--primary-bg)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <Calendar size={24} />
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Participants</p>
            <p className="text-2xl font-bold mt-2">
              {myEvents.reduce((acc, curr) => acc + curr.registrations.length, 0)}
            </p>
          </div>
          <div style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <Users size={24} />
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="text-sm font-medium text-gray-500">Halls Booked</p>
            <p className="text-2xl font-bold mt-2">{myEvents.length}</p>
          </div>
          <div style={{ background: 'var(--purple-bg)', color: 'var(--purple-text)', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <MapPin size={24} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {exchangeRequests.length > 0 && (
        <div className="card mb-6" style={{ borderColor: 'var(--warning-text)' }}>
          <div className="card-header" style={{ background: 'var(--warning-bg)', borderBottomColor: 'var(--warning-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--warning-text)', fontWeight: 'bold' }}>
              <Inbox className="mr-2" size={20} />
              Incoming Hall Exchange Requests
            </div>
          </div>
          <div>
            {exchangeRequests.map(req => (
              <div key={req.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="mb-1">
                    <span className="font-bold mr-2">{req.requesterName}</span>
                    <span className="text-sm text-gray-500">wants to book your slot for:</span>
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>{req.proposedEventDetails.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Replacing your event: <strong>{req.targetEventTitle}</strong> on {new Date(req.proposedEventDetails.date).toDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => initiateAction(req, false)}
                    className="btn"
                    style={{ border: '1px solid var(--danger-bg)', color: 'var(--danger)', background: 'white' }}
                  >
                    <XCircle size={18} className="mr-2" /> Reject
                  </button>
                  <button 
                    onClick={() => initiateAction(req, true)}
                    className="btn btn-success"
                  >
                    <CheckCircle size={18} className="mr-2" /> Approve Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-bold">My Scheduled Events</h2>
        </div>
        
        {myEvents.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem', color: 'var(--gray-500)' }}>
            You haven't booked any events yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Program Name</th>
                  <th>Date & Time</th>
                  <th>Hall</th>
                  <th>Registrations</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myEvents.map(event => (
                  <tr key={event.id}>
                    <td className="font-medium">{event.title}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500">{event.startTime} - {event.endTime}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--primary)' }}>{mockService.getHalls().find(h => h.id === event.hallId)?.name}</td>
                    <td>{event.registrations.length} / {event.expectedParticipants}</td>
                    <td>
                      <span className={`badge ${event.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/teacher/event/${event.id}`} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}>
                        Details <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {actionConfirmation && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '1.5rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: actionConfirmation.isApproving ? 'var(--success-bg)' : 'var(--danger-bg)', color: actionConfirmation.isApproving ? 'var(--success-text)' : 'var(--danger-text)' }}>
              <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2">
              {actionConfirmation.isApproving ? 'Approve Exchange Request?' : 'Reject Request?'}
            </h3>
            
            <p className="text-center text-gray-500 text-sm mb-6">
              {actionConfirmation.isApproving ? 'This will cancel your current event to allow the new one. This cannot be undone.' : 'Are you sure you want to reject the request?'}
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setActionConfirmation(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className={`btn ${actionConfirmation.isApproving ? 'btn-success' : 'btn-danger'}`}
                style={{ flex: 1 }}
              >
                {actionConfirmation.isApproving ? 'Yes, Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;