import { useGameStore } from '../store/useGameStore';

const ROUNDS_PER_MONTH = 4;
const BASE_OPEX = 5000;

/**
 * Hook central de transição temporal.
 * Aceita um callback `onNotify` para disparar Toasts visuais ao invés de alert() nativo.
 */
export const useTurn = (onNotify?: (type: 'success' | 'warning' | 'error', title: string, msg: string) => void) => {
  const advanceRoundStore = useGameStore((state) => state.advanceRound);
  const removeBalance = useGameStore((state) => state.removeBalance);
  const currentRound = useGameStore((state) => state.currentRound);
  const modulesLevels = useGameStore((state) => state.modulesLevels);

  const advanceTurn = () => {
    const isEndOfMonth = (currentRound % ROUNDS_PER_MONTH) === 0;

    if (isEndOfMonth) {
      const totalLevels = Object.values(modulesLevels).reduce((sum, level) => sum + level, 0);
      const totalOpex = BASE_OPEX + (totalLevels * 1200);
      
      removeBalance(totalOpex);
      
      // Usa Toast visual se disponível, fallback para console.log
      onNotify?.(
        'warning',
        `📉 Fechamento do Mês ${Math.floor(currentRound / ROUNDS_PER_MONTH)}`,
        `Despesas Operacionais debitadas: R$ ${totalOpex.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      );
    } else {
      onNotify?.(
        'success',
        'Expediente Encerrado',
        `Rodada ${currentRound + 1} iniciada. Continue gerenciando seus departamentos.`
      );
    }

    advanceRoundStore();
  };

  return {
    advanceTurn,
    currentRound,
    isNextRoundPayday: (currentRound % ROUNDS_PER_MONTH) === (ROUNDS_PER_MONTH - 1)
  };
};
