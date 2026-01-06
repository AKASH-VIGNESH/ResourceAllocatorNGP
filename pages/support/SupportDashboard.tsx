import React, { useEffect, useState } from 'react';
import { useAuth } from '../../App';
import { mockService } from '../../services/mockData';
import { Event, UserRole } from '../../types';
import { Calendar, Clock, MapPin, User, CheckCircle, AlertCircle, Truck } from 'lucide-react';

const SupportDashboard = () => {
  const { user } = useAuth();
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [tomorrowEvents, setTomorrowEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow'>('today');

  useEffect(() => {
    refreshEvents();
  }, []);

  const refreshEvents = () => {
    const allEvents = mockService.getEvents().filter(e => e.status === 'CONFIRMED');
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    setTodayEvents(allEvents.filter(e => e.date === today));
    setTomorrowEvents(allEvents.filter(e => e.date === tomorrow));
  };

  const handleMarkDelivered = (eventId: string) => {
    mockService.markRefreshmentsDelivered(eventId);
    refreshEvents();
  };

  const getDepartmentTitle = () => {
    switch (user?.role) {
      case UserRole.STAFF_CANTEEN: return "Logistics Management Portal";
      case UserRole.STAFF_SECURITY: return "Safety Control Dashboard";
      case UserRole.STAFF_ELECTRICAL: return "Infrastructure Portal";
      case UserRole.STAFF_CS: return "Tech Assets & Operations";
      case UserRole.STAFF_STORE: return "Resource Store Inventory";
      default: return "Support Dashboard";
    }
  };

  const getEmptyMessage = (isToday: boolean) => {
    return isToday 
      ? "No events scheduled for today require your department's attention."
      : "No upcoming events for tomorrow.";
  };

  const renderRequirementContent = (event: Event) => {
    switch (user?.role) {
      case UserRole.STAFF_CANTEEN:
        return (
          <div style={{ background: 'var(--warning-bg)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #fed7aa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ color: 'var(--warning-text)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Catering & Supply</h4>
                {event.refreshments && event.refreshments.length > 0 ? (
                  <ul className="text-sm list-disc pl-4" style={{ margin: 0 }}>
                    {event.refreshments.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No specific supply requirements listed.</p>
                )}
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  Headcount: {event.expectedParticipants}
                </div>
              </div>

              {activeTab === 'today' && event.refreshments && event.refreshments.length > 0 && (
                <div style={{ marginLeft: '1rem' }}>
                  {event.refreshmentsDelivered ? (
                    <button disabled className="btn" style={{ background: 'var(--success)', color: 'white', opacity: 1, cursor: 'default', whiteSpace: 'nowrap', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}>
                      <CheckCircle size={16} className="mr-2" />
                      Supplied
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleMarkDelivered(event.id)}
                      className="btn" 
                      style={{ background: 'var(--white)', border: '1px solid var(--warning-text)', color: 'var(--warning-text)', whiteSpace: 'nowrap', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                    >
                      <Truck size={16} className="mr-2" />
                      Mark Fulfilled
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case UserRole.STAFF_SECURITY:
        return (
          <div style={{ background: 'var(--purple-bg)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #e9d5ff' }}>
             <h4 style={{ color: 'var(--purple-text)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Safety Detail</h4>
             <div className="text-sm mb-2">
               <strong>Lead Guest:</strong> {event.guestName}
             </div>
             {event.vipArrival && (
               <div className="text-sm mb-2">
                 <strong>VIP Arrival:</strong> {event.vipArrival}
               </div>
             )}
             {event.securityNeeds ? (
                <div className="text-sm">
                  <strong>Protocol:</strong> {event.securityNeeds}
                </div>
             ) : (
               <p className="text-sm text-gray-500 italic">Standard protocols apply.</p>
             )}
          </div>
        );

      case UserRole.STAFF_ELECTRICAL:
        return (
          <div style={{ background: 'var(--primary-bg)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #bae6fd' }}>
            <h4 style={{ color: 'var(--primary-dark)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Infrastructure Requirements</h4>
            {event.electricalNeeds && event.electricalNeeds.length > 0 ? (
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }} className="text-sm">
                {event.electricalNeeds.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No special infra setup requested.</p>
            )}
          </div>
        );
      
      case UserRole.STAFF_CS:
        return (
          <div style={{ background: 'var(--gray-100)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--gray-300)' }}>
            <h4 style={{ color: 'var(--gray-700)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Tech & Logistics</h4>
             {event.labRequirements && event.labRequirements.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }} className="text-sm">
                  {event.labRequirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
             ) : (
               <p className="text-sm text-gray-500 italic">No specific tech assets requested.</p>
             )}
          </div>
        );

      case UserRole.STAFF_STORE:
        return (
          <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #bbf7d0' }}>
            <h4 style={{ color: 'var(--success-text)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>System Inventory Request</h4>
            {event.storeItems && event.storeItems.length > 0 ? (
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }} className="text-sm">
                {event.storeItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
               <p className="text-sm text-gray-500 italic">No inventory requested.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const currentList = activeTab === 'today' ? todayEvents : tomorrowEvents;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{getDepartmentTitle()}</h1>
        <p className="text-gray-500">Manage operational requirements for ecosystem events</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--gray-200)' }}>
        <button 
          onClick={() => setActiveTab('today')}
          style={{ 
            padding: '1rem 2rem', 
            borderBottom: activeTab === 'today' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'today' ? 'var(--primary)' : 'var(--gray-500)',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            cursor: 'pointer'
          }}
        >
          Active Cycle ({todayEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab('tomorrow')}
          style={{ 
            padding: '1rem 2rem', 
            borderBottom: activeTab === 'tomorrow' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'tomorrow' ? 'var(--primary)' : 'var(--gray-500)',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            cursor: 'pointer'
          }}
        >
          Next Cycle ({tomorrowEvents.length})
        </button>
      </div>

      <div className="grid-2">
        {currentList.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: 'var(--white)', borderRadius: '0.75rem', border: '1px solid var(--gray-200)' }}>
            <CheckCircle className="text-gray-300 mx-auto mb-2" size={48} />
            <p className="text-gray-500">{getEmptyMessage(activeTab === 'today')}</p>
          </div>
        ) : (
          currentList.map(event => (
            <div key={event.id} className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <div>
                   <span className="text-xs font-bold text-primary uppercase">{event.department}</span>
                   <h3 className="text-lg font-bold">{event.title}</h3>
                </div>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                   <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Clock size={16} className="mr-2 text-gray-400" />
                      {event.startTime} - {event.endTime}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center' }}>
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      {mockService.getHalls().find(h => h.id === event.hallId)?.name}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center' }}>
                      <User size={16} className="mr-2 text-gray-400" />
                      Lead: {event.organizerName} ({event.organizerContact})
                   </div>
                </div>
                {renderRequirementContent(event)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;