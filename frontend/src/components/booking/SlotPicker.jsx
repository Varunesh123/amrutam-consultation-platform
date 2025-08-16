import { Calendar, Clock, Video, User, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Random doctor data generator
const generateRandomDoctor = (doctorId) => {
  const firstNames = ['Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda', 'James', 'Lisa', 'John', 'Maria', 'William', 'Jennifer', 'Daniel', 'Michelle'];
  const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  const specialties = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic Surgeon', 'Pediatrician', 'Psychiatrist', 'Radiologist', 'Ophthalmologist', 'ENT Specialist', 'Gastroenterologist', 'Endocrinologist', 'Pulmonologist'];
  const consultationFees = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500];
  const experiences = ['5 years', '8 years', '10 years', '12 years', '15 years', '18 years', '20 years', '25 years', '30 years'];
  const ratings = [4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const specialty = specialties[Math.floor(Math.random() * specialties.length)];
  const fee = consultationFees[Math.floor(Math.random() * consultationFees.length)];
  const experience = experiences[Math.floor(Math.random() * experiences.length)];
  const rating = ratings[Math.floor(Math.random() * ratings.length)];
  
  // Randomly determine available modes
  const modes = ['video', 'in_person'];
  const availableModes = Math.random() > 0.3 ? modes : [modes[Math.floor(Math.random() * modes.length)]];

  return {
    id: doctorId || Math.random().toString(36).substr(2, 9),
    name: `Dr. ${firstName} ${lastName}`,
    specialty,
    consultationFee: fee,
    availableModes,
    rating,
    experience,
    location: `${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'][Math.floor(Math.random() * 8)]}`,
    education: `${['MBBS, MD', 'MBBS, MS', 'MBBS, DNB', 'MBBS, DM', 'MBBS, MCh'][Math.floor(Math.random() * 5)]}`,
    languages: ['English', 'Hindi', Math.random() > 0.5 ? 'Tamil' : 'Bengali'].slice(0, Math.random() > 0.5 ? 3 : 2)
  };
};

const generateMockSlots = (date, mode) => {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute of [0, 30]) {
      if (Math.random() > 0.3) { // 70% chance of slot being available
        const id = `${date}-${hour}-${minute}-${mode}`;
        slots.push({
          id,
          startTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          endTime: `${(minute === 30 ? hour + 1 : hour).toString().padStart(2, '0')}:${(minute === 30 ? '00' : '30')}`,
          status: Math.random() > 0.2 ? 'available' : 'booked',
          availableModes: [mode]
        });
      }
    }
  }
  return slots;
};

