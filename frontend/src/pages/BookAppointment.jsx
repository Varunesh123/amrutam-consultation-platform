// src/pages/BookAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../hooks/useAuth';
import DoctorProfile from '../components/doctor/DoctorProfile';
import SlotPicker from '../components/booking/SlotPicker';
import BookingForm from '../components/booking/BookingForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import Loading from '../components/common/Loading';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    doctorId: doctorId,
    slotId: null,
    consultationMode: 'video',
    patientDetails: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      age: '',
      gender: '',
      medicalHistory: ''
    },
    symptoms: '',
    preferredLanguage: 'en'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/book/${doctorId}` } });
      return;
    }
    
    fetchDoctorDetails();
  }, [doctorId, isAuthenticated]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const doctorData = await doctorService.getDoctorById(doctorId);
      setDoctor(doctorData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = async (slotId, slotData) => {
    try {
      // Lock the selected slot
      await appointmentService.lockSlot(slotId);
      setBookingData(prev => ({
        ...prev,
        slotId,
        slotData
      }));
      setCurrentStep(2);
    } catch (error) {
      alert('Unable to lock slot. Please try another slot.');
    }
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const finalBookingData = {
        ...bookingData,
        ...formData
      };

      const appointment = await appointmentService.bookAppointment(finalBookingData);
      setBookingData(prev => ({
        ...prev,
        appointmentId: appointment.id
      }));
      setCurrentStep(3);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Error loading doctor details</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/doctors')}>
          Back to Doctor Listing
        </button>
      </div>
    );
  }

  return (
    <div className="book-appointment">
      <div className="container">
        <div className="booking-progress">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Select Slot</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Patient Details</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <div className="booking-content">
          <div className="doctor-info-sidebar">
            <DoctorProfile doctor={doctor} compact={true} />
          </div>

          <div className="booking-main">
            {currentStep === 1 && (
              <SlotPicker
                doctor={doctor}
                onSlotSelect={handleSlotSelect}
                selectedMode={bookingData.consultationMode}
                onModeChange={(mode) => 
                  setBookingData(prev => ({ ...prev, consultationMode: mode }))
                }
              />
            )}

            {currentStep === 2 && (
              <BookingForm
                bookingData={bookingData}
                doctor={doctor}
                onSubmit={handleBookingSubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <BookingConfirmation
                bookingData={bookingData}
                doctor={doctor}
                onComplete={() => navigate('/dashboard')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;