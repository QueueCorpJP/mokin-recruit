'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// UserTypeを直接定義（AuthControllerで実際に設定される値に合わせる）
export type UserType = 'candidate' | 'company_user' | 'admin';

interface AuthContextType {
  userType: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userType: null,
  isLoading: true,
  isAuthenticated: false,
  refreshAuth: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface SessionResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    userType: UserType;
    name?: string;
    emailConfirmed: boolean;
    lastSignIn?: string;
  };
  session?: {
    expiresAt: string;
    needsRefresh: boolean;
  };
  error?: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserSession = async () => {
    try {
      // httpOnly Cookieのため、セッションAPIを直接呼び出し
      // セッション情報を取得（CookieはブラウザがAuthorizationヘッダーなしで自動送信）
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Cookieを含めて送信
      });

      if (response.ok) {
        const data: SessionResponse = await response.json();
        
        if (data.success && data.user) {
          setUserType(data.user.userType);
          setIsAuthenticated(true);
        } else {
          setUserType(null);
          setIsAuthenticated(false);
        }
      } else {
        setUserType(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch user session:', error);
      setUserType(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    setIsLoading(true);
    await fetchUserSession();
  };

  useEffect(() => {
    fetchUserSession();
  }, []);

  return (
    <AuthContext.Provider value={{ userType, isLoading, isAuthenticated, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}; 