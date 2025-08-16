// src/services/authService.js
import { apiService } from './api';

export const authService = {
  async login(credentials) {
    return await apiService.post('/auth/login', credentials);
  },

  async register(userData) {
    return await apiService.post('/auth/register', userData);
  },

  async logout() {
    return await apiService.post('/auth/logout');
  },

  async getCurrentUser() {
    return await apiService.get('/auth/me');
  },

  async updateProfile(profileData) {
    return await apiService.put('/auth/profile', profileData);
  },

  async changePassword(passwordData) {
    return await apiService.put('/auth/change-password', passwordData);
  },

  async forgotPassword(email) {
    return await apiService.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, newPassword) {
    return await apiService.post('/auth/reset-password', { token, newPassword });
  },

  async verifyOTP(phone, otp) {
    return await apiService.post('/auth/verify-otp', { phone, otp });
  }
};

