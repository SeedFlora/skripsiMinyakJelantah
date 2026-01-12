/**
 * API Configuration
 */

// Ganti dengan IP komputer Anda jika testing di device fisik
// Untuk emulator Android: 10.0.2.2
// Untuk iOS Simulator: localhost
// Untuk device fisik: IP komputer (contoh: 192.168.1.100)

export const API_BASE_URL = 'http://10.0.2.2:5000/api/v1';

// Untuk production, ganti dengan URL server Anda
// export const API_BASE_URL = 'https://api.jelantahku.com/api/v1';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  ME: '/auth/me',
  UPDATE_FCM: '/auth/update-fcm-token',
  
  // Containers
  CONTAINERS: '/containers',
  CONTAINER_HISTORY: (id) => `/containers/${id}/history`,
  
  // Transactions
  TRANSACTIONS: '/transactions',
  PICKUP_REQUEST: '/transactions/pickup',
  TRANSACTION_STATS: '/transactions/stats',
  ACCEPT_PICKUP: (id) => `/transactions/${id}/accept`,
  COMPLETE_PICKUP: (id) => `/transactions/${id}/complete`,
  CANCEL_PICKUP: (id) => `/transactions/${id}/cancel`,
  RATE_TRANSACTION: (id) => `/transactions/${id}/rate`,
  
  // Users
  PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  COLLECTORS: '/users/collectors',
};
