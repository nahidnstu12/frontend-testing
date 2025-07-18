import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppLayout from './app-layout';

// Custom error fallback for the app layout
const AppErrorFallback = ({ error, resetError }: any) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-800">
            Application Error
          </h3>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Something went wrong while loading the application. This error has been logged and our team has been notified.
        </p>
        <details className="mt-2">
          <summary className="text-sm text-gray-500 cursor-pointer">Technical Details</summary>
          <p className="mt-1 text-xs text-gray-400 font-mono break-all">
            {error.message}
          </p>
        </details>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={resetError}
          className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

// Log errors to monitoring service
const logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
  // In production, you'd send this to your monitoring service
  console.error('Application Error:', {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  });
  
  // Example: Send to monitoring service
  // trackError(error, errorInfo);
};

// Enhanced App Layout with Error Boundary
const AppLayoutWithErrorBoundary = ({ children, ...props }: any) => {
  return (
    <ErrorBoundary 
      fallback={AppErrorFallback}
      onError={logErrorToService}
    >
      <AppLayout {...props}>
        {children}
      </AppLayout>
    </ErrorBoundary>
  );
};

export default AppLayoutWithErrorBoundary; 