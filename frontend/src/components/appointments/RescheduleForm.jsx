// src/components/appointments/RescheduleForm.jsx
import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import SlotPicker from '../booking/SlotPicker';

const RescheduleForm = ({ appointment, onSubmit, onCancel }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    fetchDoctorDetails();
  }, [appointment.doctor.id]);

  const fetchDoctorDetails = async () => {
    try {
      const doctorData = await doctorService.getDoctorById(appointment.doctor.id);
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  const handleSlotSelect = (slotId, slotData) => {
    setSelectedSlot({ slotId, slotData });
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      alert('Please select a new slot');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        newSlotId: selectedSlot.slotId,
        newDate: selectedSlot.slotData.date,
        newTimeSlot: `${selectedSlot.slotData.startTime} - ${selectedSlot.slotData.endTime}`,
        reason: 'Patient requested reschedule'
      });
    } catch (error) {
      console.error('Error rescheduling:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="reschedule-form">
      <div className="current-appointment">
        <h4>Current Appointment</h4>
        <p>
          <strong>{new Date(appointment.appointmentDate).toLocaleDateString()}</strong> at{' '}
          <strong>{appointment.timeSlot}</strong>
        </p>
      </div>

      <div className="new-slot-selection">
        <h4>Select New Slot</h4>
        <SlotPicker
          doctor={doctor}
          onSlotSelect={handleSlotSelect}
          selectedMode={appointment.consultationMode}
          onModeChange={() => {}} // Mode cannot be changed during reschedule
        />
      </div>

      {selectedSlot && (
        <div className="selected-slot-info">
          <h4>New Appointment Details</h4>
          <p>
            <strong>{new Date(selectedSlot.slotData.date).toLocaleDateString()}</strong> at{' '}
            <strong>{selectedSlot.slotData.startTime} - {selectedSlot.slotData.endTime}</strong>
          </p>
        </div>
      )}

      <div className="reschedule-actions">
        <button 
          onClick={onCancel}
          className="cancel-btn"
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          className="confirm-btn"
          disabled={!selectedSlot || loading}
        >
          {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
        </button>
      </div>
    </div>
  );
};

export default RescheduleForm;

