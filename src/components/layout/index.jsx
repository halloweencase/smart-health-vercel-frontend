import React, { useEffect, useState } from 'react';
import { Heart, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getNavigationItems, routes } from '../../constants/routes';
import { clearSession, getStoredToken, getStoredUser } from '../../services/api';

export function ProtectedRoute({ children }) {
  const navigate = useNavigate(); const [token, setToken] = useState(getStoredToken());
  useEffect(() => { const syncAuth = () => setToken(getStoredToken()); window.addEventListener('smart-health-auth', syncAuth); window.addEventListener('storage', syncAuth); return () => { window.removeEventListener('smart-health-auth', syncAuth); window.removeEventListener('storage', syncAuth); }; }, []);
  useEffect(() => { if (!token) navigate(routes.login, { replace: true }); }, [navigate, token]);
  return token ? children : null;
}

export function useStoredUser() {
  const [user, setUser] = useState(getStoredUser());
  useEffect(() => { const syncUser = () => setUser(getStoredUser()); window.addEventListener('smart-health-auth', syncUser); window.addEventListener('storage', syncUser); return () => { window.removeEventListener('smart-health-auth', syncUser); window.removeEventListener('storage', syncUser); }; }, []);
  return user;
}

export function PageShell({ title, actions, children, bottomNavIndex = null, appNav = true }) {
  const [drawerOpen, setDrawerOpen] = useState(false); const user = useStoredUser(); const finalBottomNavIndex = user?.role === 'PATIENT' ? bottomNavIndex : null;
  return <div className={`app-screen ${appNav ? 'has-desktop-nav' : 'plain-shell'}`}>{appNav ? <DesktopSidebar /> : null}<div className="page-workspace"><header className="app-bar"><div className="bar-side">{appNav ? <button className="icon-btn" type="button" aria-label="Open menu" onClick={() => setDrawerOpen(true)}><Menu size={22} /></button> : null}</div><div className="title-block"><h1>{title}</h1>{appNav ? <p>Smart Health Record Management System</p> : null}</div><div className="bar-side justify-content-end">{actions}</div></header>{appNav ? <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} /> : null}<main className={finalBottomNavIndex === null ? 'content' : 'content with-bottom-nav'}>{children}</main>{finalBottomNavIndex !== null ? <BottomNav currentIndex={finalBottomNavIndex} /> : null}</div></div>;
}

function DesktopSidebar() {
  const navigate = useNavigate(); const user = useStoredUser(); const navItemsList = getNavigationItems(user?.role);
  const logout = () => { clearSession(); navigate(routes.login, { replace: true }); };
  return <aside className="desktop-sidebar"><Link to={routes.dashboard} className="desktop-brand"><span className="brand-avatar"><Heart size={22} fill="currentColor" /></span><div><h2>Smart Health</h2><p>{user?.role?.replace('_', ' ') || 'Workspace'}</p></div></Link><nav className="desktop-nav">{navItemsList.map((item) => <NavLink key={item.path} to={item.path} className="desktop-nav-link"><item.icon size={20} /><span>{item.label}</span></NavLink>)}</nav><div className="sidebar-status"><ShieldCheck size={20} /><div><strong>Secure records</strong><span>Private patient access</span></div></div><button className="logout-link" type="button" onClick={logout}><LogOut size={20} /><span>Logout</span></button></aside>;
}

function AppDrawer({ open, onClose }) {
  const navigate = useNavigate(); const user = useStoredUser(); const navItemsList = getNavigationItems(user?.role);
  const logout = () => { clearSession(); onClose(); navigate(routes.login, { replace: true }); };
  return <><div className={`drawer-scrim ${open ? 'show' : ''}`} onClick={onClose} /><aside className={`app-drawer ${open ? 'open' : ''}`} aria-hidden={!open}><div className="drawer-header"><span className="brand-avatar"><Heart size={22} fill="currentColor" /></span><div><h2>Smart Health</h2><p>{user?.role?.replace('_', ' ') || 'Workspace'}</p></div><button className="icon-btn ms-auto" type="button" aria-label="Close menu" onClick={onClose}><X size={20} /></button></div><div className="drawer-divider" /><nav className="drawer-links">{navItemsList.map((item) => <NavLink key={item.path} to={item.path} onClick={onClose} className="drawer-link"><item.icon size={22} /><span>{item.label}</span></NavLink>)}<button className="drawer-link drawer-logout" type="button" onClick={logout}><LogOut size={22} /><span>Logout</span></button></nav></aside></>;
}

function BottomNav({ currentIndex }) { const user = useStoredUser(); return <nav className="bottom-nav">{getNavigationItems(user?.role).map((item, index) => <NavLink key={item.path} to={item.path} className={`bottom-nav-item ${index === currentIndex ? 'active' : ''}`}><item.icon size={22} /><span>{item.label}</span></NavLink>)}</nav>; }
