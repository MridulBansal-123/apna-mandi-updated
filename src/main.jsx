import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log('🔧 Environment Check:');
console.log('- VITE_GOOGLE_CLIENT_ID present:', GOOGLE_CLIENT_ID ? '✅ YES' : '❌ NO');
console.log('- Environment mode:', import.meta.env.PROD ? 'Production' : 'Development');
console.log('- All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

if (!GOOGLE_CLIENT_ID) {
  console.error('❌ CRITICAL: VITE_GOOGLE_CLIENT_ID is missing!');
  console.error('📋 Solution: Add VITE_GOOGLE_CLIENT_ID to Vercel environment variables');
}

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-red-50">
          <h1 className="text-xl font-bold text-red-600 mb-4">Something went wrong.</h1>
          <details className="bg-white p-4 rounded border max-w-md">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
