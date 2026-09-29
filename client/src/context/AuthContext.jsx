import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe as apiGetMe } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('travelwise_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('travelwise_token');
      const storedUser = localStorage.getItem('travelwise_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend silently
          const res = await apiGetMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('travelwise_user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.warn('Silent token verification failed:', error.message);
          // Only remove if 401
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.success && res.data) {
      const { token: newToken, ...userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('travelwise_token', newToken);
      localStorage.setItem('travelwise_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (formData) => {
    const res = await apiRegister(formData);
    if (res.success && res.data) {
      const { token: newToken, ...userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('travelwise_token', newToken);
      localStorage.setItem('travelwise_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('travelwise_token');
    localStorage.removeItem('travelwise_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
