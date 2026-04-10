import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useBank } from '../../hooks/useBank';
import { useToast } from '../../hooks/useToast';

export const BankModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { balance, debts, takeLoan, payInstallment, marketParams } = useBank();
  const { addToast } = useToast();
  
  // Estados Locais apenas pra controle do formulário do Modal
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [installments, setInstallments] = useState<number>(5);

  const handleTakeLoan = () => {
    const success = takeLoan(loanAmount, installments);
    if (!success) {
      addToast('error', 'Empréstimo Negado', 'O valor solicitado excede o limite estipulado pelo Banco Central.');
    } else {
      addToast('success', 'Crédito Aprovado', `Foram creditados ${formatBRL(loanAmount)} na sua conta.`);
      setLoanAmount(10000);
    }
  };

  // Formatação de Moeda
  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Banco Corporativo SAP">
      <div className="space-y-6">
        
        {/* Status de Caixa */}
        <div className="bg-black/40 border border-neon-cyan/20 rounded-xl p-6 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-16 h-16 bg-neon-cyan/5 -mr-8 -mt-8 rounded-full blur-2xl" />
          <p className="text-[10px] text-neon-cyan/40 uppercase tracking-[0.2em] font-mono-neon font-bold mb-2">Liquidez Imediata em Conta</p>
          <h3 className="text-4xl font-digital font-bold text-white tracking-tight neon-text-cyan">{formatBRL(balance)}</h3>
        </div>

        {/* Formulário de Empréstimo */}
        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
          <h4 className="font-digital text-sm text-white border-b border-white/5 pb-3 mb-5 tracking-widest uppercase opacity-80 flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            Nova Linha de Crédito
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Valor Solicitado (MÁX: {formatBRL(marketParams.maxLoan)})</label>
              <input 
                type="number" 
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 outline-none font-digital text-xl text-white transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Plano de Parcelamento</label>
              <select 
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-[14px] focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 outline-none font-digital text-lg text-white transition-all appearance-none cursor-pointer"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1} className="bg-neon-deep">{i+1} X Fixas</option>
                ))}
              </select>
            </div>
          </div>
          


          <Button variant="neon" className="w-full py-4 !border-neon-cyan/50 hover:!border-neon-cyan !text-neon-cyan" onClick={handleTakeLoan}>
            Solicitar Empréstimo
          </Button>
          <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest mt-4 font-mono-neon">
            * Taxa de juros aplicada de {marketParams.interestRate * 100}% a.m. aplicada sobre o saldo devedor.
          </p>
        </div>

        {/* Faturas Ativas */}
        <div>
          <h4 className="font-digital text-xs text-gray-500 mb-4 tracking-widest uppercase">Faturas em Aberto ({debts.length})</h4>
          {debts.length === 0 ? (
            <div className="text-center py-10 bg-black/10 rounded-xl border border-dashed border-white/5 opacity-50">
              <p className="text-xs uppercase tracking-widest">Nenhuma pendência financeira.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {debts.map((debt) => (
                <div key={debt.id} className="flex justify-between items-center p-5 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <div>
                    <p className="font-digital text-sm text-white opacity-80 mb-1">Dívida Turno {debt.createdAtRound}</p>
                    <p className="text-xs font-mono-neon text-neon-cyan">
                       RESTANTE: {formatBRL(debt.totalAmount)}
                    </p>
                AUTORIZAR CRÉDITO
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* Active Debts / Obligations */}
          <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8 flex flex-col">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
              <History size={20} className="text-[#c026d3]" />
              <h3 className="text-lg font-bold text-white tracking-tight">Obrigações Ativas</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 mt-4 max-h-[280px]">
              {activeLoans.length > 0 ? (
                activeLoans.map(loan => (
                  <div key={loan.id} className="bg-white/5 rounded-xl p-4 border border-white/5 flex justify-between items-center group">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate pr-2">{loan.title}</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Venc: Rodada {loan.dueRound}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-digital text-white">{formatCurrency(loan.amount)}</p>
                      <button 
                        onClick={() => payFinancialNote(loan.id)}
                        disabled={balance < loan.amount}
                        className="text-[8px] font-black uppercase tracking-widest text-[#c026d3] hover:text-white transition-colors disabled:opacity-30"
                      >
                        [ Liquidar ]
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-10">
                  <AlertCircle size={32} className="text-gray-500 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Sem débitos ativos</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info box Match */}
        <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle size={20} className="text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-purple-400/80 font-bold uppercase tracking-widest leading-relaxed">
              Conselho: Utilize o crédito bancário para sustentar saltos de investimento em Infraestrutura ou Marketing, mas monitore as taxas de juros para não comprometer sua margem líquida.
            </p>
        </div>
      </div>
    </Modal>
  );
};