const SlotPicker = ({ doctor: doctorProp, onSlotSelect, selectedMode: initialMode, onModeChange, doctorId }) => {
  const [doctor, setDoctor] = useState(doctorProp);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMode, setSelectedMode] = useState(initialMode || 'video');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

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

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (error && error.includes('network')) {
        fetchDoctorData();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error]);

  // Mock API calls with fallback
  const mockDoctorService = {
    getDoctorById: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (!isOnline || Math.random() < 0.3) { // 30% chance of failure or offline
        throw new Error('Network error: Unable to fetch doctor data');
      }
      
      return generateRandomDoctor(id);
    },
    
    getDoctorSlots: async (doctorId, date) => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      if (!isOnline || Math.random() < 0.2) { // 20% chance of failure or offline
        throw new Error('Network error: Unable to fetch slots');
      }
      
      return generateMockSlots(date, selectedMode);
    }
  };

  // Fetch doctor data with retry mechanism
  const fetchDoctorData = async () => {
    if (!doctor && doctorId) {
      try {
        setLoading(true);
        setError(null);
        const doctorData = await mockDoctorService.getDoctorById(doctorId);
        setDoctor(doctorData);
        setRetryCount(0);
      } catch (err) {
        console.error('Failed to fetch doctor:', err);
        if (retryCount < 3) {
          setError(`Failed to load doctor information. Retrying... (${retryCount + 1}/3)`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchDoctorData();
          }, 2000);
        } else {
          setError('Unable to load doctor information. Using sample data.');
          // Fallback to random doctor data
          setDoctor(generateRandomDoctor(doctorId));
        }
      } finally {
        setLoading(false);
      }
    } else if (!doctorProp) {
      // If no doctor provided via props, generate random data
      setDoctor(generateRandomDoctor(doctorId));
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [doctorId]);

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
      
      let slots;
      try {
        slots = await mockDoctorService.getDoctorSlots(doctor.id, dateString);
      } catch (err) {
        console.error('API failed, using mock data:', err);
        // Fallback to mock data
        slots = generateMockSlots(dateString, selectedMode);
      }
      
      // Filter slots by selected consultation mode
      const filteredSlots = slots.filter(slot => 
        slot.availableModes.includes(selectedMode)
      );
      
      setAvailableSlots(prev => ({
        ...prev,
        [dateString]: filteredSlots
      }));
    } catch (err) {
      setError(`Failed to load slots: ${err.message}`);
      // Fallback to mock data
      const dateString = date.toISOString().split('T')[0];
      setAvailableSlots(prev => ({
        ...prev,
        [dateString]: generateMockSlots(dateString, selectedMode)
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = async (slot) => {
    try {
      // Mock slot locking
      setLockedSlots(prev => [...prev, slot.id]);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSlotSelect(slot.id, {
        ...slot,
        date: selectedDate,
        mode: selectedMode
      });
    } catch (error) {
      console.error('Error selecting slot:', error);
      setLockedSlots(prev => prev.filter(id => id !== slot.id));
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

  if (loading && !doctor) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-[400px] bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Doctor</h3>
          <p className="text-gray-600 mb-4">
            {error || 'Doctor information is not available.'}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Appointment</h2>
            <p className="text-gray-600">Choose your preferred slot with {doctor.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        
        {/* Doctor Info */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {doctor.name.split(' ')[1]?.charAt(0) || 'D'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>{doctor.experience} experience</span>
              <span>⭐ {doctor.rating}/5</span>
              {doctor.location && <span>📍 {doctor.location}</span>}
            </div>
            {doctor.languages && (
              <div className="flex flex-wrap gap-1 mt-2">
                {doctor.languages.map(lang => (
                  <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">₹{doctor.consultationFee}</div>
            <div className="text-sm text-gray-500">consultation fee</div>
          </div>
        </div>
      </div>

      {/* Consultation Mode Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Video className="w-5 h-5 mr-2 text-blue-500" />
          Consultation Mode
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctor.availableModes.includes('video') && (
            <button
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedMode === 'video'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
              onClick={() => {
                setSelectedMode('video');
                onModeChange && onModeChange('video');
              }}
            >
              <Video className={`w-6 h-6 mx-auto mb-2 ${selectedMode === 'video' ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="font-medium text-gray-800">Video Consultation</p>
              <p className="text-sm text-gray-500">Online consultation via video call</p>
              <p className="text-lg font-bold text-blue-600 mt-2">₹{doctor.consultationFee}</p>
            </button>
          )}
          {doctor.availableModes.includes('in_person') && (
            <button
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedMode === 'in_person'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
              onClick={() => {
                setSelectedMode('in_person');
                onModeChange && onModeChange('in_person');
              }}
            >
              <User className={`w-6 h-6 mx-auto mb-2 ${selectedMode === 'in_person' ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="font-medium text-gray-800">In-Person Visit</p>
              <p className="text-sm text-gray-500">Visit doctor's clinic</p>
              <p className="text-lg font-bold text-blue-600 mt-2">₹{doctor.consultationFee}</p>
            </button>
          )}
        </div>
      </div>

      {/* Date Picker */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Select Date
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateDate('prev')}
              disabled={selectedDate.toDateString() === availableDates[0].toDateString()}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateDate('next')}
              disabled={selectedDate.toDateString() === availableDates[availableDates.length - 1].toDateString()}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
          {availableDates.slice(0, 7).map((date) => {
            const dateSlots = getDateSlots(date);
            const hasAvailableSlots = dateSlots.some(slot => isSlotAvailable(slot));
            const isSelected = selectedDate.toDateString() === date.toDateString();
            
            return (
              <button
                key={date.toISOString()}
                className={`p-3 rounded-xl text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-500 text-white shadow-lg'
                    : hasAvailableSlots
                    ? 'bg-blue-50 hover:bg-blue-100 text-gray-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
                onClick={() => hasAvailableSlots && setSelectedDate(date)}
                disabled={!hasAvailableSlots}
              >
                <div className="font-medium text-sm">{formatDate(date)}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
                <div className="text-xs">
                  {hasAvailableSlots ? `${dateSlots.length} slots` : 'No slots'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Available Slots for {formatDate(selectedDate)}
        </h3>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600">Loading slots...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-yellow-800 font-medium">Connection Issue</p>
                <p className="text-yellow-700 text-sm">{error}</p>
                <button 
                  onClick={() => fetchSlotsForDate(selectedDate)}
                  className="mt-2 text-yellow-600 hover:text-yellow-800 text-sm font-medium flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <div>
            {getDateSlots(selectedDate).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No slots available</p>
                <p className="text-gray-400 text-sm">Please select another date</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {getDateSlots(selectedDate).map((slot) => {
                  const available = isSlotAvailable(slot);
                  const isLocked = lockedSlots.includes(slot.id);
                  
                  return (
                    <button
                      key={slot.id}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        available && !isLocked
                          ? 'bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 hover:shadow-md'
                          : isLocked
                          ? 'bg-orange-50 text-orange-800 border border-orange-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      }`}
                      onClick={() => available && !isLocked && handleSlotSelect(slot)}
                      disabled={!available || isLocked}
                    >
                      <div className="font-medium text-sm">
                        {formatTime(slot.startTime)}
                      </div>
                      <div className="text-xs mt-1">
                        {isLocked ? 'Locked' : available ? 'Available' : 'Booked'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span><strong>Duration:</strong> 30 minutes</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2 text-lg">₹</span>
              <span><strong>Fee:</strong> ₹{doctor.consultationFee}</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
              <span><strong>Note:</strong> Slots locked for 5 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotPicker;