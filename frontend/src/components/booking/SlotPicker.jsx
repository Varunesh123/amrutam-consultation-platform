import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Video, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { useSlotLocking } from '../../hooks/useSlotLocking';
import Loading from '../common/Loading';

const SlotPicker = ({ doctor: doctorProp, onSlotSelect, selectedMode: initialMode, onModeChange }) => {
  const { doctorId } = useParams(); // Get doctorId from URL
  const [doctor, setDoctor] = useState(doctorProp);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMode, setSelectedMode] = useState(initialMode || 'video');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lockedSlots, lockSlot } = useSlotLocking();

  // Generate next 14 days for date picker
  const generateDateRange = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const [availableDates] = useState(generateDateRange());

  // Fetch doctor data if not provided via props
  useEffect(() => {
    if (!doctor && doctorId) {
      const fetchDoctor = async () => {
        try {
          setLoading(true);
          const doctorData = await doctorService.getDoctorById(doctorId);
          setDoctor(doctorData);
        } catch (err) {
          setError('Failed to load doctor information.');
        } finally {
          setLoading(false);
        }
      };
      fetchDoctor();
    } else {
      setLoading(false);
    }
  }, [doctor, doctorId]);

  useEffect(() => {
    if (doctor) {
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate, selectedMode, doctor]);

  const fetchSlotsForDate = async (date) => {
    try {
      setLoading(true);
      setError(null);
      
      const dateString = date.toISOString().split('T')[0];
      const slots = await doctorService.getDoctorSlots(doctor.id, dateString);
      
      // Filter slots by selected consultation mode
      const filteredSlots = slots.filter(slot => 
        slot.availableModes.includes(selectedMode)
      );
      
      setAvailableSlots(prev => ({
        ...prev,
        [dateString]: filteredSlots
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = async (slot) => {
    try {
      const success = await lockSlot(slot.id);
      if (success) {
        onSlotSelect(slot.id, {
          ...slot,
          date: selectedDate,
          mode: selectedMode
        });
      } else {
        alert('This slot is no longer available. Please select another slot.');
        fetchSlotsForDate(selectedDate);
      }
    } catch (error) {
      console.error('Error selecting slot:', error);
      alert('Unable to select this slot. Please try another one.');
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const isSlotAvailable = (slot) => {
    const now = new Date();
    const slotDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${slot.startTime}`);
    
    if (slotDateTime < now) return false;
    if (lockedSlots.includes(slot.id)) return false;
    if (slot.status !== 'available') return false;
    
    return true;
  };

  const getDateSlots = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return availableSlots[dateString] || [];
  };

  const navigateDate = (direction) => {
    const currentIndex = availableDates.findIndex(
      date => date.toDateString() === selectedDate.toDateString()
    );
    
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < availableDates.length) {
      setSelectedDate(availableDates[newIndex]);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !doctor) {
    return (
      <div className="error-message">
        <p>{error || 'Doctor information not available.'}</p>
        <button onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="slot-picker">
      <div className="slot-picker-header">
        <h3>Select Appointment Slot</h3>
        <p>Choose your preferred date and time for consultation with Dr. {doctor.name}</p>
      </div>

      {/* Consultation Mode Toggle */}
      <div className="consultation-mode-selector">
        <h4>Consultation Mode</h4>
        <div className="mode-options">
          {doctor.availableModes.includes('video') && (
            <button
              className={`mode-option ${selectedMode === 'video' ? 'active' : ''}`}
              onClick={() => {
                setSelectedMode('video');
                onModeChange('video');
              }}
            >
              <Video size={20} />
              <span>Video Consultation</span>
              <small>₹{doctor.consultationFee}</small>
            </button>
          )}
          {doctor.availableModes.includes('in_person') && (
            <button
              className={`mode-option ${selectedMode === 'in_person' ? 'active' : ''}`}
              onClick={() => {
                setSelectedMode('in_person');
                onModeChange('in_person');
              }}
            >
              <User size={20} />
              <span>In-Person Visit</span>
              <small>₹{doctor.consultationFee}</small>
            </button>
          )}
        </div>
      </div>

      {/* Date Picker */}
      <div className="date-picker">
        <div className="date-picker-header">
          <button
            onClick={() => navigateDate('prev')}
            disabled={selectedDate.toDateString() === availableDates[0].toDateString()}
            className="date-nav-btn"
          >
            <ChevronLeft size={20} />
          </button>
          <h4>
            <Calendar size={20} />
            Select Date
          </h4>
          <button
            onClick={() => navigateDate('next')}
            disabled={selectedDate.toDateString() === availableDates[availableDates.length - 1].toDateString()}
            className="date-nav-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="date-options">
          {availableDates.slice(0, 7).map((date) => {
            const dateSlots = getDateSlots(date);
            const hasAvailableSlots = dateSlots.some(slot => isSlotAvailable(slot));
            
            return (
              <button
                key={date.toISOString()}
                className={`date-option ${
                  selectedDate.toDateString() === date.toDateString() ? 'selected' : ''
                } ${!hasAvailableSlots ? 'no-slots' : ''}`}
                onClick={() => setSelectedDate(date)}
                disabled={!hasAvailableSlots}
              >
                <span className="date-label">{formatDate(date)}</span>
                <span className="date-number">{date.getDate()}</span>
                <span className="slots-count">
                  {hasAvailableSlots ? `${dateSlots.length} slots` : 'No slots'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="time-slots">
        <div className="time-slots-header">
          <h4>
            <Clock size={20} />
            Available Slots for {formatDate(selectedDate)}
          </h4>
        </div>

        {loading && (
          <div className="slots-loading">
            <div className="loading-spinner"></div>
            <p>Loading available slots...</p>
          </div>
        )}

        {error && (
          <div className="slots-error">
            <p>Error loading slots: {error}</p>
            <button onClick={() => fetchSlotsForDate(selectedDate)}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="slots-grid">
            {getDateSlots(selectedDate).length === 0 ? (
              <div className="no-slots-message">
                <p>No slots available for this date</p>
                <small>Please select another date</small>
              </div>
            ) : (
              getDateSlots(selectedDate).map((slot) => {
                const available = isSlotAvailable(slot);
                const isLocked = lockedSlots.includes(slot.id);
                
                return (
                  <button
                    key={slot.id}
                    className={`time-slot ${!available ? 'unavailable' : ''} ${isLocked ? 'locked' : ''}`}
                    onClick={() => available && handleSlotSelect(slot)}
                    disabled={!available}
                  >
                    <span className="slot-time">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                    <span className="slot-status">
                      {isLocked ? 'Locked' : available ? 'Available' : 'Booked'}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Slot Selection Info */}
      <div className="slot-info">
        <div className="info-item">
          <strong>Duration:</strong> 30 minutes
        </div>
        <div className="info-item">
          <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
        </div>
        <div className="info-item">
          <strong>Note:</strong> Selected slots are locked for 5 minutes while you complete booking
        </div>
      </div>
    </div>
  );
};

export default SlotPicker;