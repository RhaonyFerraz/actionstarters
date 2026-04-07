import { useEffect, useState } from 'react';
import { auth, githubProvider } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';

/**
 * Hook Central de Autenticação.
 * Expõe session tracking robusto para a UI.
 * Inclui "Modo Demo" para bypass de erros de configuração no Firebase.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('sap_demo_mode') === 'active');

  useEffect(() => {
    // Observer contínuo do Firebase.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isDemoMode) {
        setUser(currentUser);
      }
      setLoading(false);
    });
    
    // Se estiver em modo demo, fura o carregamento
    if (isDemoMode) {
      setUser({ uid: 'demo-ceo', email: 'demo@sap-game.com', displayName: 'CEO Demo' } as User);
      setLoading(false);
    }

    return () => unsubscribe();
  }, [isDemoMode]);

  const login = (email: string, pass: string) => 
    signInWithEmailAndPassword(auth, email, pass);

  const loginWithGitHub = () => 
    signInWithPopup(auth, githubProvider);

  const loginAsDemo = () => {
    localStorage.setItem('sap_demo_mode', 'active');
    setIsDemoMode(true);
    setUser({ uid: 'demo-ceo', email: 'demo@sap-game.com', displayName: 'CEO Demo' } as User);
  };

  const register = (email: string, pass: string) => 
    createUserWithEmailAndPassword(auth, email, pass);

  const logout = () => {
    localStorage.removeItem('sap_demo_mode');
    setIsDemoMode(false);
    return signOut(auth);
  };

  return { user, loading, isDemoMode, login, loginWithGitHub, loginAsDemo, register, logout };
};
