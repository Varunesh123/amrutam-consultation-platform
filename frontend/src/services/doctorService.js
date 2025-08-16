// src/services/doctorService.js
import { apiService } from './api';

export const doctorService = {
  async getDoctors(filters = {}) {
    return await apiService.get('/doctors', filters);
  },

  async getDoctorById(id) {
    return await apiService.get(`/doctors/${id}`);
  },

  async getDoctorSlots(doctorId, date) {
    return await apiService.get(`/doctors/${doctorId}/slots`, { date });
  },

  async getSpecializations() {
    return await apiService.get('/specializations');
  },

  async searchDoctors(query, filters = {}) {
    return await apiService.get('/doctors/search', { q: query, ...filters });
  },

  async getDoctorReviews(doctorId) {
    return await apiService.get(`/doctors/${doctorId}/reviews`);
  }
};

