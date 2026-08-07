import { apiRequest } from './api';
export const getPatientReports = () => apiRequest('/patient/reports');
export const getPatientAppointments = () => apiRequest('/patient/appointments');
export const getPatientMetrics = () => apiRequest('/patient/metrics');
export const getPatientVisits = () => apiRequest('/patient/visits');
