import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../features/auth/authSlice';

export const useAuthInit = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
};