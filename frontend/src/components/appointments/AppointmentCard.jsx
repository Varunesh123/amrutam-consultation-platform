// src/components/appointments/AppointmentCard.jsx
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  MapPin, 
  Phone, 
  MoreVertical,
  Edit,
  X,
  MessageSquare
} from 'lucide-react';
import RescheduleForm from './RescheduleForm';
import Modal from '../common/Modal';

const AppointmentCard = ({ appointment, onAction, showActions = true }) => {
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    id,
    doctor,
    appointmentDate,
    timeSlot,
    status,
    consultationMode,
    symptoms,
    consultationFee,
    specializations,
    createdAt
  } = appointment;

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'confirmed': 'blue',
      'completed': 'green',
      'cancelled': 'red',
      'rescheduled': 'purple'
    };
    return colors[status] || 'gray';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Pending Confirmation',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'rescheduled': 'Rescheduled'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = appointmentDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === -1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const formatTime = (timeString) => {
    const [start, end] = timeString.split(' - ');
    return { start, end };
  };

  const canReschedule = () => {
    const appointmentDateTime = new Date(`${appointmentDate}T${timeSlot.split(' - ')[0]}`);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
    
    return hoursUntilAppointment > 24 && ['pending', 'confirmed'].includes(status);
  };

  const canCancel = () => {
    const appointmentDateTime = new Date(`${appointmentDate}T${timeSlot.split(' - ')[0]}`);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
    
    return hoursUntilAppointment > 24 && ['pending', 'confirmed'].includes(status);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    await onAction(id, 'cancel', { reason: cancelReason });
    setShowCancel(false);
    setCancelReason('');
  };

  const handleReschedule = async (newSlotData) => {
    await onAction(id, 'reschedule', newSlotData);
    setShowReschedule(false);
  };

  const { start: startTime, end: endTime } = formatTime(timeSlot);

  return (
    <>
      <div className={`appointment-card status-${status}`}>
        <div className="appointment-header">
          <div className="doctor-info">
            <img 
              src={doctor.avatar || '/default-avatar.png'} 
              alt={doctor.name}
              className="doctor-avatar"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="doctor-details">
              <h3>{doctor.name}</h3>
              <div className="specializations">
                {specializations.slice(0, 2).map((spec, index) => (
                  <span key={index} className="spec-tag">{spec}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="appointment-status">
            <span className={`status-badge ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
            
            {showActions && (
              <div className="appointment-menu">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="menu-trigger"
                >
                  <MoreVertical size={16} />
                </button>
                
                {menuOpen && (
                  <div className="menu-dropdown">
                    {canReschedule() && (
                      <button onClick={() => {
                        setShowReschedule(true);
                        setMenuOpen(false);
                      }}>
                        <Edit size={14} />
                        Reschedule
                      </button>
                    )}
                    {canCancel() && (
                      <button onClick={() => {
                        setShowCancel(true);
                        setMenuOpen(false);
                      }}>
                        <X size={14} />
                        Cancel
                      </button>
                    )}
                    <button onClick={() => setMenuOpen(false)}>
                      <MessageSquare size={14} />
                      Contact Doctor
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="appointment-details">
          <div className="detail-row">
            <div className="detail-item">
              <Calendar size={16} />
              <span>{formatDate(appointmentDate)}</span>
            </div>
            <div className="detail-item">
              <Clock size={16} />
              <span>{startTime} - {endTime}</span>
            </div>
            <div className="detail-item">
              {consultationMode === 'video' ? (
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
          </div>

          <div className="symptoms-section">
            <h4>Reason for Consultation:</h4>
            <p>{symptoms}</p>
          </div>

          <div className="appointment-meta">
            <div className="fee">
              <strong>Fee: ₹{consultationFee}</strong>
            </div>
            <div className="booking-date">
              Booked on {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {status === 'confirmed' && consultationMode === 'video' && (
          <div className="join-meeting">
            <button className="join-btn">
              <Video size={16} />
              Join Video Call
            </button>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showReschedule && (
        <Modal
          title="Reschedule Appointment"
          onClose={() => setShowReschedule(false)}
        >
          <RescheduleForm
            appointment={appointment}
            onSubmit={handleReschedule}
            onCancel={() => setShowReschedule(false)}
          />
        </Modal>
      )}

      {/* Cancel Modal */}
      {showCancel && (
        <Modal
          title="Cancel Appointment"
          onClose={() => setShowCancel(false)}
        >
          <div className="cancel-form">
            <p>Are you sure you want to cancel this appointment?</p>
            <div className="appointment-summary">
              <strong>Dr. {doctor.name}</strong>
              <br />
              {formatDate(appointmentDate)} at {startTime}
            </div>
            
            <div className="form-group">
              <label htmlFor="cancelReason">Reason for cancellation *</label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling..."
                rows="3"
                required
              />
            </div>

            <div className="cancel-actions">
              <button 
                onClick={() => setShowCancel(false)}
                className="cancel-btn-secondary"
              >
                Keep Appointment
              </button>
              <button 
                onClick={handleCancel}
                className="cancel-btn-primary"
                disabled={!cancelReason.trim()}
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AppointmentCard;

