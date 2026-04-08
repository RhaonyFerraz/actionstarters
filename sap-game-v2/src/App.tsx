import { Routes, Route, Navigate } from 'react-router-dom';
import { GameBoard } from './pages/GameBoard';
import { Login } from './pages/Login';
import { AdminPanel } from './pages/AdminPanel';
import { ToastProvider } from './context/ToastContext';
import { BackgroundCarousel } from './components/layout/BackgroundCarousel';
import { useGameStore } from './store/useGameStore';
import { useCloudSave } from './hooks/useCloudSave';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * MODO DE PRODUÇÃO SAP ATIVO 🛠️
 */
const App = () => {
  const { theme } = useGameStore();
  const { user, loading } = useAuth();

  // Ativa o motor de sincronização na nuvem
  useCloudSave();

  if (loading) {
    return (
      <div className="min-h-screen bg-sap-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-sap-blue" size={48} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen theme-${theme}`}>
      <BackgroundCarousel />
      <ToastProvider>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <GameBoard /> : <Navigate to="/login" />} 
          />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </ToastProvider>
    </div>
  );
};

export default App;
