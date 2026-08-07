import { apiRequest } from './api';
export const getStaffPatients = () => apiRequest('/staff/patients');
