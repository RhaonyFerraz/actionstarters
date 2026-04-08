import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, githubProvider } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<any>;
  loginWithGitHub: () => Promise<any>;
  loginAsDemo: () => void;
  register: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('sap_demo_mode') === 'active');

  useEffect(() => {
    // Se já estiver em demo mode (ex: refresh da página), restaura imediatamente
    if (isDemoMode) {
      setUser({ uid: 'demo-ceo', email: 'demo@sap-game.com', displayName: 'CEO Demo' } as User);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const login = (email: string, pass: string) =>
    signInWithEmailAndPassword(auth, email, pass);

  const loginWithGitHub = () =>
    signInWithPopup(auth, githubProvider);

  const loginAsDemo = () => {
    localStorage.setItem('sap_demo_mode', 'active');
    const demoUser = { uid: 'demo-ceo', email: 'demo@sap-game.com', displayName: 'CEO Demo' } as User;
    setUser(demoUser);
    setIsDemoMode(true);
    setLoading(false);
  };

  const register = (email: string, pass: string) =>
    createUserWithEmailAndPassword(auth, email, pass);

  const logout = () => {
    localStorage.removeItem('sap_demo_mode');
    setIsDemoMode(false);
    setUser(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode, login, loginWithGitHub, loginAsDemo, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
