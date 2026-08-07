export { routes, getNavigationItems } from '../constants/routes';

export const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  DOCTOR: 'DOCTOR',
  STAFF: 'STAFF',
  PATIENT: 'PATIENT',
});

export const APPOINTMENT_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
});

export const DOCUMENT_TYPES = Object.freeze(['Lab Report', 'Prescription', 'Radiology', 'Consultation']);
