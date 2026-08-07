import React from 'react';
import { Heart } from 'lucide-react';

export function AppLogo({ size = 90 }) {
  return <div className="app-logo"><Heart size={size} fill="currentColor" strokeWidth={1.8} /><h2>Smart Health</h2></div>;
}

export function PrimaryButton({ children, icon: Icon, onClick, type = 'button', disabled = false }) {
  return <button className="primary-btn" type={type} onClick={onClick} disabled={disabled}>{Icon ? <Icon size={20} /> : null}<span>{children}</span></button>;
}

export function Card({ children, className = '', onClick }) {
  const Component = onClick ? 'button' : 'div';
  return <Component type={onClick ? 'button' : undefined} onClick={onClick} className={`custom-card ${className}`}>{children}</Component>;
}

export function Field({ label, hint, icon: Icon, type = 'text', rows, value, onChange, name, required = false }) {
  return <label className="field"><span>{label}</span><div className={`field-control ${rows ? 'align-items-start' : ''}`}><Icon className={rows ? 'mt-2' : ''} size={22} />{rows ? <textarea rows={rows} placeholder={hint} value={value} onChange={onChange} name={name} required={required} /> : <input type={type} placeholder={hint} value={value} onChange={onChange} name={name} required={required} />}</div></label>;
}

export function StatusMessage({ type, children }) {
  return <div className={`status-message ${type === 'error' ? 'error' : 'success'}`}>{children}</div>;
}
