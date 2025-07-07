import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setCredentials } from '@/store/features/auth/authSlice';

export function usePersistAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch(setCredentials({ 
        token, 
        user: JSON.parse(user) 
      }));
    }
  }, [dispatch]);
} 