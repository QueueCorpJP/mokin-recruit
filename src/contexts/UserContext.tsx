'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'candidate' | 'company' | 'admin';
  profile?: any;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false
});

interface UserProviderProps {
  children: ReactNode;
  user: User | null;
}

export function UserProvider({ children, user }: UserProviderProps) {
  const value: UserContextType = {
    user,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function useRequireAuth() {
  const { user, isAuthenticated } = useUser();
  if (!isAuthenticated || !user) {
    throw new Error('Authentication required');
  }
  return user;
}