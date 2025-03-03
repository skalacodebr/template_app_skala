import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "../hooks/use-toast";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Ensure Firebase is initialized before using Firebase Auth
if (!getApps().length) {
  initializeApp({
    apiKey: "AIzaSyCedcoY5ZiHE4ie5LY2XGgtGmgeDH6fw-c",
    authDomain: "donamaria-dcde3.firebaseapp.com",
    projectId: "donamaria-dcde3",
    storageBucket: "donamaria-dcde3.firebasestorage.app",
    messagingSenderId: "907263945006",
    appId: "1:907263945006:web:b7355360b4879081f3b2bf"
  });
}

// Define user roles
export type UserRole = 'admin' | 'user' | 'partner';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3',
  },
  {
    id: '3',
    name: 'Partner User',
    email: 'partner@example.com',
    role: 'partner',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3',
  },
];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const foundUser: User = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        role: 'user', // You might want to fetch the role from Firestore or another source
      };
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'user') => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      const newUser: User = {
        id: user.uid,
        name,
        email,
        role,
      };
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), { name, email, role, planId: null });
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('auth_user');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        login, 
        register, 
        resetPassword,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
