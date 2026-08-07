import { authRequest, clearSession, getStoredToken, getStoredUser, saveSession } from './api';

export const login = (credentials) => authRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
export const register = (payload) => authRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
export const getProfile = () => authRequest('/auth/me');
export { clearSession, getStoredToken, getStoredUser, saveSession };
