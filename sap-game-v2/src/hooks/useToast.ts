import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Hook para acessar o sistema de notificações Toast global.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }

  return context;
};
