import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the user state even if the API call fails
      setUser(null);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/status');
      console.log('Auth status response:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth status check error:', error.response?.data || error.message);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 