import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const SITE_KEY = process.env.REACT_APP_GOOGLE_SITE_KEY;
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
    <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
      <App />
      </GoogleReCaptchaProvider>
    </AuthProvider>
  </React.StrictMode>
);
