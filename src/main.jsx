import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App.jsx';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Smart Health render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-fallback">
          <HeartFallback />
          <h1>Smart Health</h1>
          <p>The app could not render. Please refresh the page or restart the dev server.</p>
        </main>
      );
    }

    return this.props.children;
  }
}

function HeartFallback() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21s-6.7-4.2-9.5-8.6C.4 9.1 2.4 5 6.2 5c2 0 3.4 1 4.3 2.2C11.4 6 12.8 5 14.8 5c3.8 0 5.8 4.1 3.7 7.4C15.7 16.8 12 21 12 21z"
      />
    </svg>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
);
