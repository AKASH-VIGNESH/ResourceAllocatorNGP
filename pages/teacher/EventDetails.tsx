import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockService } from '../../services/mockData';
import { Event } from '../../types';
import { Download, Users, Calendar, MapPin, User, ArrowLeft, Ban, AlertTriangle } from 'lucide-react';
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

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (!event) return;
    mockService.cancelEvent(event.id);
    // Update local state to reflect change immediately
    setEvent(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
    setShowCancelModal(false);
  };

  if (!event) return <div className="p-8 text-center">Loading or Event not found...</div>;

  return (
    <div className="space-y-6">
      <Link to="/teacher" className="inline-flex items-center text-gray-500 hover:text-brand-600 mb-4 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-brand-50 p-6 border-b border-brand-100 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">{event.title}</h1>
            <p className="text-brand-600 mt-1 flex items-center">
              <Calendar size={16} className="mr-2" />
              {new Date(event.date).toDateString()} • {event.startTime} - {event.endTime}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
             <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {event.status}
             </span>

             {event.status === 'CONFIRMED' && (
               <button 
                 onClick={handleCancelClick}
                 className="flex items-center space-x-1 px-4 py-1.5 rounded-lg text-sm font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
               >
                 <Ban size={16} className="mr-1" />
                 <span>Cancel Event</span>
               </button>
             )}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Venue</p>
                <p className="text-gray-900 font-medium flex items-center mt-1">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {mockService.getHalls().find(h => h.id === event.hallId)?.name}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Chief Guest</p>
                <p className="text-gray-900 font-medium flex items-center mt-1">
                  <User size={16} className="mr-2 text-gray-400" />
                  {event.guestName}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Registered Students</h3>
                <button 
                  onClick={handleExport}
                  disabled={event.registrations.length === 0}
                  className="flex items-center space-x-2 text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Download size={16} />
                  <span>Export Excel</span>
                </button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-medium">
                    <tr>
                      <th className="px-4 py-2">Roll No</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {event.registrations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No registrations yet.</td>
                      </tr>
                    ) : (
                      event.registrations.map((reg, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-mono text-gray-600">{reg.rollNo}</td>
                          <td className="px-4 py-2 font-medium text-gray-900">{reg.studentName}</td>
                          <td className="px-4 py-2 text-gray-600">{reg.phone}</td>
                          <td className="px-4 py-2 text-gray-500">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 h-fit">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Organizer Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-900 font-medium">{event.organizerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contact</span>
                <span className="text-gray-900 font-medium">{event.organizerContact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span className="text-gray-900 font-medium">{event.department}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Cancel Event?</h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              Are you sure you want to cancel <strong>{event.title}</strong>? 
              <br/>This will notify all registered students and free up the hall. This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Keep Event
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm transition-colors"
              >
                Yes, Cancel It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;