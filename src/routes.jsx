import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from './utils/constants';
import { ProtectedRoute } from './components/layout';

/**
 * Central route map. Screens are injected from App while the legacy screens
 * are being migrated one by one, keeping the route contract unchanged.
 */
export default function AppRoutes({ screens }) {
  const guarded = (Screen) => <ProtectedRoute><Screen /></ProtectedRoute>;
  const {
    SplashScreen, LoginScreen, RegisterScreen, ForgotPasswordScreen,
    DashboardScreen, RecordsScreen, UploadReportScreen, ReportDetailsScreen,
    HealthScreen, AppointmentsScreen, AiAssistantScreen, ProfilePage,
    SettingsScreen, StatisticsScreen, HospitalAdminsScreen, DoctorsScreen,
    StaffScreen, PatientsScreen,
  } = screens;

  return <Routes>
    <Route path="/" element={guarded(DashboardScreen)} />
    <Route path={routes.splash} element={<SplashScreen />} />
    <Route path={routes.login} element={<LoginScreen />} />
    <Route path={routes.register} element={<RegisterScreen />} />
    <Route path={routes.forgotPassword} element={<ForgotPasswordScreen />} />
    <Route path={routes.dashboard} element={guarded(DashboardScreen)} />
    <Route path={routes.records} element={guarded(RecordsScreen)} />
    <Route path={routes.uploadReport} element={guarded(UploadReportScreen)} />
    <Route path={routes.reportDetails} element={guarded(ReportDetailsScreen)} />
    <Route path={routes.health} element={guarded(HealthScreen)} />
    <Route path={routes.appointments} element={guarded(AppointmentsScreen)} />
    <Route path={routes.ai} element={guarded(AiAssistantScreen)} />
    <Route path={routes.profile} element={guarded(ProfilePage)} />
    <Route path={routes.settings} element={guarded(SettingsScreen)} />
    <Route path={routes.statistics} element={guarded(StatisticsScreen)} />
    <Route path={routes.hospitalAdmins} element={guarded(HospitalAdminsScreen)} />
    <Route path={routes.doctors} element={guarded(DoctorsScreen)} />
    <Route path={routes.staff} element={guarded(StaffScreen)} />
    <Route path={routes.patients} element={guarded(PatientsScreen)} />
  </Routes>;
}
