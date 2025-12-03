import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { mockService } from '../../services/mockData';
import { Hall } from '../../types';
import { Search, AlertCircle, CheckCircle, Mail, User, Building, Clock, Calendar as CalendarIcon } from 'lucide-react';

const BookHall = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const halls = mockService.getHalls();
  
  const [step, setStep] = useState(1);
  const [conflictEvent, setConflictEvent] = useState<any>(null);
  const [exchangeSent, setExchangeSent] = useState(false);

  const [formData, setFormData] = useState({
    department: user?.department || '',
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    hallId: '',
    guestName: '',
    expectedParticipants: 0,
    organizerName: user?.name || '',
    organizerContact: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setConflictEvent(null); 
    setExchangeSent(false);
  };

  const checkAvailability = () => {
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.hallId) return;
    
    const { available, conflictEvent } = mockService.checkAvailability(
      formData.hallId, 
      formData.date, 
      formData.startTime, 
      formData.endTime
    );

    if (!available) {
      setConflictEvent(conflictEvent);
    } else {
      setStep(2); // Proceed to next part of form
    }
  };

  const handleRequestExchange = () => {
    if (conflictEvent && user) {
      // Need to construct the proposed event object to send with request
      const proposedEvent = {
        ...formData,
        organizerId: user.id,
        expectedParticipants: Number(formData.expectedParticipants)
      };
      
      mockService.requestExchange(user.id, conflictEvent, proposedEvent);
      setExchangeSent(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    mockService.bookEvent({
      ...formData,
      organizerId: user.id,
      expectedParticipants: Number(formData.expectedParticipants)
    });

    alert('Hall booked successfully!');
    navigate('/teacher');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book a Hall</h1>
        <p className="text-gray-500">Fill in the details below to reserve a venue for your program.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="flex border-b border-gray-200">
          <div className={`flex-1 py-3 text-center text-sm font-medium ${step === 1 ? 'bg-brand-50 text-brand-600' : 'text-green-600'}`}>
            1. Availability Check
          </div>
          <div className={`flex-1 py-3 text-center text-sm font-medium ${step === 2 ? 'bg-brand-50 text-brand-600' : 'text-gray-400'}`}>
            2. Program Details
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Step 1: Availability Check */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="hallId" className="block text-sm font-medium text-gray-700 mb-1">Select Hall</label>
                <select 
                  id="hallId"
                  name="hallId"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  value={formData.hallId}
                  onChange={handleChange}
                >
                  <option value="">-- Choose a Venue --</option>
                  {halls.map(h => (
                    <option key={h.id} value={h.id}>{h.name} (Capacity: {h.capacity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Program Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon size={18} className="text-black" />
                  </div>
                  <input 
                    id="date"
                    type="date" 
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>{/* Spacer */}</div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Time Duration (From)</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-black" />
                  </div>
                  <input 
                    id="startTime"
                    type="time" 
                    name="startTime"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">Time Duration (To)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-black" />
                  </div>
                  <input 
                    id="endTime"
                    type="time" 
                    name="endTime"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Conflict UI */}
            {conflictEvent && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start">
                  <AlertCircle className="text-red-600 mt-1 mr-3" size={20} />
                  <div className="flex-1">
                    <h3 className="text-red-800 font-semibold">Hall Unavailable</h3>
                    <p className="text-red-700 text-sm mt-1">
                      Already booked by <strong>{conflictEvent.organizerName}</strong> for "{conflictEvent.title}" ({conflictEvent.startTime} - {conflictEvent.endTime}).
                    </p>
                    
                    {!exchangeSent ? (
                      <div className="mt-3">
                         <p className="text-xs text-red-600 mb-2">Fill in your program details below to request a swap.</p>
                         <input 
                            type="text"
                            name="title"
                            placeholder="Your Program Name (Required for Request)"
                            className="w-full px-3 py-1.5 mb-2 bg-white border border-red-300 rounded text-sm"
                            value={formData.title}
                            onChange={handleChange}
                         />
                        <button 
                          type="button"
                          onClick={handleRequestExchange}
                          disabled={!formData.title}
                          className="flex items-center text-sm bg-white border border-red-300 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Mail size={14} className="mr-2" />
                          Request Exchange via Email
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center text-sm text-green-700 font-medium">
                        <CheckCircle size={16} className="mr-2" />
                        Exchange request sent to {conflictEvent.organizerName}!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button 
                type="button"
                onClick={checkAvailability}
                disabled={!formData.date || !formData.startTime || !formData.endTime || !formData.hallId}
                className="bg-brand-600 text-white px-6 py-2.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md"
              >
                Check Availability <Search size={16} className="ml-2" />
              </button>
            </div>
          </div>

          {/* Step 2: Event Details */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Auto-filled / Read-only Fields */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department Name</label>
                    <div className="flex items-center text-gray-700 font-medium">
                      <Building size={16} className="mr-2 text-gray-400" />
                      {formData.department}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Organizer Name</label>
                    <div className="flex items-center text-gray-700 font-medium">
                       <User size={16} className="mr-2 text-gray-400" />
                       {formData.organizerName}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Name of the Program</label>
                  <input 
                    id="title"
                    type="text" 
                    name="title"
                    required
                    placeholder="e.g., Annual Science Symposium"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">Name of the Chief Guest</label>
                  <input 
                    id="guestName"
                    type="text" 
                    name="guestName"
                    required
                    placeholder="e.g., Dr. A. P. J. Abdul Kalam"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.guestName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="expectedParticipants" className="block text-sm font-medium text-gray-700 mb-1">Number of Participants</label>
                  <input 
                    id="expectedParticipants"
                    type="number" 
                    name="expectedParticipants"
                    required
                    min="1"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.expectedParticipants}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="organizerContact" className="block text-sm font-medium text-gray-700 mb-1">Organizer Contact Number</label>
                  <input 
                    id="organizerContact"
                    type="tel" 
                    name="organizerContact"
                    required
                    placeholder="e.g., 9876543210"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.organizerContact}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-6">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Back to Availability
                </button>
                <button 
                  type="submit"
                  className="bg-brand-600 text-white px-8 py-3 rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 font-medium flex items-center"
                >
                  Confirm Booking <CheckCircle size={18} className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookHall;