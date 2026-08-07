import { routes } from '../constants/routes';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-health-render-backend.onrender.com/api';
const TOKEN_KEY = 'smart_health_token';
const USER_KEY = 'smart_health_user';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } };
export const saveSession = ({ token, user }) => { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)); window.dispatchEvent(new Event('smart-health-auth')); };
export const clearSession = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); window.dispatchEvent(new Event('smart-health-auth')); };

const request = async (path, options, authenticated) => {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(authenticated ? { Authorization: token ? `Bearer ${token}` : '' } : {}), ...options.headers }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    if (authenticated && response.status === 401) { clearSession(); window.location.href = routes.login; }
    const hint = response.status === 404 ? `The requested API endpoint was not found (404): ${path}. Deploy the latest backend to Render.` : `Request failed (${response.status}). Please try again.`;
    throw new Error(data.message || hint);
  }
  return data;
};

export const authRequest = (path, options = {}) => request(path, options, false);
export const apiRequest = (path, options = {}) => request(path, options, true);

export const handleFileUpload = async (event, callback, setUploadingState) => {
  const file = event.target.files[0];
  if (!file) return;
  setUploadingState(true);
  const formData = new FormData(); formData.append('file', file);
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', headers: { Authorization: getStoredToken() ? `Bearer ${getStoredToken()}` : '' }, body: formData });
    const data = await response.json();
    if (data.success) callback(data.file_url); else alert(data.message || 'File upload failed');
  } catch (error) { console.error('Error uploading file:', error); alert('Error uploading file from local'); }
  finally { setUploadingState(false); }
};
