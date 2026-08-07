import React from 'react';
import {
  FaEdit,
  FaUserPlus,
  FaKey,
  FaTrashAlt,
} from "react-icons/fa";
import {
  Bell,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Download,
  FileText,
  Folders,
  Heart,
  HeartPulse,
  Home,
  Lock,
  Mail,
  Menu,
  NotebookText,
  Phone,
  QrCode,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tags,
  UploadCloud,
  User,
  UserPlus,
  Weight,
  X,
  FilePenLine,
  Paperclip,
  KeyRound,
  Activity,
  Droplets,
  Gauge,
  Pill,
  Hospital,
  SlidersHorizontal,
  LogIn,
  LogOut,
  LockKeyhole,
  ContactRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { routes, getNavigationItems } from './constants/routes';
import { API_BASE_URL, apiRequest, authRequest, clearSession, getStoredToken, getStoredUser, handleFileUpload, saveSession } from './services/api';
import { AppLogo, Card, Field, PrimaryButton, StatusMessage } from './components/ui';
import { PageShell, ProtectedRoute, useStoredUser } from './components/layout';
import ProfilePage from './pages/ProfilePage';
import AppRoutes from './routes';

function App() {
  return <AppRoutes screens={{
    SplashScreen, LoginScreen, RegisterScreen, ForgotPasswordScreen,
    DashboardScreen, RecordsScreen, UploadReportScreen, ReportDetailsScreen,
    HealthScreen, AppointmentsScreen, AiAssistantScreen, ProfilePage,
    SettingsScreen, StatisticsScreen, HospitalAdminsScreen, DoctorsScreen,
    StaffScreen, PatientsScreen,
  }} />;
}

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate(routes.dashboard), 1200);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <Heart size={80} fill="currentColor" />
      <h1>Smart Health</h1>
    </div>
  );
}

function LoginScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredToken()) {
      navigate(routes.dashboard, { replace: true });
    }
  }, [navigate]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const data = await authRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      saveSession(data);
      navigate(routes.dashboard, { replace: true });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-cardless" onSubmit={handleSubmit}>
        <AppLogo size={74} />
        <section className="auth-heading">
          <h3 className='text-center'>Login</h3>
          <p className='text-center'>Sign in to manage reports, reminders, and health history.</p>
        </section>
        {status.message ? <StatusMessage type={status.type}>{status.message}</StatusMessage> : null}
        <Field label="Email" hint="patient@example.com" icon={Mail} type="email" name="email" value={form.email} onChange={updateField} required />
        <Field label="Password" hint="Enter password" icon={Lock} type="password" name="password" value={form.password} onChange={updateField} required />
        <div className="text-end">
          <Link className="text-link" to={routes.forgotPassword}>Forgot password?</Link>
        </div>
        <PrimaryButton icon={LogIn} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login'}</PrimaryButton>
        <p className="auth-switch">
          New to Smart Health?
          <Link to={routes.register}>Register</Link>
        </p>
        <div className="privacy-note">
          <ShieldCheck size={22} />
          <p>Your health records stay private and accessible only to you.</p>
        </div>
      </form>
    </AuthLayout>
  );
}

function RegisterScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredToken()) {
      navigate(routes.dashboard, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/hospitals`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHospitals(data.hospitals);
          if (data.hospitals.length > 0) {
            setSelectedHospital(data.hospitals[0].hospital_id);
          }
        }
      })
      .catch(err => console.error("Error loading hospitals:", err));
  }, []);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    if (!selectedHospital) {
      setStatus({ type: 'error', message: 'Please select a hospital' });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await authRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          hospital_id: selectedHospital,
        }),
      });
      saveSession(data);
      navigate(routes.dashboard, { replace: true });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell title="Create Account" appNav={false}>
      <form className="form-page" onSubmit={handleSubmit}>
        <section className="auth-heading">
          <h1>Create your patient account</h1>
          <p>This registration creates a patient account at your selected hospital.</p>
        </section>
        {status.message ? <StatusMessage type={status.type}>{status.message}</StatusMessage> : null}
        <Field label="Full name" hint="Enter patient name" icon={User} name="full_name" value={form.full_name} onChange={updateField} required />
        <Field label="Email" hint="patient@example.com" icon={Mail} type="email" name="email" value={form.email} onChange={updateField} required />
        <Field label="Phone" hint="+91 98765 43210" icon={Phone} type="tel" name="phone" value={form.phone} onChange={updateField} required />
        <label className="field">
          <span>Select Hospital</span>
          <div className="field-control">
            <Hospital size={22} />
            <select name="hospital_id" value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)} required>
              <option value="">Select Hospital</option>
              {hospitals.map(h => (
                <option key={h.hospital_id} value={h.hospital_id}>
                  {h.hospital_name} ({h.city})
                </option>
              ))}
            </select>
          </div>
        </label>
        <Field label="Password" hint="Create password" icon={Lock} type="password" name="password" value={form.password} onChange={updateField} required />
        <Field label="Confirm password" hint="Re-enter password" icon={KeyRound} type="password" name="confirmPassword" value={form.confirmPassword} onChange={updateField} required />
        <PrimaryButton icon={UserPlus} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Register'}</PrimaryButton>
        <button className="text-button" type="button" onClick={() => navigate(routes.login)}>Already have an account? Login</button>
      </form>
    </PageShell>
  );
}

function ForgotPasswordScreen() {
  const navigate = useNavigate();

  return (
    <PageShell title="Reset Password" appNav={false}>
      <div className="form-page narrow-left">
        <section className="auth-heading">
          <h1>Recover your account</h1>
          <p>Enter your registered email and we will send a password reset link.</p>
        </section>
        <Field label="Email" hint="patient@example.com" icon={Mail} type="email" />
        <PrimaryButton icon={Send} onClick={() => navigate(-1)}>Send Reset Link</PrimaryButton>
      </div>
    </PageShell>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="auth-screen">
      {children}
    </div>
  );
}

function DashboardScreen() {
  const user = useStoredUser();

  switch (user?.role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'HOSPITAL_ADMIN':
      return <HospitalAdminDashboard />;
    case 'DOCTOR':
      return <DoctorDashboard />;
    case 'STAFF':
      return <StaffDashboard />;
    case 'PATIENT':
    default:
      return <PatientDashboardScreen />;
  }
}

function PatientDashboardScreen() {
  const navigate = useNavigate();
  const user = useStoredUser();
  const firstName = user?.full_name?.split(' ')[0] || 'there';

  const [stats, setStats] = useState({ reports: 0, appointments: 0, metrics: 0 });

  useEffect(() => {
    // Fetch stats in parallel
    Promise.all([
      apiRequest('/patient/reports').catch(() => ({ reports: [] })),
      apiRequest('/patient/appointments').catch(() => ({ appointments: [] })),
      apiRequest('/patient/metrics').catch(() => ({ metrics: [] })),
    ]).then(([repData, appData, metData]) => {
      setStats({
        reports: repData.reports?.length || 0,
        appointments: appData.appointments?.length || 0,
        metrics: metData.metrics?.length || 0,
      });
    });
  }, []);

  const menuTiles = [
    { title: 'Documents', subtitle: 'Upload & view', icon: Folders, color: 'primary', path: routes.records },
    { title: 'Upload', subtitle: 'New report', icon: UploadCloud, color: 'success', path: routes.uploadReport },
    { title: 'Appointments', subtitle: 'Schedule', icon: CalendarDays, color: 'warning', path: routes.appointments },
    { title: 'Health', subtitle: 'Vitals & trends', icon: HeartPulse, color: 'info', path: routes.health },
  ];

  return (
    <PageShell
      title="Home"
      showDrawer
      bottomNavIndex={0}
      actions={
        <Link className="icon-btn" title="Settings" to={routes.settings}>
          <Settings size={22} />
        </Link>
      }
    >
      <section className="hero-panel">
        <h2>Good afternoon, {firstName}</h2>
        <p>Your records, appointments, and health reminders are ready.</p>
        <div className="hero-stats">
          <HeroStat value={stats.reports} label="Reports" />
          <HeroStat value={stats.appointments} label="Appointments" />
          <HeroStat value={stats.metrics} label="Vitals Logged" />
        </div>
      </section>

      <div className="section-title-row">
        <h2>Quick menu</h2>
        <Link to={routes.records}>View records</Link>
      </div>
      <div className="tile-grid">
        {menuTiles.map((tile) => (
          <MenuTile key={tile.title} {...tile} onClick={() => navigate(tile.path)} />
        ))}
      </div>

      <h2 className="section-title">Recent activity</h2>
      <ActivityTile icon={FileText} title="Blood test uploaded" subtitle="Today, 10:40 AM" />
      <ActivityTile icon={Pill} title="Medicine reminder completed" subtitle="Today, 8:00 AM" />
      <ActivityTile icon={QrCode} title="Emergency profile updated" subtitle="Yesterday" />
    </PageShell>
  );
}

function HeroStat({ value, label }) {
  return (
    <div className="hero-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function MenuTile({ title, subtitle, icon: Icon, color, onClick }) {
  return (
    <Card className="menu-tile" onClick={onClick}>
      <span className={`icon-circle ${color}`}>
        <Icon size={22} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </Card>
  );
}

function ActivityTile({ icon: Icon, title, subtitle }) {
  return (
    <Card className="activity-tile">
      <Icon className="primary-text" size={24} />
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <ChevronRight className="muted-icon" size={24} />
    </Card>
  );
}

function RecordsScreen() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    apiRequest('/patient/reports')
      .then(data => {
        if (data.success) {
          setReports(data.reports || []);
        }
      })
      .catch(err => console.error("Error loading patient reports:", err))
      .finally(() => setLoading(false));
  }, []);

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'lab report':
      case 'lab':
        return 'error';
      case 'prescription':
        return 'success';
      case 'radiology':
        return 'info';
      case 'consultation':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const filteredReports = filter === 'All' 
    ? reports 
    : reports.filter(r => r.category?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <PageShell
      title="Documents"
      bottomNavIndex={1}
    >
      <div className="search-field">
        <Search size={22} />
        <input placeholder="Search reports, prescriptions..." />
        <button className="icon-btn" type="button" title="Filter">
          <SlidersHorizontal size={21} />
        </button>
      </div>
      <div className="chip-row">
        {['All', 'Lab', 'Prescription', 'Radiology'].map((chip) => (
          <button 
            key={chip} 
            className={`choice-chip ${filter === chip ? 'selected' : ''}`} 
            type="button"
            onClick={() => setFilter(chip)}
          >
            {chip}
          </button>
        ))}
      </div>
      <h2 className="section-title">Your documents</h2>
      {loading ? (
        <div className="center-message">Loading reports...</div>
      ) : filteredReports.length === 0 ? (
        <div className="center-message">No documents found.</div>
      ) : (
        filteredReports.map((report) => (
          <ReportCard 
            key={report.report_id} 
            report={{
              title: report.title,
              category: report.category,
              date: new Date(report.created_at).toLocaleDateString(),
              type: report.file_url ? report.file_url.split('.').pop().toUpperCase() : 'PDF',
              color: getCategoryColor(report.category)
            }} 
            onClick={() => navigate(routes.reportDetails, { state: { report } })} 
          />
        ))
      )}
    </PageShell>
  );
}

function ReportCard({ report, onClick }) {
  return (
    <Card className="report-card" onClick={onClick}>
      <span className={`doc-icon ${report.color}`}>
        <FileText size={26} />
      </span>
      <div className="report-info">
        <h3>{report.title}</h3>
        <p>{report.category} • {report.date}</p>
      </div>
      <span className="file-type">{report.type}</span>
    </Card>
  );
}

function UploadReportScreen() {
  const navigate = useNavigate();

  return (
    <PageShell title="Upload Document">
      <div className="form-page">
        <Card className="upload-card">
          <span className="upload-icon">
            <UploadCloud size={38} />
          </span>
          <h2>Choose medical document</h2>
          <p>Upload PDF, JPG, PNG, or DOC files up to 10 MB.</p>
          <button className="outline-action" type="button">
            <Paperclip size={20} />
            Select File
          </button>
        </Card>

        <h2 className="section-title">Document details</h2>
        <Field label="Document title" hint="Complete Blood Count" icon={FilePenLine} />
        <label className="field">
          <span>Category</span>
          <div className="field-control">
            <Tags size={22} />
            <select defaultValue="Lab Report">
              <option>Lab Report</option>
              <option>Prescription</option>
              <option>Radiology</option>
              <option>Consultation</option>
            </select>
          </div>
        </label>
        <Field label="Doctor or hospital" hint="City Care Hospital" icon={Hospital} />
        <Field label="Notes" hint="Add important observations" icon={NotebookText} rows={3} />
        <PrimaryButton icon={CheckCircle} onClick={() => navigate(routes.records)}>Save Document</PrimaryButton>
      </div>
    </PageShell>
  );
}

function ReportDetailsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;

  if (!report) {
    return (
      <PageShell title="Document View">
        <div className="center-message">
          <p>No document selected.</p>
          <button className="primary-btn mt-3" onClick={() => navigate(routes.records)}>Go to Documents</button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Document View"
      actions={
        <>
          {report.file_url ? (
            <a href={report.file_url} target="_blank" rel="noreferrer" className="icon-btn" title="Download">
              <Download size={22} />
            </a>
          ) : null}
        </>
      }
    >
      <section className="preview-panel">
        <div className="pdf-doc">
          <FileText size={52} />
        </div>
        <h2>{report.title}</h2>
        <p>{report.category}</p>
      </section>
      <Card className="details-card">
        <h2>Document details</h2>
        <DetailRow label="Category" value={report.category} />
        <DetailRow label="Uploaded" value={new Date(report.created_at || report.date).toLocaleDateString()} />
        {report.doctor_name ? <DetailRow label="Doctor" value={report.doctor_name} /> : null}
        {report.notes ? (
          <div className="mt-3">
            <strong>Notes:</strong>
            <p className="mt-1 text-secondary">{report.notes}</p>
          </div>
        ) : null}
      </Card>
      <Card className="summary-card">
        <div className="summary-title">
          <Sparkles size={22} />
          <h2>AI summary</h2>
        </div>
        <p>AI report insights: This is a secure digital record for {report.title}. Range parameters are stored for doctor verification.</p>
      </Card>
    </PageShell>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HealthScreen() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/patient/metrics')
      .then(data => {
        if (data.success && data.metrics && data.metrics.length > 0) {
          setMetrics(data.metrics[0]);
        }
      })
      .catch(err => console.error("Error loading health metrics:", err))
      .finally(() => setLoading(false));
  }, []);

  const displayMetrics = [
    { label: 'Heart Rate', value: metrics?.heart_rate ? `${metrics.heart_rate} bpm` : '--', icon: Activity, color: 'error' },
    { label: 'Blood Sugar', value: metrics?.blood_sugar ? `${metrics.blood_sugar} mg/dL` : '--', icon: Droplets, color: 'success' },
    { label: 'Blood Pressure', value: metrics?.blood_pressure ? metrics.blood_pressure : '--', icon: Gauge, color: 'primary' },
    { label: 'BMI', value: metrics?.bmi ? metrics.bmi : '--', icon: Weight, color: 'warning' },
  ];

  return (
    <PageShell title="Health Tracking">
      {loading ? (
        <div className="center-message">Loading health stats...</div>
      ) : (
        <div className="metric-grid">
          {displayMetrics.map((metric) => (
            <Card key={metric.label} className="metric-tile">
              <span className={`icon-circle ${metric.color}`}>
                <metric.icon size={22} />
              </span>
              <div>
                <h3>{metric.value}</h3>
                <p>{metric.label}</p>
                {metrics?.measured_at && <small className="text-muted d-block mt-1">Measured on {new Date(metrics.measured_at).toLocaleString()}</small>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest('/patient/appointments'),
      apiRequest('/patient/visits'),
    ])
      .then(([appointmentData, visitData]) => {
        setAppointments(appointmentData.appointments || []);
        setVisits(visitData.visits || []);
      })
      .catch(err => console.error("Error loading patient visits:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="Appointments" bottomNavIndex={2}>
      {loading ? (
        <div className="center-message">Loading appointments...</div>
      ) : appointments.length === 0 && visits.length === 0 ? (
        <div className="center-message">No visits recorded yet.</div>
      ) : (
        <>
          {visits.map((visit) => (
            <Card key={`visit-${visit.visit_id}`} className="visit-card">
              <span className="icon-circle success"><NotebookText size={22} /></span>
              <div>
                <h3>Visit Record</h3>
                <p>{new Date(visit.visit_date).toLocaleString()}</p>
                <p className="mb-1">{visit.description}</p>
                <small className="text-muted">Added by {visit.created_by_name}</small>
              </div>
            </Card>
          ))}
          {appointments.map((visit) => (
            <Card key={`appointment-${visit.appointment_id}`} className="visit-card">
              <span className="icon-circle primary"><Stethoscope size={22} /></span>
              <div>
                <h3>{visit.doctor_name}</h3>
                <p>{new Date(visit.appointment_date).toLocaleString()}</p>
                <span className={`badge ${visit.status === 'scheduled' ? 'bg-primary' : visit.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>{visit.status}</span>
              </div>
            </Card>
          ))}
        </>
      )}
    </PageShell>
  );
}



