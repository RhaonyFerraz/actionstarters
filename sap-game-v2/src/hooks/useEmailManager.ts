import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

/**
 * Motor de Eventos In-Game baseados em E-mail corporativo.
 * Injeta acontecimentos narrativos e desafios na Inbox baseados em qual Rodada o player está.
 */
export const useEmailManager = () => {
  const currentRound = useGameStore(state => state.currentRound);
  const addEmail = useGameStore(state => state.addEmail);
  const inbox = useGameStore(state => state.inbox);
  
  // Computa seletivamente emails não-lidos
  const unreadCount = inbox.filter(e => !e.read).length;

  useEffect(() => {
    // Impede duplicação em re-renders do React
    const hasReceived = (subject: string) => inbox.some(e => e.subject === subject);

    if (currentRound === 2 && !hasReceived('Liberação do Mercado Global')) {
      addEmail({
        subject: 'Liberação do Mercado Global',
        sender: 'matriz@sap-board.com',
        content: 'CEO,\n\nO mercado internacional acaba de se aquecer.\nAproveite o momento para investir na Infraestrutura e aumentar pesadamente o lucro sobre seus produtos.\n\nAbraços.',
        timestampRound: currentRound
      });
    }

    if (currentRound === 4 && !hasReceived('⚠️ Greve Logística Detectada')) {
      addEmail({
        subject: '⚠️ Greve Logística Detectada',
        sender: 'sindicato@transportes.org',
        content: 'Informamos a paralização dos meios de transporte no país.\n\nNos próximos turnos, não adiantará investir no PCP ou Logística, mantenha seu caixa protegido até a normalização.',
        timestampRound: currentRound
      });
    }
    
    // Novas cartas (emails) podem ser programadas livremente aqui baseadas na Rodada.

  }, [currentRound, addEmail, inbox]);

  return { unreadCount };
};
