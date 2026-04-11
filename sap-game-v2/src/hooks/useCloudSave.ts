import { useEffect, useRef } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useGameStore } from '../store/useGameStore';
import { useAuth } from './useAuth';

/**
 * Motor Assíncrono de Persistência na Nuvem (Auto-Save)
 * Conecta o Zustand (Frontend) com o Firestore (Backend)
 * @attention Ignora persistência se o usuário estiver no "Modo Demo".
 */
export const useCloudSave = () => {
  const { user, isDemoMode } = useAuth();
  const state = useGameStore();
  const isInitialLoad = useRef(true);

  // 1. HIDRATAÇÃO: Baixa os dados do servidor quando o jogador loga
  useEffect(() => {
    if (!user || isDemoMode) return;

    const loadCloudSave = async () => {
      try {
        const docRef = doc(db, 'player_saves', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Injeta diretamente no Zustand (Override state local)
          useGameStore.setState({
            balance: data.balance ?? 50000,
            currentRound: data.currentRound ?? 1,
            inventory: data.inventory ?? { skus: 0, machinery: 0, bonusPoints: 0 },
            modulesLevels: data.modulesLevels ?? { financial: 1, marketing: 1, hr: 1, pcp: 1, logistics: 1 },
            debts: data.debts ?? []
          });
          console.log('✅ Nuvem: Save restaurado com sucesso.');
        } else {
          console.log('🆕 Nuvem: Novo perfil de CEO criado.');
        }
      } catch (e) {
        console.error('Erro ao ler Cloud Save', e);
      } finally {
        isInitialLoad.current = false; // Libera flag de carregamento
      }
    };

    loadCloudSave();
  }, [user, isDemoMode]);

  // 2. AUTO-SAVE: Envia os dados pro servidor quando algo muda
  useEffect(() => {
    if (!user || isDemoMode || isInitialLoad.current) return;

    // Implementa Debouncing: Espera o usuário parar de clicar por 2.5s antes de bombardear o Firestore
    const autoSaveTimer = setTimeout(async () => {
      try {
        const docRef = doc(db, 'player_saves', user.uid);
        await setDoc(docRef, {
          email: user.email,
          balance: state.balance,
          currentRound: state.currentRound,
          inventory: state.inventory,
          modulesLevels: state.modulesLevels,
          debts: state.debts,
          lastSavedAt: new Date().toISOString()
        }, { merge: true });
        
        console.log('☁️ Auto-Save realizado com sucesso.');
      } catch (e) {
        console.error('Falha no Auto-Save', e);
      }
    }, 2500);

    return () => clearTimeout(autoSaveTimer);
  }, [user, isDemoMode, state.balance, state.currentRound, state.inventory, state.debts, state.modulesLevels]);

};
