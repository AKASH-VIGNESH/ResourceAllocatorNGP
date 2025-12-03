import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockService } from '../../services/mockData';
import { Event, ExchangeRequest } from '../../types';
import { Calendar, Users, MapPin, Clock, ArrowRight, Inbox, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../App';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([]);
  
  // State for the confirmation modal
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
    
    // Fetch pending requests
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
    setActionConfirmation(null); // Close modal
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <Link 
          to="/teacher/book" 
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center"
        >
          <span className="mr-2">+</span> Book a Hall
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {myEvents.filter(e => new Date(e.date) >= new Date()).length}
              </p>
            </div>
            <div className="bg-brand-50 p-3 rounded-lg text-brand-600">
              <Calendar size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {myEvents.reduce((acc, curr) => acc + curr.registrations.length, 0)}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-green-600">
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Halls Booked</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{myEvents.length}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
              <MapPin size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications / Exchange Requests */}
      {exchangeRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-orange-100 bg-orange-50 flex items-center">
            <Inbox className="text-orange-600 mr-2" size={20} />
            <h2 className="text-lg font-bold text-orange-900">Incoming Hall Exchange Requests</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {exchangeRequests.map(req => (
              <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="font-bold text-gray-900 mr-2">{req.requesterName}</span>
                    <span className="text-sm text-gray-500">wants to book your slot for:</span>
                  </div>
                  <p className="text-lg font-semibold text-brand-700">{req.proposedEventDetails.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Replacing your event: <strong>{req.targetEventTitle}</strong> on {new Date(req.proposedEventDetails.date).toDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <button 
                    onClick={() => initiateAction(req, false)}
                    className="flex items-center px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors"
                  >
                    <XCircle size={18} className="mr-2" /> Reject
                  </button>
                  <button 
                    onClick={() => initiateAction(req, true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm transition-colors"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">My Scheduled Events</h2>
        </div>
        
        {myEvents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            You haven't booked any events yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Program Name</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Hall</th>
                  <th className="px-6 py-3">Registrations</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myEvents.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">{event.startTime} - {event.endTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-600">{mockService.getHalls().find(h => h.id === event.hallId)?.name}</td>
                    <td className="px-6 py-4">{event.registrations.length} / {event.expectedParticipants}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/teacher/event/${event.id}`} className="text-brand-600 hover:text-brand-800 font-medium flex items-center text-xs">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${
              actionConfirmation.isApproving ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {actionConfirmation.isApproving ? 'Approve Exchange Request?' : 'Reject Request?'}
            </h3>
            
            <p className="text-center text-gray-500 text-sm mb-6">
              {actionConfirmation.isApproving ? (
                <>
                  By approving, your event <strong>"{actionConfirmation.request.targetEventTitle}"</strong> will be cancelled to allow <strong>"{actionConfirmation.request.proposedEventDetails.title}"</strong> to take place. This cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to reject the request for <strong>"{actionConfirmation.request.proposedEventDetails.title}"</strong>? The other staff member will be notified.
                </>
              )}
            </p>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setActionConfirmation(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-colors ${
                  actionConfirmation.isApproving 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionConfirmation.isApproving ? 'Yes, Approve Swap' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;