function SettingsScreen() {
  return (
    <PageShell title="Settings">
      <div className="settings-list">
        <SettingToggle icon={Bell} title="Medicine reminders" checked />
        <SettingToggle icon={CalendarDays} title="Appointment alerts" checked />
        <div className="settings-row">
          <LockKeyhole size={24} />
          <span>Privacy and security</span>
          <ChevronRight size={24} />
        </div>
      </div>
    </PageShell>
  );
}

function SettingToggle({ icon: Icon, title, checked }) {
  const id = useMemo(() => title.toLowerCase().replaceAll(' ', '-'), [title]);

  return (
    <label className="settings-row" htmlFor={id}>
      <Icon size={24} />
      <span>{title}</span>
      <input id={id} className="form-check-input" type="checkbox" defaultChecked={checked} disabled />
    </label>
  );
}

function AiAssistantScreen() {
  return (
    <PageShell title="AI Assistant">
      <div className="center-message">AI report insights will appear here.</div>
    </PageShell>
  );
}

// ==========================================
// SUPER ADMIN DASHBOARD & SCREENS
// ==========================================

function SuperAdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [resetForm, setResetForm] = useState({ password: '' });

  const [hospForm, setHospForm] = useState({
    hospital_name: '',
    registration_number: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    status: 'active',
  });

  const [adminForm, setAdminForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  });

  const fetchHospitals = () => {
    setLoading(true);
    apiRequest('/superadmin/hospitals')
      .then((data) => {
        if (data.success) {
          setHospitals(data.hospitals || []);
        }
      })
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleHospSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      let msg = '';
      if (selectedHospital && selectedHospital.hospital_id) {
        await apiRequest(`/superadmin/hospitals/${selectedHospital.hospital_id}`, {
          method: 'PUT',
          body: JSON.stringify(hospForm),
        });
        msg = 'Hospital updated successfully!';
      } else {
        await apiRequest('/superadmin/hospitals', {
          method: 'POST',
          body: JSON.stringify(hospForm),
        });
        msg = 'Hospital created successfully!';
      }
      setStatus({ type: 'success', message: msg });
      setShowAddForm(false);
      setSelectedHospital(null);
      setHospForm({
        hospital_name: '',
        registration_number: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        status: 'active',
      });
      fetchHospitals();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest(editingAdmin
        ? `/superadmin/hospitals/${selectedHospital.hospital_id}/admin`
        : '/superadmin/hospital-admin', {
        method: editingAdmin ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...adminForm,
          ...(!editingAdmin && { hospital_id: selectedHospital.hospital_id }),
        }),
      });
      setStatus({ type: 'success', message: editingAdmin
        ? `Administrator for ${selectedHospital.hospital_name} updated successfully!`
        : `Administrator assigned to ${selectedHospital.hospital_name}!` });
      setShowAdminForm(false);
      setEditingAdmin(false);
      setAdminForm({ full_name: '', email: '', phone: '', password: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const openAdminForm = async (hospital) => {
    setStatus({ type: '', message: '' });
    setSelectedHospital(hospital);
    try {
      const data = await apiRequest(`/superadmin/hospitals/${hospital.hospital_id}/admin`);
      const admin = data.admin;
      setEditingAdmin(Boolean(admin));
      setAdminForm(admin
        ? { full_name: admin.full_name, email: admin.email, phone: admin.phone, password: '' }
        : { full_name: '', email: hospital.email || '', phone: hospital.phone || '', password: '' });
      setShowAdminForm(true);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/superadmin/hospital-admin/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          hospital_id: selectedHospital.hospital_id,
          new_password: resetForm.password,
        }),
      });
      setStatus({ type: 'success', message: `Administrator password for ${selectedHospital.hospital_name} reset successfully!` });
      setShowResetForm(false);
      setResetForm({ password: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;
    try {
      await apiRequest(`/superadmin/hospitals/${id}`, { method: 'DELETE' });
      setStatus({ type: 'success', message: 'Hospital deleted successfully!' });
      fetchHospitals();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const toggleStatus = async (hosp) => {
    const nextStatus = hosp.status === 'active' ? 'inactive' : 'active';
    try {
      await apiRequest(`/superadmin/hospitals/${hosp.hospital_id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...hosp, status: nextStatus }),
      });
      fetchHospitals();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <PageShell title="Super Admin Workspace">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Hospital Directory</h2>
        <button
          className="primary-btn"
          style={{ width: 'auto', padding: '0 20px' }}
          onClick={() => {
            setSelectedHospital(null);
            setHospForm({
              hospital_name: '',
              registration_number: '',
              email: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              country: '',
              status: 'active',
            });
            setShowAddForm(true);
          }}
        >
          <Hospital size={18} className="me-1" /> Add Hospital
        </button>
      </div>

      {status.message && <StatusMessage type={status.type}>{status.message}</StatusMessage>}

      {showAddForm && (
        <Card className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>{selectedHospital ? 'Edit Hospital' : 'Create New Hospital'}</h3>
            <button className="icon-btn text-danger" onClick={() => setShowAddForm(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleHospSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Hospital Name</label>
              <input
                type="text"
                className="form-control"
                value={hospForm.hospital_name}
                onChange={(e) => setHospForm({ ...hospForm, hospital_name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Registration Number</label>
              <input
                type="text"
                className="form-control"
                value={hospForm.registration_number}
                onChange={(e) => setHospForm({ ...hospForm, registration_number: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={hospForm.email}
                onChange={(e) => setHospForm({ ...hospForm, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                value={hospForm.phone}
                onChange={(e) => setHospForm({ ...hospForm, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                value={hospForm.address}
                onChange={(e) => setHospForm({ ...hospForm, address: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="col-md-4">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={hospForm.city}
                onChange={(e) => setHospForm({ ...hospForm, city: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                value={hospForm.state}
                onChange={(e) => setHospForm({ ...hospForm, state: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={hospForm.country}
                onChange={(e) => setHospForm({ ...hospForm, country: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={hospForm.status}
                onChange={(e) => setHospForm({ ...hospForm, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12 mt-3 text-end">
              <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 24px' }}>Save Hospital</button>
            </div>
          </form>
        </Card>
      )}

      {showAdminForm && selectedHospital && (
        <Card className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>{editingAdmin ? 'Edit Admin' : 'Assign Admin'} for {selectedHospital.hospital_name}</h3>
            <button className="icon-btn text-danger" onClick={() => { setShowAdminForm(false); setEditingAdmin(false); }}><X size={20} /></button>
          </div>
          <form onSubmit={handleAdminSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={adminForm.full_name}
                onChange={(e) => setAdminForm({ ...adminForm, full_name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                value={adminForm.phone}
                onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password{editingAdmin && ' (leave blank to keep current password)'}</label>
              <input
                type="password"
                className="form-control"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                required={!editingAdmin}
              />
            </div>
            <div className="col-12 mt-3 text-end">
              <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 24px' }}>{editingAdmin ? 'Update Admin' : 'Create Admin'}</button>
            </div>
          </form>
        </Card>
      )}

      {showResetForm && selectedHospital && (
        <Card className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Reset Admin Password for {selectedHospital.hospital_name}</h3>
            <button className="icon-btn text-danger" onClick={() => setShowResetForm(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleResetSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={resetForm.password}
                onChange={(e) => setResetForm({ password: e.target.value })}
                required
              />
            </div>
            <div className="col-12 mt-3 text-end">
              <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 24px' }}>Reset Password</button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="center-message">Loading hospitals...</div>
      ) : hospitals.length === 0 ? (
        <div className="center-message">No hospitals registered yet.</div>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Hospital Name</th>
                <th>Reg. Number</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map((h) => (
                <tr key={h.hospital_id}>
                  <td>
                    <strong>{h.hospital_name}</strong>
                  </td>
                  <td><code>{h.registration_number}</code></td>
                  <td>
                    <div style={{ fontSize: '13px' }}>{h.email}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{h.phone}</div>
                  </td>
                  <td>{h.city}, {h.country}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${h.status === 'active' ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => toggleStatus(h)}
                    >
                      {h.status.toUpperCase()}
                    </button>
                  </td>
                 <td>
  <div className="d-flex gap-2 justify-content-center">

    {/* Edit */}
    <button
      className="btn btn-sm btn-outline-primary"
      title="Edit Hospital"
      onClick={() => {
        setSelectedHospital(h);
        setHospForm({ ...h });
        setShowAddForm(true);
      }}
    >
      <FaEdit />
    </button>

    {/* Assign Admin */}
    <button
      className="btn btn-sm btn-outline-info"
      title="Assign or Edit Admin"
      onClick={() => openAdminForm(h)}
    >
      <FaUserPlus />
    </button>

    {/* Reset Password */}
    <button
      className="btn btn-sm btn-outline-warning"
      title="Reset Password"
      onClick={() => {
        setSelectedHospital(h);
        setShowResetForm(true);
      }}
    >
      <FaKey />
    </button>

    {/* Delete */}
    <button
      className="btn btn-sm btn-outline-danger"
      title="Delete Hospital"
      onClick={() => handleDelete(h.hospital_id)}
    >
      <FaTrashAlt />
    </button>

  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}

function StatisticsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest('/superadmin/statistics')
      .then((data) => {
        if (data.success) {
          setStats(data.statistics);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="System Statistics">
      {loading ? (
        <div className="center-message">Loading statistics...</div>
      ) : (
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <Card className="p-4 bg-primary text-white text-center">
              <h3>{stats.total_hospitals}</h3>
              <p className="text-white-50 m-0">Total Hospitals</p>
            </Card>
          </div>
          <div className="col-md-6 col-lg-4">
            <Card className="p-4 bg-success text-white text-center">
              <h3>{stats.active_hospitals}</h3>
              <p className="text-white-50 m-0">Active Hospitals</p>
            </Card>
          </div>
          <div className="col-md-6 col-lg-4">
            <Card className="p-4 bg-info text-white text-center">
              <h3>{stats.total_users}</h3>
              <p className="text-white-50 m-0">Registered Users</p>
            </Card>
          </div>
          <div className="col-12 mt-4">
            <Card>
              <h3 className="mb-3">Users Breakdown by Role</h3>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 text-center">
                {[
                  { label: 'Hospital Admins', count: stats.hospital_admins, path: routes.hospitalAdmins },
                  { label: 'Doctors', count: stats.doctors, path: routes.doctors },
                  { label: 'Staff', count: stats.staff, path: routes.staff },
                  { label: 'Patients', count: stats.patients, path: routes.patients },
                ].map((item) => (
                  <div className="col" key={item.label}>
                    <button className="role-summary-button" onClick={() => navigate(item.path)}>
                      <h4>{item.count}</h4>
                      <span>{item.label}</span>
                      <small>View directory</small>
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageShell>
  );
}

// ==========================================
// HOSPITAL ADMIN DASHBOARD & MANAGEMENT
// ==========================================

function HospitalAdminDashboard() {
  const [hosp, setHosp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    apiRequest('/admin/hospital')
      .then((data) => {
        if (data.success) {
          setHosp(data.hospital);
        }
      })
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/admin/hospital', {
        method: 'PUT',
        body: JSON.stringify(hosp),
      });
      setStatus({ type: 'success', message: 'Hospital profile updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  if (loading) {
    return (
      <PageShell title="Hospital Configuration">
        <div className="center-message">Loading settings...</div>
      </PageShell>
    );
  }

  if (!hosp) {
    return (
      <PageShell title="Hospital Configuration">
        <StatusMessage type="error">
          {status.message || 'Your hospital profile could not be found. Please contact the Super Admin to assign your account to a hospital.'}
        </StatusMessage>
      </PageShell>
    );
  }

  return (
    <PageShell title="Hospital Configuration">
      {status.message && <StatusMessage type={status.type}>{status.message}</StatusMessage>}
      <Card>
        <h3 className="mb-3">Edit Hospital Information</h3>
        <form onSubmit={handleUpdate} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Hospital Name</label>
            <input
              type="text"
              className="form-control"
              value={hosp.hospital_name || ''}
              onChange={(e) => setHosp({ ...hosp, hospital_name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Registration Number</label>
            <input
              type="text"
              className="form-control"
              value={hosp.registration_number || ''}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={hosp.email || ''}
              onChange={(e) => setHosp({ ...hosp, email: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone Contact</label>
            <input
              type="text"
              className="form-control"
              value={hosp.phone || ''}
              onChange={(e) => setHosp({ ...hosp, phone: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Street Address</label>
            <textarea
              className="form-control"
              value={hosp.address || ''}
              onChange={(e) => setHosp({ ...hosp, address: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="col-md-4">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              value={hosp.city || ''}
              onChange={(e) => setHosp({ ...hosp, city: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              value={hosp.state || ''}
              onChange={(e) => setHosp({ ...hosp, state: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-control"
              value={hosp.country || ''}
              onChange={(e) => setHosp({ ...hosp, country: e.target.value })}
              required
            />
          </div>
          <div className="col-12 mt-3 text-end">
            <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 24px' }}>Update Profile</button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}

// SUB-USER GENERATION TEMPLATE
function UserManagementScreen({ role, title, icon: ScreenIcon }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', category: 'Lab Report', notes: '', file_url: '' });
  const [fileUploading, setFileUploading] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    status: 'active',
  });

  const fetchUsers = () => {
    setLoading(true);
    apiRequest(`/admin/users?role=${role}`)
      .then((data) => {
        if (data.success) {
          setUsers(data.users || []);
        }
      })
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      let msg = '';
      if (selectedUser) {
        await apiRequest(`/admin/users/${selectedUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        msg = 'User updated successfully!';
      } else {
        const endpoint = role === 'DOCTOR' ? '/admin/doctors' : role === 'STAFF' ? '/admin/staff' : '/admin/patients';
        await apiRequest(endpoint, {
          method: 'POST',
          body: JSON.stringify(form),
        });
        msg = 'User created successfully!';
      }
      setStatus({ type: 'success', message: msg });
      setShowAddForm(false);
      setSelectedUser(null);
      setForm({ full_name: '', email: '', phone: '', password: '', status: 'active' });
      fetchUsers();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
      setStatus({ type: 'success', message: 'User deleted successfully!' });
      fetchUsers();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/admin/report', {
        method: 'POST',
        body: JSON.stringify({
          patient_id: selectedUser.id,
          title: uploadForm.title,
          category: uploadForm.category,
          notes: uploadForm.notes,
          file_url: uploadForm.file_url,
        }),
      });
      setStatus({ type: 'success', message: `Document uploaded successfully for ${selectedUser.full_name}!` });
      setShowUploadForm(false);
      setUploadForm({ title: '', category: 'Lab Report', notes: '', file_url: '' });
      setSelectedUser(null);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <PageShell title={title}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>List of {role.charAt(0) + role.slice(1).toLowerCase()}s</h2>
        <button
          className="primary-btn"
          style={{ width: 'auto', padding: '0 20px' }}
          onClick={() => {
            setSelectedUser(null);
            setForm({ full_name: '', email: '', phone: '', password: '', status: 'active' });
            setShowAddForm(true);
          }}
        >
          <ScreenIcon size={18} className="me-1" /> Add {role.charAt(0) + role.slice(1).toLowerCase()}
        </button>
      </div>

      {status.message && <StatusMessage type={status.type}>{status.message}</StatusMessage>}

      {showAddForm && (
        <Card className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>{selectedUser ? 'Edit User details' : 'Register New User'}</h3>
            <button className="icon-btn text-danger" onClick={() => setShowAddForm(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password {selectedUser && '(Leave blank to keep current)'}</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!selectedUser}
              />
            </div>
            {selectedUser && (
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
            <div className="col-12 mt-3 text-end">
              <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 24px' }}>Save Profile</button>
            </div>
          </form>
        </Card>
      )}

      {showUploadForm && selectedUser && (
        <Card className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Upload Document for {selectedUser.full_name}</h3>
            <button className="icon-btn text-danger" onClick={() => { setShowUploadForm(false); setSelectedUser(null); }}><X size={20} /></button>
          </div>
          <form onSubmit={handleUploadSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Document Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Blood Test Report"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
              >
                <option value="Lab Report">Lab Report</option>
                <option value="Radiology">Radiology</option>
                <option value="Prescription">Prescription</option>
                <option value="Consultation">Consultation</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Upload Local Document</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileUpload(e, (url) => setUploadForm({ ...uploadForm, file_url: url }), setFileUploading)}
              />
              {fileUploading && <small className="text-primary d-block mt-1">Uploading document to server...</small>}
              {uploadForm.file_url && (
                <small className="text-success d-block mt-1">
                  ✓ Uploaded successfully: <a href={uploadForm.file_url} target="_blank" rel="noreferrer">View File</a>
                </small>
              )}
            </div>
            <div className="col-12">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Add observations or notes..."
                value={uploadForm.notes}
                onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
              ></textarea>
            </div>
            <div className="col-12 mt-3 text-end">
              <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 24px' }}>Submit Document</button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="center-message">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="center-message">No users found for this role.</div>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.full_name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {role === 'PATIENT' && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => {
                            setSelectedUser(u);
                            setShowUploadForm(true);
                          }}
                        >
                          Upload Doc
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setSelectedUser(u);
                          setForm({
                            full_name: u.full_name,
                            email: u.email,
                            phone: u.phone,
                            password: '',
                            status: u.status,
                          });
                          setShowAddForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}

function SuperAdminDirectoryScreen({ role, title }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiRequest(`/superadmin/users?role=${role}`)
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [role]);

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.full_name}? This cannot be undone.`)) return;
    setError('');
    setMessage('');
    try {
      const data = await apiRequest(`/superadmin/users/${user.id}`, { method: 'DELETE' });
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setMessage(data.message || 'User deleted successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PageShell title={title}>
      <Card>
        <h2 className="mb-4">{title}</h2>
        {message && <StatusMessage type="success">{message}</StatusMessage>}
        {loading ? <div className="center-message">Loading users...</div> : error ? (
          <StatusMessage type="error">{error}</StatusMessage>
        ) : users.length === 0 ? <div className="center-message">No {role.toLowerCase()}s found.</div> : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Name</th><th>Hospital</th><th>Email</th><th>Phone</th><th>Status</th><th>Registered</th><th>Action</th></tr></thead>
              <tbody>{users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.full_name}</strong></td><td>{user.hospital_name}</td><td>{user.email}</td><td>{user.phone}</td>
                  <td><span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{user.status}</span></td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(user)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </PageShell>
  );
}

function HospitalAdminsScreen() { return <SuperAdminDirectoryScreen role="HOSPITAL_ADMIN" title="Hospital Admins Directory" />; }
function DoctorsScreen() { return getStoredUser()?.role === 'SUPER_ADMIN' ? <SuperAdminDirectoryScreen role="DOCTOR" title="Doctors Directory" /> : <UserManagementScreen role="DOCTOR" title="Doctor Directory" icon={Stethoscope} />; }
function StaffScreen() { return getStoredUser()?.role === 'SUPER_ADMIN' ? <SuperAdminDirectoryScreen role="STAFF" title="Staff Directory" /> : <UserManagementScreen role="STAFF" title="Staff Directory" icon={UserPlus} />; }
function PatientsScreen() { return getStoredUser()?.role === 'SUPER_ADMIN' ? <SuperAdminDirectoryScreen role="PATIENT" title="Patients Directory" /> : <UserManagementScreen role="PATIENT" title="Patient Directory" icon={User} />; }

// ==========================================
// DOCTOR DASHBOARD & OPERATIONS
// ==========================================

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedPat, setSelectedPat] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(''); // 'report', 'prescription', 'metrics'
  const [status, setStatus] = useState({ type: '', message: '' });

  // Forms states
  const [reportForm, setReportForm] = useState({ title: '', category: 'Lab Report', notes: '', file_url: '' });
  const [prescForm, setPrescForm] = useState({ diagnosis: '', medications: '', notes: '' });
  const [metricsForm, setMetricsForm] = useState({ heart_rate: '', blood_sugar: '', blood_pressure: '', bmi: '' });
  const [showAddPatForm, setShowAddPatForm] = useState(false);
  const [patForm, setPatForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [fileUploading, setFileUploading] = useState(false);

  const loadPatients = () => {
    setLoading(true);
    apiRequest('/doctor/patients')
      .then((data) => {
        if (data.success) {
          setPatients(data.patients || []);
        }
      })
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const selectPatient = (pat) => {
    setLoading(true);
    setSelectedPat(pat);
    apiRequest(`/doctor/patient/${pat.id}`)
      .then((data) => {
        if (data.success) {
          setHistory(data.history);
        }
      })
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/doctor/report', {
        method: 'POST',
        body: JSON.stringify({ ...reportForm, patient_id: selectedPat.id }),
      });
      setStatus({ type: 'success', message: 'Medical report saved successfully!' });
      setShowModal('');
      setReportForm({ title: '', category: 'Lab Report', notes: '', file_url: '' });
      selectPatient(selectedPat);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrescSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/doctor/prescription', {
        method: 'PUT',
        body: JSON.stringify({ ...prescForm, patient_id: selectedPat.id }),
      });
      setStatus({ type: 'success', message: 'Prescription issued successfully!' });
      setShowModal('');
      setPrescForm({ diagnosis: '', medications: '', notes: '' });
      selectPatient(selectedPat);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/doctor/metrics', {
        method: 'PUT',
        body: JSON.stringify({
          patient_id: selectedPat.id,
          heart_rate: metricsForm.heart_rate ? parseInt(metricsForm.heart_rate) : null,
          blood_sugar: metricsForm.blood_sugar ? parseInt(metricsForm.blood_sugar) : null,
          blood_pressure: metricsForm.blood_pressure,
          bmi: metricsForm.bmi ? parseFloat(metricsForm.bmi) : null,
        }),
      });
      setStatus({ type: 'success', message: 'Vitals updated successfully!' });
      setShowModal('');
      setMetricsForm({ heart_rate: '', blood_sugar: '', blood_pressure: '', bmi: '' });
      selectPatient(selectedPat);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/doctor/patient', {
        method: 'POST',
        body: JSON.stringify(patForm),
      });
      setStatus({ type: 'success', message: 'Patient registered successfully!' });
      setShowAddPatForm(false);
      setPatForm({ full_name: '', email: '', phone: '', password: '' });
      loadPatients();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell title="Doctor Workspace">
      {status.message && <StatusMessage type={status.type}>{status.message}</StatusMessage>}

      {selectedPat ? (
        <div>
          <button className="btn btn-outline-secondary mb-3" onClick={() => { setSelectedPat(null); setHistory(null); }}>
            ← Back to Patient List
          </button>
          
          <Card className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>{selectedPat.full_name}</h2>
                <span className="text-muted">{selectedPat.email} • {selectedPat.phone}</span>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={() => setShowModal('report')}>Upload Report</button>
                <button className="btn btn-success" onClick={() => setShowModal('prescription')}>Write Prescription</button>
                <button className="btn btn-warning" onClick={() => setShowModal('metrics')}>Update Vitals</button>
              </div>
            </div>
          </Card>

          {showModal === 'report' && (
            <Card className="mb-4">
              <h4>Upload Medical Report</h4>
              <form onSubmit={handleReportSubmit} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Report Title</label>
                  <input type="text" className="form-control" value={reportForm.title} onChange={e => setReportForm({ ...reportForm, title: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={reportForm.category} onChange={e => setReportForm({ ...reportForm, category: e.target.value })}>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Upload Local Document</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleFileUpload(e, (url) => setReportForm({ ...reportForm, file_url: url }), setFileUploading)}
                  />
                  {fileUploading && <small className="text-primary d-block mt-1">Uploading document to server...</small>}
                  {reportForm.file_url && (
                    <small className="text-success d-block mt-1">
                      ✓ Uploaded successfully: <a href={reportForm.file_url} target="_blank" rel="noreferrer">View File</a>
                    </small>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows="3" value={reportForm.notes} onChange={e => setReportForm({ ...reportForm, notes: e.target.value })}></textarea>
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="primary-btn" style={{ width: 'auto' }} disabled={submitting}>Submit Report</button>
                </div>
              </form>
            </Card>
          )}

          {showModal === 'prescription' && (
            <Card className="mb-4">
              <h4>Write Prescription</h4>
              <form onSubmit={handlePrescSubmit} className="row g-3">
                <div className="col-12">
                  <label className="form-label">Diagnosis</label>
                  <input type="text" className="form-control" placeholder="e.g., Hypertension" value={prescForm.diagnosis} onChange={e => setPrescForm({ ...prescForm, diagnosis: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Medications (One per line)</label>
                  <textarea className="form-control" rows="4" placeholder="e.g., Amlodipine 5mg - Once daily" value={prescForm.medications} onChange={e => setPrescForm({ ...prescForm, medications: e.target.value })} required></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows="2" value={prescForm.notes} onChange={e => setPrescForm({ ...prescForm, notes: e.target.value })}></textarea>
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="primary-btn" style={{ width: 'auto' }} disabled={submitting}>Issue Prescription</button>
                </div>
              </form>
            </Card>
          )}

          {showModal === 'metrics' && (
            <Card className="mb-4">
              <h4>Update Health Metrics</h4>
              <form onSubmit={handleMetricsSubmit} className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Heart Rate (bpm)</label>
                  <input type="number" className="form-control" value={metricsForm.heart_rate} onChange={e => setMetricsForm({ ...metricsForm, heart_rate: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Blood Sugar (mg/dL)</label>
                  <input type="number" className="form-control" value={metricsForm.blood_sugar} onChange={e => setMetricsForm({ ...metricsForm, blood_sugar: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Blood Pressure</label>
                  <input type="text" className="form-control" placeholder="120/80" value={metricsForm.blood_pressure} onChange={e => setMetricsForm({ ...metricsForm, blood_pressure: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">BMI</label>
                  <input type="number" step="0.1" className="form-control" value={metricsForm.bmi} onChange={e => setMetricsForm({ ...metricsForm, bmi: e.target.value })} />
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="primary-btn" style={{ width: 'auto' }} disabled={submitting}>Save Vitals</button>
                </div>
              </form>
            </Card>
          )}

          {history && (
            <div className="row">
              <div className="col-md-6 mb-4">
                <Card style={{ minHeight: '300px' }}>
                  <h3 className="mb-3">Vitals History</h3>
                  {history.health_metrics ? (
                    <div className="row text-center mb-3">
                      <div className="col-6 mb-2">
                        <strong>Heart Rate</strong>
                        <div>{history.health_metrics.heart_rate || '--'} bpm</div>
                      </div>
                      <div className="col-6 mb-2">
                        <strong>Blood Sugar</strong>
                        <div>{history.health_metrics.blood_sugar || '--'} mg/dL</div>
                      </div>
                      <div className="col-6">
                        <strong>Blood Pressure</strong>
                        <div>{history.health_metrics.blood_pressure || '--'}</div>
                      </div>
                      <div className="col-6">
                        <strong>BMI</strong>
                        <div>{history.health_metrics.bmi || '--'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted">No vitals logged yet.</div>
                  )}
                  {history.metrics_history && history.metrics_history.length > 0 && (
                    <ul className="list-group list-group-flush mt-3" style={{ fontSize: '13px' }}>
                      {history.metrics_history.slice(1, 4).map((m, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between p-2">
                          <span>{new Date(m.created_at).toLocaleDateString()}</span>
                          <span>HR: {m.heart_rate || '--'} | BP: {m.blood_pressure || '--'}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </div>

              <div className="col-md-6 mb-4">
                <Card style={{ minHeight: '300px' }}>
                  <h3 className="mb-3">Prescriptions</h3>
                  {history.prescriptions && history.prescriptions.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {history.prescriptions.map((p) => (
                        <div key={p.prescription_id} className="list-group-item p-2">
                          <div className="d-flex justify-content-between">
                            <strong>{p.diagnosis}</strong>
                            <span className="text-muted" style={{ fontSize: '11px' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                          </div>
                          <div style={{ whiteSpace: 'pre-line', fontSize: '13px', color: '#555' }} className="mt-1">{p.medications}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted">No prescriptions issued.</div>
                  )}
                </Card>
              </div>

              <div className="col-12">
                <Card>
                  <h3 className="mb-3">Medical Records</h3>
                  {history.reports && history.reports.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Notes</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.reports.map((r) => (
                            <tr key={r.report_id}>
                              <td><strong>{r.title}</strong></td>
                              <td><span className="badge bg-light text-dark">{r.category}</span></td>
                              <td>{r.notes || '--'}</td>
                              <td>{new Date(r.created_at).toLocaleDateString()}</td>
                              <td>
                                {r.file_url ? (
                                  <a href={r.file_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info">View File</a>
                                ) : (
                                  <span className="text-muted" style={{ fontSize: '12px' }}>No Attachment</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted">No reports uploaded.</div>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Patient Directory</h2>
            <button
              className="primary-btn"
              style={{ width: 'auto', padding: '0 20px' }}
              onClick={() => {
                setPatForm({ full_name: '', email: '', phone: '', password: '' });
                setShowAddPatForm(true);
              }}
            >
              Add Patient
            </button>
          </div>

          {showAddPatForm && (
            <Card className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Register New Patient</h3>
                <button className="icon-btn text-danger" onClick={() => setShowAddPatForm(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handlePatientSubmit} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={patForm.full_name}
                    onChange={(e) => setPatForm({ ...patForm, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={patForm.email}
                    onChange={(e) => setPatForm({ ...patForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={patForm.phone}
                    onChange={(e) => setPatForm({ ...patForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={patForm.password}
                    onChange={(e) => setPatForm({ ...patForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 mt-3 text-end">
                  <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 24px' }}>Save Profile</button>
                </div>
              </form>
            </Card>
          )}

          {loading ? (
            <div className="center-message">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="center-message">No patients registered in your hospital.</div>
          ) : (
            <div className="table-responsive bg-white rounded shadow-sm p-3">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat) => (
                    <tr key={pat.id}>
                      <td><strong>{pat.full_name}</strong></td>
                      <td>{pat.email}</td>
                      <td>{pat.phone}</td>
                      <td>
                        <span className={`badge ${pat.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                          {pat.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => selectPatient(pat)}>
                          Open Records
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}

// ==========================================
// STAFF DASHBOARD & OPERATIONS
// ==========================================

function StaffDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showApptForm, setShowApptForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [selectedPat, setSelectedPat] = useState(null);
  const [actionPatient, setActionPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');

  // Forms
  const [patForm, setPatForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [reportForm, setReportForm] = useState({ title: '', category: 'Lab Report', notes: '', file_url: '' });
  const [apptForm, setApptForm] = useState({ doctor_id: '', appointment_date: '' });
  const [visitForm, setVisitForm] = useState({ visit_date: '', description: '' });
  const [healthForm, setHealthForm] = useState({ heart_rate: '', blood_sugar: '', blood_pressure: '', bmi: '', measured_at: '' });
  const [fileUploading, setFileUploading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patData, apptData, docData, visitData] = await Promise.all([
        apiRequest('/staff/patients').catch(() => ({ patients: [] })),
        apiRequest('/staff/appointments').catch(() => ({ appointments: [] })),
        apiRequest('/staff/doctors').catch(() => ({ doctors: [] })),
        apiRequest('/staff/visits').catch(() => ({ visits: [] })),
      ]);
      setPatients(patData.patients || []);
      setAppointments(apptData.appointments || []);
      setDoctors(docData.doctors || []);
      setVisits(visitData.visits || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePatRegister = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      let msg = '';
      if (selectedPat) {
        await apiRequest(`/staff/patient/${selectedPat.id}`, {
          method: 'PUT',
          body: JSON.stringify(patForm),
        });
        msg = 'Patient updated successfully!';
      } else {
        await apiRequest('/staff/patient', {
          method: 'POST',
          body: JSON.stringify(patForm),
        });
        msg = 'Patient registered successfully!';
      }
      setStatus({ type: 'success', message: msg });
      setShowAddForm(false);
      setSelectedPat(null);
      setPatForm({ full_name: '', email: '', phone: '', password: '' });
      loadData();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/staff/report', {
        method: 'POST',
        body: JSON.stringify({ ...reportForm, patient_id: selectedPat.id }),
      });
      setStatus({ type: 'success', message: 'Medical report uploaded successfully!' });
      setShowReportForm(false);
      setReportForm({ title: '', category: 'Lab Report', notes: '', file_url: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleApptSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/staff/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patient_id: selectedPat.id,
          doctor_id: parseInt(apptForm.doctor_id),
          appointment_date: apptForm.appointment_date,
        }),
      });
      setStatus({ type: 'success', message: 'Appointment scheduled successfully!' });
      setShowApptForm(false);
      setApptForm({ doctor_id: '', appointment_date: '' });
      loadData();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const updateApptStatus = async (apptId, nextStatus) => {
    try {
      await apiRequest(`/staff/appointments/${apptId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      loadData();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/staff/visits', {
        method: 'POST',
        body: JSON.stringify({ ...visitForm, patient_id: selectedPat.id }),
      });
      setStatus({ type: 'success', message: `Visit added for ${selectedPat.full_name}!` });
      setShowVisitForm(false);
      setVisitForm({ visit_date: '', description: '' });
      loadData();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/staff/metrics', { method: 'POST', body: JSON.stringify({ ...healthForm, patient_id: selectedPat.id }) });
      setStatus({ type: 'success', message: `Health tracking added for ${selectedPat.full_name}!` });
      setShowHealthForm(false);
      setHealthForm({ heart_rate: '', blood_sugar: '', blood_pressure: '', bmi: '', measured_at: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handlePatientDelete = async (patient) => {
    if (!window.confirm(`Delete ${patient.full_name}? This also permanently removes their documents and visit history.`)) return;
    try {
      await apiRequest(`/staff/patient/${patient.id}`, { method: 'DELETE' });
      setStatus({ type: 'success', message: 'Patient deleted successfully!' });
      loadData();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const search = patientSearch.trim().toLowerCase();
    return !search || patient.full_name.toLowerCase().includes(search) || patient.phone.toLowerCase().includes(search);
  });

  return (
    <PageShell title="Staff Desk">
      {status.message && <StatusMessage type={status.type}>{status.message}</StatusMessage>}

      <div className="row">
        <div className="col-12 col-lg-7 mb-4">
          <Card>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Patients Directory</h3>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setSelectedPat(null);
                  setPatForm({ full_name: '', email: '', phone: '', password: '' });
                  setShowAddForm(true);
                }}
              >
                Register Patient
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handlePatRegister} className="row g-2 mb-3 bg-light p-3 rounded">
                <h5>{selectedPat ? 'Edit Patient Profile' : 'New Patient Registration'}</h5>
                <div className="col-md-6">
                  <input type="text" placeholder="Full Name" className="form-control" value={patForm.full_name} onChange={e => setPatForm({ ...patForm, full_name: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <input type="email" placeholder="Email" className="form-control" value={patForm.email} onChange={e => setPatForm({ ...patForm, email: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <input type="text" placeholder="Phone" className="form-control" value={patForm.phone} onChange={e => setPatForm({ ...patForm, phone: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <input type="password" placeholder="Password" className="form-control" value={patForm.password} onChange={e => setPatForm({ ...patForm, password: e.target.value })} required={!selectedPat} />
                </div>
                <div className="col-12 text-end mt-2">
                  <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => setShowAddForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-success">Save Patient</button>
                </div>
              </form>
            )}

            {showReportForm && selectedPat && (
              <form onSubmit={handleReportSubmit} className="row g-2 mb-3 bg-light p-3 rounded">
                <h5>Upload Document for {selectedPat.full_name}</h5>
                <div className="col-md-6">
                  <input type="text" placeholder="Document Title" className="form-control" value={reportForm.title} onChange={e => setReportForm({ ...reportForm, title: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <select className="form-select" value={reportForm.category} onChange={e => setReportForm({ ...reportForm, category: e.target.value })}>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
                <div className="col-12">
                   <label className="form-label text-muted" style={{ fontSize: '12px' }}>Upload Local Document</label>
                   <input
                     type="file"
                     className="form-control"
                     onChange={(e) => handleFileUpload(e, (url) => setReportForm({ ...reportForm, file_url: url }), setFileUploading)}
                   />
                   {fileUploading && <small className="text-primary d-block mt-1">Uploading document to server...</small>}
                   {reportForm.file_url && (
                     <small className="text-success d-block mt-1">
                       ✓ Uploaded successfully: <a href={reportForm.file_url} target="_blank" rel="noreferrer">View File</a>
                     </small>
                   )}
                 </div>
                <div className="col-12">
                  <textarea placeholder="Observation Notes" className="form-control" rows="2" value={reportForm.notes} onChange={e => setReportForm({ ...reportForm, notes: e.target.value })}></textarea>
                </div>
                <div className="col-12 text-end mt-2">
                  <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => setShowReportForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-success">Upload Report</button>
                </div>
              </form>
            )}

            {showApptForm && selectedPat && (
              <form onSubmit={handleApptSubmit} className="row g-2 mb-3 bg-light p-3 rounded">
                <h5>Schedule Appointment for {selectedPat.full_name}</h5>
                <div className="col-md-6">
                  <select className="form-select" value={apptForm.doctor_id} onChange={e => setApptForm({ ...apptForm, doctor_id: e.target.value })} required>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.full_name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <input type="datetime-local" className="form-control" value={apptForm.appointment_date} onChange={e => setApptForm({ ...apptForm, appointment_date: e.target.value })} required />
                </div>
                <div className="col-12 text-end mt-2">
                  <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => setShowApptForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-success">Confirm Appointment</button>
                </div>
              </form>
            )}

            {showVisitForm && selectedPat && (
              <form onSubmit={handleVisitSubmit} className="row g-2 mb-3 bg-light p-3 rounded">
                <h5>Add Visit for {selectedPat.full_name}</h5>
                <div className="col-md-5">
                  <label className="form-label">Visit Date</label>
                  <input type="datetime-local" className="form-control" value={visitForm.visit_date} onChange={e => setVisitForm({ ...visitForm, visit_date: e.target.value })} required />
                </div>
                <div className="col-md-7">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2" placeholder="Reason for visit, services provided, or notes" value={visitForm.description} onChange={e => setVisitForm({ ...visitForm, description: e.target.value })} required />
                </div>
                <div className="col-12 text-end mt-2">
                  <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => setShowVisitForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-success">Add Visit</button>
                </div>
              </form>
            )}

            {showHealthForm && selectedPat && (
              <form onSubmit={handleHealthSubmit} className="row g-2 mb-3 bg-light p-3 rounded">
                <h5>Add Health Tracking for {selectedPat.full_name}</h5>
                <div className="col-md-4"><label className="form-label">Measured On</label><input type="datetime-local" className="form-control" value={healthForm.measured_at} onChange={e => setHealthForm({ ...healthForm, measured_at: e.target.value })} required /></div>
                <div className="col-md-4"><label className="form-label">Heart Rate (bpm)</label><input type="number" min="0" className="form-control" value={healthForm.heart_rate} onChange={e => setHealthForm({ ...healthForm, heart_rate: e.target.value })} /></div>
                <div className="col-md-4"><label className="form-label">Blood Sugar (mg/dL)</label><input type="number" min="0" className="form-control" value={healthForm.blood_sugar} onChange={e => setHealthForm({ ...healthForm, blood_sugar: e.target.value })} /></div>
                <div className="col-md-6"><label className="form-label">Blood Pressure</label><input type="text" placeholder="e.g. 120/80" className="form-control" value={healthForm.blood_pressure} onChange={e => setHealthForm({ ...healthForm, blood_pressure: e.target.value })} /></div>
                <div className="col-md-6"><label className="form-label">BMI</label><input type="number" min="0" step="0.01" className="form-control" value={healthForm.bmi} onChange={e => setHealthForm({ ...healthForm, bmi: e.target.value })} /></div>
                <div className="col-12 text-end mt-2"><button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => setShowHealthForm(false)}>Cancel</button><button type="submit" className="btn btn-sm btn-success">Save Health Tracking</button></div>
              </form>
            )}

            <div className="mb-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search by patient name or mobile number"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center py-4">Loading directory...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-muted">No patients registered.</div>
            ) : (
              <>
              <div className="staff-patient-table">
                <table className="table align-middle" style={{ fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.full_name}</strong></td>
                        <td>{p.phone}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${actionPatient?.id === p.id ? 'btn-primary' : 'btn-outline-primary'}`}
                            type="button"
                            onClick={() => setActionPatient(actionPatient?.id === p.id ? null : p)}
                            aria-expanded={actionPatient?.id === p.id}
                          >
                            {actionPatient?.id === p.id ? 'Close actions' : 'Manage'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {actionPatient && (
                <section className="patient-action-panel" aria-label={`Actions for ${actionPatient.full_name}`}>
                  <div className="patient-action-panel__heading">
                    <div>
                      <span>Selected patient</span>
                      <strong>{actionPatient.full_name}</strong>
                      <small>{actionPatient.phone}</small>
                    </div>
                    <button className="icon-btn" type="button" aria-label="Close patient actions" onClick={() => setActionPatient(null)}><X size={18} /></button>
                  </div>
                  <div className="patient-action-panel__buttons">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => {
                      setSelectedPat(actionPatient);
                      setShowHealthForm(true);
                      setHealthForm({ heart_rate: '', blood_sugar: '', blood_pressure: '', bmi: '', measured_at: '' });
                      setActionPatient(null);
                    }}>Health tracking</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => {
                      setSelectedPat(actionPatient);
                      setPatForm({ full_name: actionPatient.full_name, email: actionPatient.email, phone: actionPatient.phone, password: '' });
                      setShowAddForm(true);
                      setActionPatient(null);
                    }}>Edit details</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => {
                      setSelectedPat(actionPatient);
                      setShowReportForm(true);
                      setActionPatient(null);
                    }}>Upload document</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => {
                      setSelectedPat(actionPatient);
                      setShowVisitForm(true);
                      setVisitForm({ visit_date: '', description: '' });
                      setActionPatient(null);
                    }}>Add visit</button>
                    <button className="btn btn-sm btn-primary" onClick={() => {
                      setSelectedPat(actionPatient);
                      setShowApptForm(true);
                      setActionPatient(null);
                    }}>Schedule appointment</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => {
                      setActionPatient(null);
                      handlePatientDelete(actionPatient);
                    }}>Delete patient</button>
                  </div>
                </section>
              )}
              </>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-5 mb-4">
          <Card>
            <h3 className="mb-3">Upcoming Visits</h3>
            {loading ? (
              <div className="text-center py-4">Loading visits...</div>
            ) : appointments.length === 0 ? (
              <div className="text-muted">No visits scheduled.</div>
            ) : (
              <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                {appointments.map(a => (
                  <div key={a.appointment_id} className="p-3 mb-2 border rounded" style={{ fontSize: '13px' }}>
                    <div className="d-flex justify-content-between mb-1">
                      <strong>Patient: {a.patient_name}</strong>
                      <span className={`badge ${a.status === 'scheduled' ? 'bg-primary' : a.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>
                        {a.status.toUpperCase()}
                      </span>
                    </div>
                    <div>Doctor: {a.doctor_name}</div>
                    <div className="text-muted mb-2">{new Date(a.appointment_date).toLocaleString()}</div>
                    {a.status === 'scheduled' && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-success py-0" style={{ fontSize: '11px' }} onClick={() => updateApptStatus(a.appointment_id, 'completed')}>Complete</button>
                        <button className="btn btn-sm btn-secondary py-0" style={{ fontSize: '11px' }} onClick={() => updateApptStatus(a.appointment_id, 'cancelled')}>Cancel</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card className="mt-4">
            <h3 className="mb-3">Recent Visit Notes</h3>
            {loading ? (
              <div className="text-center py-3">Loading visits...</div>
            ) : visits.length === 0 ? (
              <div className="text-muted">No visit notes recorded.</div>
            ) : (
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {visits.map((visit) => (
                  <div key={visit.visit_id} className="p-2 mb-2 border rounded" style={{ fontSize: '13px' }}>
                    <strong>{visit.patient_name}</strong>
                    <div className="text-muted">{new Date(visit.visit_date).toLocaleString()}</div>
                    <div>{visit.description}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

// ==========================================
// PATIENT PROFILE ENHANCEMENT
// ==========================================

function LegacyProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    apiRequest('/auth/me')
      .then((data) => {
        if (data.success) {
          setProfile(data.user);
        }
      })
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (profile?.role !== 'PATIENT') return;
    apiRequest('/patient/visits')
      .then((data) => setVisits(data.visits || []))
      .catch((err) => console.error('Error loading patient visits:', err));
  }, [profile?.role]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
        }),
      });
      setStatus({ type: 'success', message: 'Profile details updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  if (loading) {
    return (
      <PageShell title="Your Profile" bottomNavIndex={3}>
        <div className="center-message">Loading profile details...</div>
      </PageShell>
    );
  }

  const initial = profile.full_name?.trim().charAt(0).toUpperCase() || 'P';

  return (
    <PageShell title="Your Profile" bottomNavIndex={3}>
      {status.message && <StatusMessage type={status.type}>{status.message}</StatusMessage>}

      <Card className="profile-card mb-4">
        <span className="profile-avatar">{initial}</span>
        <div>
          <h2>{profile.full_name}</h2>
          <p>{profile.role?.replace('_', ' ')} • {profile.email}</p>
        </div>
      </Card>

      {profile.role === 'PATIENT' && (
        <Card className="mb-4">
          <h3 className="mb-3">Visit History</h3>
          {visits.length === 0 ? (
            <p className="text-muted mb-0">No visits have been recorded yet.</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {visits.map((visit) => (
                <div key={visit.visit_id} className="border rounded p-3">
                  <div className="d-flex justify-content-between gap-3 flex-wrap">
                    <strong>{new Date(visit.visit_date).toLocaleString()}</strong>
                    <span className="text-muted">Added by {visit.created_by_name}</span>
                  </div>
                  <p className="mb-0 mt-2">{visit.description}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card>
        <h3 className="mb-3">Edit Profile Details</h3>
        <form onSubmit={handleUpdate} className="row g-3">
          <div className="col-12">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Phone Contact</label>
            <input
              type="text"
              className="form-control"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              required
            />
          </div>
          <div className="col-12 text-end mt-3">
            <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 24px' }}>Save Changes</button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}

export default App;
