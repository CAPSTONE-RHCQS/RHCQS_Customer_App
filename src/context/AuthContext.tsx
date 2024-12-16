import {API_ROOT} from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axios';
import React, {createContext, useState, useEffect} from 'react';
import {isTokenValid, decodeToken} from '../utils/jwt';

interface AuthContextType {
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  userToken: string | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          console.log(token);
          setUserToken(token);
          decodeToken(token);
        }
      } catch (error) {
        console.error('Failed to load token from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`${API_ROOT}/login`, {
        email,
        password,
      });
      const {Token} = response.data;
      const decodedToken = decodeToken(Token);

      if (
        decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] !== 'Customer'
      ) {
        throw new Error('Không thể đăng nhập');
      }

      setUserToken(Token);
      await AsyncStorage.setItem('accessToken', Token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.Error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setUserToken(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{login, logout, userToken, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
