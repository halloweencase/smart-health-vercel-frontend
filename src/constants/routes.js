import { Activity, CalendarDays, Folders, Home, Settings, Stethoscope, User, UserPlus } from 'lucide-react';

export const routes = {
  splash: '/splash', login: '/login', register: '/register', forgotPassword: '/forgot-password', dashboard: '/dashboard',
  records: '/records', uploadReport: '/upload-report', reportDetails: '/report-details', health: '/health', appointments: '/appointments',
  ai: '/ai', profile: '/profile', settings: '/settings', statistics: '/statistics', hospitalAdmins: '/hospital-admins',
  doctors: '/doctors', staff: '/staff', patients: '/patients',
};

export const getNavigationItems = (role) => {
  switch (role) {
    case 'SUPER_ADMIN': return [{ label: 'Hospitals', path: routes.dashboard, icon: Home }, { label: 'Statistics', path: routes.statistics, icon: Activity }];
    case 'HOSPITAL_ADMIN': return [{ label: 'Hospital Profile', path: routes.dashboard, icon: Home }, { label: 'Doctors', path: routes.doctors, icon: Stethoscope }, { label: 'Staff', path: routes.staff, icon: UserPlus }, { label: 'Patients', path: routes.patients, icon: User }];
    case 'DOCTOR': return [{ label: 'Patients', path: routes.dashboard, icon: Home }, { label: 'Profile', path: routes.profile, icon: User }];
    case 'STAFF': return [{ label: 'Patients', path: routes.dashboard, icon: Home }, { label: 'Appointments', path: routes.appointments, icon: CalendarDays }, { label: 'Profile', path: routes.profile, icon: User }];
    default: return [{ label: 'Home', path: routes.dashboard, icon: Home }, { label: 'Documents', path: routes.records, icon: Folders }, { label: 'Visits', path: routes.appointments, icon: CalendarDays }, { label: 'Profile', path: routes.profile, icon: User }, { label: 'Settings', path: routes.settings, icon: Settings }];
  }
};
