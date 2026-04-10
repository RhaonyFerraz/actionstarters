import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useBank } from '../../hooks/useBank';
import { cn } from '../ui/Button';

export const BankModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { balance, debts } = useBank();
  const [activeTab, setActiveTab] = useState('Resumo');
  const [debitoAutomatico, setDebitoAutomatico] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2 
    }).format(val);
  };

  const totalDebts = debts.reduce((acc, debt) => acc + (debt.installmentValue * debt.remainingInstallments), 0);

  const tabs = ['PIX', 'Resumo', 'Empréstimos', 'Investimentos', 'Consórcio'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title=" " centerTitle className="max-w-4xl">
      <div className="flex flex-col items-center">
        
        {/* Title */}
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Banco Corporativo SAP</h2>

        {/* Tabs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full px-4 sm:px-10 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-3 px-1 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border",
                activeTab === tab 
                  ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                  : "bg-[#1a1a1a] text-gray-500 border-white/5 hover:border-white/10"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4 sm:px-10 mb-8">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 min-h-[140px]">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Saldo Total</p>
            <h4 className="text-xl font-digital font-bold text-[#facc15] tracking-tighter">
              {formatCurrency(balance)}
            </h4>
          </div>

          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 min-h-[140px]">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Dívidas Ativas</p>
            <h4 className="text-xl font-digital font-bold text-[#facc15] tracking-tighter">
              {formatCurrency(totalDebts)}
            </h4>
          </div>

          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 min-h-[140px]">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rendimento Previsto</p>
            <h4 className="text-xl font-digital font-bold text-[#facc15] tracking-tighter">
              {formatCurrency(0)}
            </h4>
          </div>
        </div>

        {/* Automatic Debit Section */}
        <div className="w-full px-4 sm:px-10 mb-10">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent opacity-30" />
            
            <div className="flex flex-col items-center sm:items-start">
              <h5 className="text-sm font-black text-white uppercase tracking-widest mb-1">Débito Automático</h5>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                <span className="text-[#facc15]">ADICUE + 10%</span> de limite de Crédito se ativado.
              </p>
            </div>

            <button 
              onClick={() => setDebitoAutomatico(!debitoAutomatico)}
              className={cn(
                "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border",
                debitoAutomatico 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : "bg-white/5 text-gray-400 border-white/10"
              )}
            >
              {debitoAutomatico ? "ATIVADO ✓" : "DESATIVADO X"}
            </button>
          </div>
        </div>

        {/* Active Items Section */}
        <div className="w-full px-4 sm:px-10 mb-12">
           <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Itens Ativos</h5>
           <div className="py-10 text-center bg-black/20 rounded-[2rem] border border-dashed border-white/5">
             <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Nenhum item ativo no momento.</p>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="w-full px-4 sm:px-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto min-w-[200px] py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:brightness-110 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
            EXTRATO
          </button>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto min-w-[200px] py-4 bg-[#1a1a1a] hover:bg-[#252525] text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all border border-white/5 active:scale-95"
          >
            Fechar
          </button>
        </div>

      </div>
    </Modal>
  );
};
