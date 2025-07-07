import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import './App.css';
import { ProtectedRoute } from './components/auth/protected-route';
import { PublicRoute } from './components/auth/public-route';
import { usePersistAuth } from './hooks/use-persist-auth';

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
      <PublicRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      </PublicRoute>
    ),
  },
  
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  
]);

function App() {
  usePersistAuth();
  
  return (
    <RouterProvider router={router} />
  );
}

export default App;
