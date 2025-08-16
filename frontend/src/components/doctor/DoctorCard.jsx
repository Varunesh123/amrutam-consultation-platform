// src/components/doctor/DoctorCard.jsx
import React from 'react';
import { Star, MapPin, Clock, Video, User } from 'lucide-react';

const DoctorCard = ({ doctor, onBookAppointment }) => {
  const {
    id,
    name,
    specializations,
    rating,
    reviewCount,
    experience,
    consultationFee,
    location,
    avatar,
    nextAvailableSlot,
    availableModes,
    languages
  } = doctor;

  const formatNextSlot = (slot) => {
    if (!slot) return 'No slots available';
    const date = new Date(slot);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <div className="doctor-card">
      <div className="doctor-card-header">
        <div className="doctor-avatar">
          <img 
            src={avatar || '/default-avatar.png'} 
            alt={name}
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>
        <div className="doctor-basic-info">
          <h3 className="doctor-name">{name}</h3>
          <div className="specializations">
            {specializations.slice(0, 2).map((spec, index) => (
              <span key={index} className="specialization-tag">
                {spec}
              </span>
            ))}
            {specializations.length > 2 && (
              <span className="more-specs">+{specializations.length - 2} more</span>
            )}
          </div>
          <div className="doctor-meta">
            <div className="rating">
              <Star className="star-icon filled" size={16} />
              <span>{rating}</span>
              <span className="review-count">({reviewCount} reviews)</span>
            </div>
            <div className="experience">
              {experience} years experience
            </div>
          </div>
        </div>
      </div>

      <div className="doctor-card-body">
        <div className="consultation-modes">
          {availableModes.includes('video') && (
            <div className="mode-tag video">
              <Video size={16} />
              Video
            </div>
          )}
          {availableModes.includes('in_person') && (
            <div className="mode-tag in-person">
              <User size={16} />
              In-person
            </div>
          )}
        </div>

        <div className="location-info">
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        <div className="languages">
          <strong>Languages:</strong> {languages.join(', ')}
        </div>

        <div className="availability-info">
          <Clock size={16} />
          <span className="next-slot">
            Next available: {formatNextSlot(nextAvailableSlot)}
          </span>
        </div>

        <div className="consultation-fee">
          <strong>₹{consultationFee}</strong>
          <span>per consultation</span>
        </div>
      </div>

      <div className="doctor-card-footer">
        <button
          onClick={() => onBookAppointment(id)}
          className="book-appointment-btn"
          disabled={!nextAvailableSlot}
        >
          {nextAvailableSlot ? 'Book Appointment' : 'No Slots Available'}
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
