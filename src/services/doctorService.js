import { apiRequest } from './api';
export const getDoctorPatients = () => apiRequest('/doctor/patients');
