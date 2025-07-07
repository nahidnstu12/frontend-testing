import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import './App.css';

import { ProtectedRouteContext } from './components/auth/protected-route-context';
import { PublicRouteContext } from './components/auth/public-route-context';
import { AuthProvider } from './store/authContext';

const Home = lazy(() => import('./pages/frontend/home'));
const Login = lazy(() => import('./pages/auth/login'));
const Dashboard = lazy(() => import('./pages/app/dashboard'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  
  {
    path: '/login',
    element: (
      <PublicRouteContext>
        <Suspense fallback={<LoadingSpinner />}>
          <Login />
        </Suspense>
      </PublicRouteContext>
    ),
  },
  
  {
    path: '/dashboard',
    element: (
      <ProtectedRouteContext>
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      </ProtectedRouteContext>
    ),
  },
  
]);

function App() {
  // usePersistAuth();
  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
