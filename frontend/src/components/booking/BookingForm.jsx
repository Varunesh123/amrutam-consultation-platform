// src/components/booking/BookingForm.jsx
import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, Clock, Video, MapPin } from 'lucide-react';

const BookingForm = ({ bookingData, doctor, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    patientDetails: {
      name: bookingData.patientDetails.name || '',
      email: bookingData.patientDetails.email || '',
      phone: bookingData.patientDetails.phone || '',
      age: bookingData.patientDetails.age || '',
      gender: bookingData.patientDetails.gender || '',
      medicalHistory: bookingData.patientDetails.medicalHistory || ''
    },
    symptoms: bookingData.symptoms || '',
    preferredLanguage: bookingData.preferredLanguage || 'en',
    emergencyContact: bookingData.emergencyContact || '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.patientDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.patientDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.patientDetails.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.patientDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.patientDetails.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.patientDetails.age) {
      newErrors.age = 'Age is required';
    } else if (formData.patientDetails.age < 1 || formData.patientDetails.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.patientDetails.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Please describe your symptoms or reason for consultation';
    }

    if (!formData.agreedToTerms) {
      newErrors.terms = 'Please accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field.split('.').pop()]) {
      setErrors(prev => ({
        ...prev,
        [field.split('.').pop()]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatSlotTime = (slotData) => {
    const date = new Date(slotData.date);
    return `${date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })} at ${slotData.startTime} - ${slotData.endTime}`;
  };

  return (
    <div className="booking-form">
      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="summary-item">
          <User size={16} />
          <span>Dr. {doctor.name}</span>
        </div>
        <div className="summary-item">
          <Calendar size={16} />
          <span>{formatSlotTime(bookingData.slotData)}</span>
        </div>
        <div className="summary-item">
          {bookingData.slotData.mode === 'video' ? (
            <>
              <Video size={16} />
              <span>Video Consultation</span>
            </>
          ) : (
            <>
              <MapPin size={16} />
              <span>In-Person Visit</span>
            </>
          )}
        </div>
        <div className="summary-item fee">
          <strong>Fee: ₹{doctor.consultationFee}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        <h3>Patient Details</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              value={formData.patientDetails.name}
              onChange={(e) => handleInputChange('patientDetails.name', e.target.value)}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={formData.patientDetails.email}
              onChange={(e) => handleInputChange('patientDetails.email', e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              value={formData.patientDetails.phone}
              onChange={(e) => handleInputChange('patientDetails.phone', e.target.value)}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              type="number"
              id="age"
              min="1"
              max="120"
              value={formData.patientDetails.age}
              onChange={(e) => handleInputChange('patientDetails.age', e.target.value)}
              className={errors.age ? 'error' : ''}
              placeholder="Enter your age"
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            value={formData.patientDetails.gender}
            onChange={(e) => handleInputChange('patientDetails.gender', e.target.value)}
            className={errors.gender ? 'error' : ''}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="symptoms">Symptoms / Reason for Consultation *</label>
          <textarea
            id="symptoms"
            value={formData.symptoms}
            onChange={(e) => handleInputChange('symptoms', e.target.value)}
            className={errors.symptoms ? 'error' : ''}
            placeholder="Please describe your symptoms, health concerns, or reason for consultation..."
            rows="4"
          />
          {errors.symptoms && <span className="error-text">{errors.symptoms}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="medicalHistory">Medical History (Optional)</label>
          <textarea
            id="medicalHistory"
            value={formData.patientDetails.medicalHistory}
            onChange={(e) => handleInputChange('patientDetails.medicalHistory', e.target.value)}
            placeholder="Any chronic conditions, allergies, medications, or relevant medical history..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="emergencyContact">Emergency Contact (Optional)</label>
          <input
            type="text"
            id="emergencyContact"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            placeholder="Name and phone number of emergency contact"
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferredLanguage">Preferred Language</label>
          <select
            id="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="te">Telugu</option>
            <option value="mr">Marathi</option>
            <option value="ta">Tamil</option>
            <option value="gu">Gujarati</option>
            <option value="kn">Kannada</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
              className={errors.terms ? 'error' : ''}
            />
            <span>
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && <span className="error-text">{errors.terms}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="back-btn">
            Back to Slots
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="submit-btn"
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;