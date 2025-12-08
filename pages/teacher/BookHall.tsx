import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { mockService } from '../../services/mockData';
import { Search, AlertCircle, CheckCircle, Mail, User, Building, Clock } from 'lucide-react';
import { Event } from '../../types';

const BookHall = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const halls = mockService.getHalls();
  
  const [step, setStep] = useState(1);
  const [conflictEvent, setConflictEvent] = useState<any>(null);
  const [exchangeSent, setExchangeSent] = useState(false);

  // --- Date Strip State ---
  const [selectedHallId, setSelectedHallId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [datesList, setDatesList] = useState<Array<{ date: string, day: string, dateNum: string }>>([]);

  // --- Form Data ---
  const [formData, setFormData] = useState({
    department: user?.department || '',
    title: '',
    startTime: '',
    endTime: '',
    guestName: '',
    expectedParticipants: 0,
    organizerName: user?.name || '',
    organizerContact: '',
  });

  useEffect(() => {
    // Generate next 14 days
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        date: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate().toString()
      });
    }
    setDatesList(dates);
  }, []);

  useEffect(() => {
    // Reset conflict if user changes date or hall
    if (selectedHallId && selectedDate) {
      setConflictEvent(null);
      setExchangeSent(false);
    }
  }, [selectedHallId, selectedDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Only reset conflict state if scheduling parameters change (time)
    // We don't want to reset if user is typing the Title for an exchange request
    if (name === 'startTime' || name === 'endTime') {
      setConflictEvent(null); 
      setExchangeSent(false);
    }
  };

  const handleHallChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHallId(e.target.value);
    setSelectedDate(''); // Reset date when hall changes
  };

  const checkAvailability = () => {
    if (!selectedDate || !formData.startTime || !formData.endTime || !selectedHallId) return;
    
    const { available, conflictEvent } = mockService.checkAvailability(
      selectedHallId, 
      selectedDate, 
      formData.startTime, 
      formData.endTime
    );

    if (!available) {
      setConflictEvent(conflictEvent);
    } else {
      setStep(2); 
    }
  };

  const handleRequestExchange = () => {
    if (conflictEvent && user) {
      const proposedEvent = {
        ...formData,
        date: selectedDate,
        hallId: selectedHallId,
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
      date: selectedDate,
      hallId: selectedHallId,
      organizerId: user.id,
      expectedParticipants: Number(formData.expectedParticipants)
    });

    alert('Hall booked successfully!');
    navigate('/teacher');
  };

  // --- Visual Helpers ---
  const getDateStatusColor = (dateStr: string) => {
    if (!selectedHallId) return 'var(--gray-300)';
    const events = mockService.getEvents().filter(e => 
      e.hallId === selectedHallId && e.date === dateStr && e.status !== 'CANCELLED'
    );
    if (events.length === 0) return 'var(--success)'; // Green
    if (events.length >= 3) return 'var(--danger)';   // Red
    return 'var(--warning)';                          // Orange
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Book a Hall</h1>
        <p className="text-gray-500">Select a hall and date to check availability.</p>
      </div>

      <div className="card">
        {/* Progress Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)' }}>
          <div style={{ flex: 1, padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 500, background: step === 1 ? 'var(--primary-bg)' : 'transparent', color: step === 1 ? 'var(--primary)' : 'var(--success-text)' }}>
            1. Select Slot
          </div>
          <div style={{ flex: 1, padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 500, background: step === 2 ? 'var(--primary-bg)' : 'transparent', color: step === 2 ? 'var(--primary)' : 'var(--gray-400)' }}>
            2. Program Details
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          
          {/* STEP 1: VISUAL SELECTOR */}
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            
            <div className="mb-6">
              <label className="input-label">Select Venue</label>
              <select 
                required
                className="form-input"
                style={{ fontSize: '1rem', padding: '0.75rem' }}
                value={selectedHallId}
                onChange={handleHallChange}
              >
                <option value="">-- Choose a Hall --</option>
                {halls.map(h => (
                  <option key={h.id} value={h.id}>{h.name} (Capacity: {h.capacity})</option>
                ))}
              </select>
            </div>

            {selectedHallId && (
              <div className="fade-in">
                <label className="input-label mb-2">Select Date</label>
                <div className="date-strip">
                  {datesList.map((item) => (
                    <div 
                      key={item.date}
                      className={`date-card ${selectedDate === item.date ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(item.date)}
                    >
                      <div className="text-xs font-bold uppercase mb-1">{item.day}</div>
                      <div className="text-xl font-bold">{item.dateNum}</div>
                      <div 
                        className="date-status-dot" 
                        style={{ backgroundColor: getDateStatusColor(item.date) }}
                      />
                    </div>
                  ))}
                </div>

                {selectedDate && (
                  <div className="mt-6 fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 className="font-bold">Enter Event Time for {new Date(selectedDate).toDateString()}</h3>
                      <div className="text-xs flex gap-3">
                         <span style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 8, height: 8, background: 'var(--danger-bg)', border: '1px solid var(--danger)', marginRight: 4 }}></div> Busy</span>
                         <span style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 8, height: 8, background: 'var(--success-bg)', border: '1px solid var(--success)', marginRight: 4 }}></div> Free</span>
                      </div>
                    </div>

                    <div className="grid-2 mt-4 p-4 bg-white border border-gray-200 rounded-xl">
                      <div>
                        <label className="input-label">Start Time</label>
                        <div style={{ position: 'relative' }}>
                          <Clock size={18} color="black" style={{ position: 'absolute', left: '10px', top: '10px', pointerEvents: 'none' }} />
                          <input 
                            type="time" 
                            name="startTime"
                            required
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={formData.startTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="input-label">End Time</label>
                        <div style={{ position: 'relative' }}>
                           <Clock size={18} color="black" style={{ position: 'absolute', left: '10px', top: '10px', pointerEvents: 'none' }} />
                          <input 
                            type="time" 
                            name="endTime"
                            required
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={formData.endTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Conflict UI */}
                    {conflictEvent && (
                      <div style={{ marginTop: '1.5rem', background: 'var(--danger-bg)', border: '1px solid #fca5a5', borderRadius: '0.5rem', padding: '1rem', animation: 'fadeIn 0.3s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                          <AlertCircle className="mr-2" size={20} color="var(--danger-text)" />
                          <div style={{ flex: 1 }}>
                            <h3 style={{ color: 'var(--danger-text)', fontWeight: 600 }}>Hall Unavailable</h3>
                            <p style={{ color: 'var(--danger-text)', fontSize: '0.875rem' }}>
                              Booked by <strong>{conflictEvent.organizerName}</strong> ({conflictEvent.startTime} - {conflictEvent.endTime}).
                            </p>
                            
                            {!exchangeSent ? (
                              <div className="mt-2">
                                 <input 
                                    type="text"
                                    name="title"
                                    placeholder="Your Program Name (Required for exchange)"
                                    className="form-input"
                                    style={{ padding: '0.25rem 0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}
                                    value={formData.title}
                                    onChange={handleChange}
                                 />
                                <button 
                                  type="button"
                                  onClick={handleRequestExchange}
                                  disabled={!formData.title}
                                  className="btn btn-secondary"
                                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                >
                                  <Mail size={14} className="mr-2" />
                                  Request Exchange
                                </button>
                              </div>
                            ) : (
                              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--success-text)', fontWeight: 500 }}>
                                <CheckCircle size={16} className="mr-2" />
                                Exchange request sent!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 text-right">
                      <button 
                        type="button"
                        onClick={checkAvailability}
                        disabled={!selectedDate || !formData.startTime || !formData.endTime || !selectedHallId}
                        className="btn btn-primary"
                      >
                        Check Availability <Search size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: PROGRAM DETAILS */}
          {step === 2 && (
            <div className="fade-in">
              <div className="grid-2">
                <div style={{ gridColumn: '1 / -1', background: 'var(--gray-50)', padding: '1rem', borderRadius: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                      <Building size={16} className="mr-2 text-gray-400" />
                      {formData.department}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Organizer</label>
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                       <User size={16} className="mr-2 text-gray-400" />
                       {formData.organizerName}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--gray-200)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                     <label className="text-xs font-bold text-gray-500 uppercase">Selected Slot</label>
                     <div className="font-medium text-primary">
                       {mockService.getHalls().find(h => h.id === selectedHallId)?.name} • {new Date(selectedDate).toDateString()} • {formData.startTime} - {formData.endTime}
                     </div>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Program Name</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    className="form-input"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="input-label">Chief Guest</label>
                  <input 
                    type="text" 
                    name="guestName"
                    required
                    className="form-input"
                    value={formData.guestName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="input-label">Participants</label>
                  <input 
                    type="number" 
                    name="expectedParticipants"
                    required
                    min="1"
                    className="form-input"
                    value={formData.expectedParticipants}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Contact Number</label>
                  <input 
                    type="tel" 
                    name="organizerContact"
                    required
                    className="form-input"
                    value={formData.organizerContact}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--gray-100)', paddingTop: '1.5rem' }}>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
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