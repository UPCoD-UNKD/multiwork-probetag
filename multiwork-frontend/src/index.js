import React from 'react'
import ReactDOM from 'react-dom/client'
import 'typeface-poppins'
import App from './App'
import reportWebVitals, { reportWebVitalsEnhanced } from './reportWebVitals'
import { AuthProvider } from './auth/AuthContext';
import { initSentry } from './config/sentry';

// Initialize Sentry before rendering app
initSentry();

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
// Use enhanced Web Vitals reporting in production
if (process.env.NODE_ENV === 'production') {
  reportWebVitals(reportWebVitalsEnhanced);
} else {
  reportWebVitals();
}
