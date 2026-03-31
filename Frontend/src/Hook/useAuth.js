import { useState, useEffect } from 'react';
import authService from '../Services/AuthService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    
    if (result.ok) {
      setUser(result.usuario);
      setIsAuthenticated(true);
    }
    
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };
};

export default useAuth;