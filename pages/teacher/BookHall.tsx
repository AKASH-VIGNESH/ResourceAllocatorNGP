import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { mockService } from '../../services/mockData';
import { Search, AlertCircle, CheckCircle, Mail, User, Building, Clock, Coffee, Shield, Zap, Box, Monitor, Plus, Trash2, Calendar } from 'lucide-react';
import { Event } from '../../types';

// Helper Component for List Input
const DynamicListInput = ({ 
  label, 
  icon: Icon, 
  items, 
  onAdd, 
  onRemove, 
  placeholder 
}: { 
  label: string, 
  icon: any, 
  items: string[], 
  onAdd: (val: string) => void, 
  onRemove: (idx: number) => void,
  placeholder: string
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label className="input-label flex items-center mb-2">
        <Icon size={16} className="mr-2" />
        {label}
      </label>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input 
          type="text" 
          className="form-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          type="button" 
          onClick={handleAdd}
          className="btn btn-primary"
          style={{ padding: '0.5rem' }}
        >
          <Plus size={20} />
        </button>
      </div>

      {items.length > 0 ? (
        <ul style={{ background: 'var(--gray-50)', borderRadius: '0.5rem', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ padding: '0.5rem 1rem', borderBottom: idx === items.length - 1 ? 'none' : '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span>{item}</span>
              <button 
                type="button" 
                onClick={() => onRemove(idx)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.25rem' }}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-xs text-gray-400 italic pl-1">No items added.</div>
      )}
    </div>
  );
};

// New Component: Timeline Schedule
const TimelineSchedule = ({ events }: { events: Event[] }) => {
  const startHour = 8; // 8 AM
  const endHour = 19; // 7 PM
  const totalMinutes = (endHour - startHour) * 60;

  const getPosition = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const mins = h * 60 + m;
    const offset = mins - (startHour * 60);
    return Math.max(0, Math.min(100, (offset / totalMinutes) * 100));
  };

  const getWidth = (start: string, end: string) => {
    const startPos = getPosition(start);
    const endPos = getPosition(end);
    return endPos - startPos;
  };

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <h3 className="font-bold text-sm uppercase text-gray-500">Available Slots ({startHour}:00 - {endHour}:00)</h3>
        <div className="text-xs flex gap-3">
            <span style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 8, height: 8, background: 'var(--danger-bg)', border: '1px solid var(--danger)', marginRight: 4 }}></div> Booked</span>
            <span style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 8, height: 8, background: 'var(--gray-100)', border: '1px solid var(--gray-300)', marginRight: 4 }}></div> Available</span>
        </div>
      </div>
      
      {/* Timeline Track */}
      <div style={{ position: 'relative', height: '50px', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: '0.5rem', marginBottom: '2rem' }}>
        {/* Hour Markers */}
        {Array.from({ length: endHour - startHour + 1 }).map((_, i) => {
            const hour = startHour + i;
            const left = (i / (endHour - startHour)) * 100;
            return (
                <div key={hour} style={{ position: 'absolute', left: `${left}%`, top: '100%', fontSize: '0.65rem', transform: 'translateX(-50%)', paddingTop: '0.25rem', color: 'var(--gray-400)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '1px', height: '6px', background: 'var(--gray-300)', marginBottom: '2px' }}></div>
                    {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                </div>
            );
        })}

        {/* Events */}
        {events.length === 0 ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                No bookings. Hall is free all day.
            </div>
        ) : (
            events.map(ev => (
                <div 
                    key={ev.id}
                    title={`${ev.title} (${ev.startTime} - ${ev.endTime})`}
                    style={{
                        position: 'absolute',
                        left: `${getPosition(ev.startTime)}%`,
                        width: `${getWidth(ev.startTime, ev.endTime)}%`,
                        top: '4px',
                        bottom: '4px',
                        background: 'var(--danger-bg)',
                        border: '1px solid var(--danger)',
                        borderRadius: '0.25rem',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        color: 'var(--danger-text)',
                        fontWeight: 'bold',
                        cursor: 'help'
                    }}
                >
                  {getWidth(ev.startTime, ev.endTime) > 10 ? 'Booked' : ''}
                </div>
            ))
        )}
      </div>
      
      {/* List */}
      <div className="mt-2">
         {events.length > 0 && (
             <div className="text-sm">
                 <p className="font-bold mb-2 text-xs text-gray-500 uppercase">Existing Bookings:</p>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                     {events.map(ev => (
                         <div key={ev.id} style={{ display: 'flex', alignItems: 'center', background: 'var(--gray-50)', padding: '0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', border: '1px solid var(--gray-200)' }}>
                             <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)', marginRight: '0.5rem' }}></div>
                             <span style={{ fontFamily: 'monospace', fontWeight: 600, marginRight: '0.5rem' }}>{ev.startTime} - {ev.endTime}</span>
                             <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</span>
                         </div>
                     ))}
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

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
  const [eventsForDate, setEventsForDate] = useState<Event[]>([]);

  // --- Form Data ---
  interface FormDataState {
    department: string;
    title: string;
    startTime: string;
    endTime: string;
    guestName: string;
    expectedParticipants: number;
    organizerName: string;
    organizerContact: string;
    securityNeeds: string;
    vipArrival: string;
    refreshments: string[];
    electricalNeeds: string[];
    labRequirements: string[];
    storeItems: string[];
  }

  const [formData, setFormData] = useState<FormDataState>({
    department: user?.department || '',
    title: '',
    startTime: '',
    endTime: '',
    guestName: '',
    expectedParticipants: 0,
    organizerName: user?.name || '',
    organizerContact: '',
    // Logistical Fields
    securityNeeds: '',
    vipArrival: '',
    refreshments: [],
    electricalNeeds: [],
    labRequirements: [],
    storeItems: []
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
      
      // Fetch events for the timeline
      const evs = mockService.getEvents().filter(e => 
        e.hallId === selectedHallId && 
        e.date === selectedDate && 
        e.status !== 'CANCELLED'
      );
      setEventsForDate(evs);
    } else {
      setEventsForDate([]);
    }
  }, [selectedHallId, selectedDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Only reset conflict state if scheduling parameters change (time)
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
      expectedParticipants: Number(formData.expectedParticipants),
      refreshmentsDelivered: false
    });

    alert('Hall booked successfully with all requirements!');
    navigate('/teacher');
  };

  // --- List Handlers ---
  const addItem = (field: keyof FormDataState, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), item]
    }));
  };

  const removeItem = (field: keyof FormDataState, idx: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== idx)
    }));
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
            2. Program & Requirements
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
                  <option key={h.id} value={h.id}>
                    {h.name} (Capacity: {h.capacity}) — Includes: {h.amenities.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {selectedHallId && (
              <div className="fade-in">
                <label className="input-label mb-2">Select Date</label>
                <div className="date-strip mb-2">
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
                <div className="text-xs text-gray-400 mb-6 flex gap-4 justify-center">
                    <span className="flex items-center"><div className="w-2 h-2 rounded-full mr-1" style={{background: 'var(--success)'}}></div> Free</span>
                    <span className="flex items-center"><div className="w-2 h-2 rounded-full mr-1" style={{background: 'var(--warning)'}}></div> Partially Booked</span>
                    <span className="flex items-center"><div className="w-2 h-2 rounded-full mr-1" style={{background: 'var(--danger)'}}></div> Busy</span>
                </div>

                {selectedDate && (
                  <div className="mt-6 fade-in">
                    
                    {/* TIMELINE COMPONENT */}
                    <TimelineSchedule events={eventsForDate} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 className="font-bold">Select Timings for {new Date(selectedDate).toDateString()}</h3>
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
                            <h3 style={{ color: 'var(--danger-text)', fontWeight: 600 }}>Time Slot Unavailable</h3>
                            <p style={{ color: 'var(--danger-text)', fontSize: '0.875rem' }}>
                              This slot clashes with <strong>{conflictEvent.title}</strong> (Booked: {conflictEvent.startTime} - {conflictEvent.endTime}).
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

                {/* --- BASIC DETAILS --- */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h3 className="font-bold mb-3">Event Information</h3>
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

                {/* --- SUPPORT SERVICES SECTION --- */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem', borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem' }}>
                  <h3 className="font-bold mb-1">Support Services Requirements</h3>
                  <p className="text-sm text-gray-500 mb-4">Add items or instructions for each department.</p>
                </div>

                {/* Canteen - Dynamic List */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <DynamicListInput 
                    label="Canteen / Refreshments"
                    icon={Coffee}
                    placeholder="e.g. Tea for 50 people"
                    items={formData.refreshments}
                    onAdd={(item) => addItem('refreshments', item)}
                    onRemove={(idx) => removeItem('refreshments', idx)}
                  />
                </div>

                {/* Security - Still Text Area */}
                <div>
                  <label className="input-label flex items-center">
                    <Shield size={16} className="mr-2" />
                    Security Instructions
                  </label>
                  <textarea 
                    name="securityNeeds"
                    className="form-input"
                    placeholder="e.g., Check IDs, Reserve parking"
                    rows={2}
                    value={formData.securityNeeds}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="input-label flex items-center">
                    <Shield size={16} className="mr-2" />
                    VIP Arrival Details
                  </label>
                  <textarea 
                    name="vipArrival"
                    className="form-input"
                    placeholder="e.g., Chief guest arriving at 9:45 AM via Main Gate"
                    rows={2}
                    value={formData.vipArrival}
                    onChange={handleChange}
                  />
                </div>

                {/* Electrical - Dynamic List */}
                <div>
                  <DynamicListInput 
                    label="Electrical Needs"
                    icon={Zap}
                    placeholder="e.g. 2 Handheld Mics"
                    items={formData.electricalNeeds}
                    onAdd={(item) => addItem('electricalNeeds', item)}
                    onRemove={(idx) => removeItem('electricalNeeds', idx)}
                  />
                </div>

                {/* Store - Dynamic List */}
                <div>
                  <DynamicListInput 
                    label="General Store Items"
                    icon={Box}
                    placeholder="e.g. 10 Notepads"
                    items={formData.storeItems}
                    onAdd={(item) => addItem('storeItems', item)}
                    onRemove={(idx) => removeItem('storeItems', idx)}
                  />
                </div>

                {/* CS Lab - Dynamic List */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <DynamicListInput 
                    label="CS Lab / Technical Requirements"
                    icon={Monitor}
                    placeholder="e.g. Internet access for 30 PCs"
                    items={formData.labRequirements}
                    onAdd={(item) => addItem('labRequirements', item)}
                    onRemove={(idx) => removeItem('labRequirements', idx)}
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