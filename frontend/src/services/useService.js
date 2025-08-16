// src/services/userService.js
import { apiService } from './api';

export const userService = {
  async getProfile() {
    return await apiService.get('/user/profile');
  },

  async updateProfile(profileData) {
    return await apiService.put('/user/profile', profileData);
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return await apiService.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  async getNotifications() {
    return await apiService.get('/user/notifications');
  },

  async markNotificationRead(notificationId) {
    return await apiService.patch(`/user/notifications/${notificationId}/read`);
  }
};