import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { loginAPI } from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginAPI({ email, password });
      
      // Update data ke Redux Store
      dispatch(setCredentials({ 
        user: response.data.user, 
        token: response.data.token 
      }));
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};