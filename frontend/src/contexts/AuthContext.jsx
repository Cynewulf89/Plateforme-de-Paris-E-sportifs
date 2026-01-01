import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import io from 'socket.io-client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  }, [user]);

  // Initialize Socket.io connection
  useEffect(() => {
    const socketConnection = io('http://localhost:5000');
    setSocket(socketConnection);

    // Listen for balance updates
    socketConnection.on('balanceUpdated', (data) => {
      if (user && user.id == data.userId) {
        console.log('Balance updated via socket:', data);
        setUser(prevUser => ({ ...prevUser, balance: data.balance }));
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      const userData = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const updateBalance = async (newBalance) => {
    try {
      await apiRequest(`/users/${user.id}/balance`, {
        method: 'PUT',
        body: JSON.stringify({ balance: newBalance }),
      });
      setUser({ ...user, balance: newBalance });
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const updateMode = async (newMode) => {
    try {
      const updatedUser = await apiRequest(`/users/${user.id}/mode`, {
        method: 'PUT',
        body: JSON.stringify({ mode: newMode }),
      });
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating mode:', error);
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const userData = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateBalance,
      updateMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};