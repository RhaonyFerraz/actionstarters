import { useState } from 'react';
import { useTurn } from '../hooks/useTurn';
import { BankModal } from '../components/modals/BankModal';
import { CommercialModal } from '../components/modals/CommercialModal';
import { ConsultoriaModal } from '../components/modals/ConsultoriaModal';
import { FinanceiroModal } from '../components/modals/FinanceiroModal';
import { QuizModal } from '../components/modals/QuizModal';
import { SurpriseModal } from '../components/modals/SurpriseModal';
import { EmailModal } from '../components/modals/EmailModal';
import { useToast } from '../hooks/useToast';
import { MenuBar } from '../components/layout/MenuBar';
import { SettingsModal } from '../components/modals/SettingsModal';
import { HintSystem } from '../components/ui/HintSystem';
import { useGameStore } from '../store/useGameStore';

import { DespesasModal } from '../components/modals/DespesasModal';

export const GameBoard = () => {
  const { addToast } = useToast();
  const { advanceTurn } = useTurn(addToast);

  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [isConsultoriaOpen, setIsConsultoriaOpen] = useState(false);
  const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false);
  const [isDespesasOpen, setIsDespesasOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);

  const handleAdvanceTurn = () => {
    // Se for o clique inicial (Rodada 1), forçar abertura do Quiz (Jornada)
    if (useGameStore.getState().currentRound === 1) {
      setIsQuizOpen(true);
    }
    advanceTurn();
  };

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-8 p-4 md:p-8 flex flex-col items-center">
      
      {/* Nova Barra de Menu Neon */}
      <MenuBar 
        onOpenBank={() => setIsBankOpen(true)}
        onOpenCommercial={() => setIsCommercialOpen(true)}
        onOpenConsultoria={() => setIsConsultoriaOpen(true)}
        onOpenFinanceiro={() => setIsFinanceiroOpen(true)}
        onOpenDespesas={() => setIsDespesasOpen(true)}
        onOpenEmail={() => setIsEmailOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAdvanceTurn={handleAdvanceTurn}
      />


      <div className="flex-1" />

      {/* Modais */}
      <BankModal isOpen={isBankOpen} onClose={() => setIsBankOpen(false)} />
      <CommercialModal isOpen={isCommercialOpen} onClose={() => setIsCommercialOpen(false)} />
      <ConsultoriaModal isOpen={isConsultoriaOpen} onClose={() => setIsConsultoriaOpen(false)} />
      <FinanceiroModal isOpen={isFinanceiroOpen} onClose={() => setIsFinanceiroOpen(false)} />
      <DespesasModal isOpen={isDespesasOpen} onClose={() => setIsDespesasOpen(false)} />
      <QuizModal isOpen={isQuizOpen} onClose={() => {
        setIsQuizOpen(false);
        // Disparar surpresa obrigatória 1s após fechar o quiz da Q1
        setTimeout(() => setIsSurpriseOpen(true), 1000);
      }} />
      <SurpriseModal isOpen={isSurpriseOpen} onDone={() => setIsSurpriseOpen(false)} />
      <EmailModal isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Sistema Flutuante de Dicas */}
      <HintSystem />
    </div>
  );
};
