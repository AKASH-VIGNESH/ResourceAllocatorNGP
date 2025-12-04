import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { mockService } from '../../services/mockData';
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
      setStep(2); 
    }
  };

  const handleRequestExchange = () => {
    if (conflictEvent && user) {
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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Book a Hall</h1>
        <p className="text-gray-500">Fill in the details below to reserve a venue for your program.</p>
      </div>

      <div className="card">
        {/* Progress Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)' }}>
          <div style={{ flex: 1, padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 500, background: step === 1 ? 'var(--primary-bg)' : 'transparent', color: step === 1 ? 'var(--primary)' : 'var(--success-text)' }}>
            1. Availability Check
          </div>
          <div style={{ flex: 1, padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 500, background: step === 2 ? 'var(--primary-bg)' : 'transparent', color: step === 2 ? 'var(--primary)' : 'var(--gray-400)' }}>
            2. Program Details
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* Step 1 */}
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <div className="grid-2">
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Select Hall</label>
                <select 
                  name="hallId"
                  required
                  className="form-input"
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
                <label className="input-label">Program Date</label>
                <div style={{ position: 'relative' }}>
                  <CalendarIcon size={18} style={{ position: 'absolute', left: '10px', top: '10px', pointerEvents: 'none' }} />
                  <input 
                    type="date" 
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>{/* Spacer */}</div>

              <div>
                <label className="input-label">Start Time</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={18} style={{ position: 'absolute', left: '10px', top: '10px', pointerEvents: 'none' }} />
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
                   <Clock size={18} style={{ position: 'absolute', left: '10px', top: '10px', pointerEvents: 'none' }} />
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
                            placeholder="Your Program Name (Required)"
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
                disabled={!formData.date || !formData.startTime || !formData.endTime || !formData.hallId}
                className="btn btn-primary"
              >
                Check Availability <Search size={16} className="ml-2" />
              </button>
            </div>
          </div>

          {/* Step 2 */}
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