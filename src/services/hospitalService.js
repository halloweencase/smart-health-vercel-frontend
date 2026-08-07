import { apiRequest, authRequest } from './api';
export const getRegistrationHospitals = () => authRequest('/auth/hospitals');
export const getHospitals = () => apiRequest('/superadmin/hospitals');
