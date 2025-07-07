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


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  
  {
    path: '/login',
    element: (
      <PublicRouteContext>
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      </PublicRouteContext>
    ),
  },
  
  {
    path: '/dashboard',
    element: (
      <ProtectedRouteContext>
        <Suspense fallback={<div>Loading...</div>}>
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
