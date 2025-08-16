// src/services/appointmentService.js
import { apiService } from './api';

export const appointmentService = {
  async getAppointments(filters = {}) {
    return await apiService.get('/appointments', filters);
  },

  async getAppointmentById(id) {
    return await apiService.get(`/appointments/${id}`);
  },

  async bookAppointment(bookingData) {
    return await apiService.post('/appointments', bookingData);
  },

  async confirmAppointment(appointmentId, confirmationData) {
    return await apiService.post(`/appointments/${appointmentId}/confirm`, confirmationData);
  },

  async cancelAppointment(appointmentId, reason) {
    return await apiService.post(`/appointments/${appointmentId}/cancel`, { reason });
  },

  async rescheduleAppointment(appointmentId, newSlotData) {
    return await apiService.post(`/appointments/${appointmentId}/reschedule`, newSlotData);
  },

  async lockSlot(slotId) {
    return await apiService.post('/slots/lock', { slotId });
  },

  async releaseSlot(slotId) {
    return await apiService.post('/slots/release', { slotId });
  },

  async getUpcomingAppointments() {
    return await apiService.get('/appointments/upcoming');
  },

  async getPastAppointments() {
    return await apiService.get('/appointments/past');
  }
};

