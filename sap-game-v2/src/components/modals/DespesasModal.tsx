import React from 'react';
import { Modal } from '../ui/Modal';
import { AlertCircle } from 'lucide-react';
import { cn } from '../ui/Button';

interface DespesasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DespesasModal: React.FC<DespesasModalProps> = ({ isOpen, onClose }) => {
  // Dados baseados na referência visual
  // Futuramente estes valores podem vir do useGameStore
  const expenses = {
    colaboradores: 200,
    contabilidade: 100,
    energia: 80,
    agua: 10,
    internet: 50,
    economia: 0,
    multa: 0
  };

  const total = expenses.colaboradores + 
                expenses.contabilidade + 
                expenses.energia + 
                expenses.agua + 
                expenses.internet - 
                expenses.economia + 
                expenses.multa;

  const Card = ({ title, value, color = 'white', subValue, className, prefix = '$' }: any) => (
    <div className={cn(
      "bg-[#0d0d0d]/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center space-y-2 min-h-[140px] transition-all hover:border-white/10",
      className
    )}>
      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center mb-1">{title}</h4>
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black text-gray-500 mb-1">{prefix}</span>
        <span className={cn("text-2xl font-digital font-bold tracking-tighter", color === 'red' ? 'text-red-500' : 'text-white')}>
          {value.toLocaleString('pt-BR')}
        </span>
        {subValue && (
          <span className="text-[9px] font-black text-green-500 mt-1 uppercase tracking-widest">{subValue}</span>
        )}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title=" " centerTitle className="max-w-4xl">
      <div className="flex flex-col items-center py-6">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Controle de Despesas</h2>
          <p className="text-gray-500 text-sm font-medium tracking-wide">Gestão de custos fixos e variáveis da operação.</p>
          <div className="pt-4 flex items-center justify-center gap-2 text-red-500 animate-pulse bg-red-500/5 px-6 py-2 rounded-full border border-red-500/10">
             <AlertCircle size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">PAGAMENTO PENDENTE (QUESTÃO 5+)</span>
          </div>
        </div>

        {/* Expenses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4 sm:px-10">
          <Card title="Colaboradores" value={expenses.colaboradores} />
          <Card title="Contabilidade" value={expenses.contabilidade} />
          <Card title="Energia" value={expenses.energia} subValue="(+ $ 10 infra)" />
          
          <Card title="Água" value={expenses.agua} />
          <Card title="Internet" value={expenses.internet} />
          
          <Card 
            title="Economia (infra 0%)" 
            value={expenses.economia} 
            className="border-green-500/20 bg-green-500/5"
            color="white"
            prefix="- $"
          />

          <Card 
            title="Multa Acumulada (+ $10/rodada)" 
            value={expenses.multa} 
            className="border-red-500/10 bg-red-500/5 lg:col-start-1"
          />

          <Card 
            title="Total das Despesas" 
            value={total} 
            color="red"
            className="lg:col-span-2 border-white/10"
          />
        </div>

        {/* Actions */}
        <div className="mt-12 w-full flex justify-center px-10">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto min-w-[240px] py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black uppercase tracking-[0.4em] text-[13px] rounded-full transition-all active:scale-95 shadow-[0_15px_35px_rgba(59,130,246,0.3)]"
          >
            FECHAR
          </button>
        </div>

      </div>
    </Modal>
  );
};
