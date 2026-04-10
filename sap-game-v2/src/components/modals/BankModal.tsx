import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useBank } from '../../hooks/useBank';
import { useToast } from '../../hooks/useToast';
import { Building2, Landmark, History, AlertCircle, ArrowUpRight } from 'lucide-react';
import { cn } from '../ui/Button';

export const BankModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { balance, debts, takeLoan, payInstallment, marketParams } = useBank();
  const { addToast } = useToast();
  const [loanAmount, setLoanAmount] = useState(10000);
  const [installments, setInstallments] = useState(6);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleTakeLoan = () => {
    const success = takeLoan(loanAmount, installments);
    if (success) {
      addToast('success', 'Crédito Aprovado', `Foram creditados ${formatCurrency(loanAmount)} na sua conta.`);
    } else {
      addToast('error', 'Crédito Negado', 'O valor solicitado excede o limite disponível.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SISTEMA BANCÁRIO CENTRAL" centerTitle className="max-w-4xl">
      <div className="flex flex-col space-y-8">
        
        {/* Liquidity Status */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c026d3]/40 to-transparent" />
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#c026d3]/10 flex items-center justify-center text-[#c026d3]">
              <Landmark size={32} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Saldo em Conta</p>
              <h4 className="text-3xl font-digital text-white tracking-tighter">{formatCurrency(balance)}</h4>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Capacidade de Crédito</p>
            <h4 className="text-xl font-bold text-emerald-400">ALTA REPUTAÇÃO</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loan Request Panel */}
          <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
              <Building2 size={20} className="text-[#c026d3]" />
              <h3 className="text-lg font-bold text-white tracking-tight">Nova Linha de Crédito</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Valor do Aporte</label>
                  <span className="text-xs text-white font-digital">{formatCurrency(loanAmount)}</span>
                </div>
                <input 
                  type="range"
                  min="10000"
                  max={marketParams.maxLoan}
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#c026d3] border border-white/5"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Parcelamento</label>
                  <span className="text-xs text-white font-bold">{installments} Rodadas</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#c026d3] border border-white/5"
                />
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-widest text-[#c026d3]">
                  <span>RESUMO DA SOLICITAÇÃO</span>
                </div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-gray-500">Juros Estimados</span>
                  <span className="text-red-400 font-bold">{marketParams.interestRate * 100}% p/ Rodada</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Valor das Parcelas</span>
                  <span className="text-white font-bold">{formatCurrency((loanAmount * Math.pow(1 + marketParams.interestRate, installments)) / installments)}</span>
                </div>
              </div>

              <button 
                onClick={handleTakeLoan}
                className="w-full py-4 bg-[#c026d3] hover:bg-[#a21caf] text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                AUTORIZAR CRÉDITO
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* Active Debts / Obligations */}
          <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8 flex flex-col">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
              <History size={20} className="text-[#c026d3]" />
              <h3 className="text-lg font-bold text-white tracking-tight">Obrigações Bancárias</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 mt-4 max-h-[350px]">
              {debts.length > 0 ? (
                debts.map(debt => (
                  <div key={debt.id} className="bg-white/5 rounded-xl p-4 border border-white/5 flex justify-between items-center group">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate pr-2">Empréstimo (Turno {debt.createdAtRound})</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{debt.remainingInstallments} parcelas restantes</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-digital text-white">{formatCurrency(debt.installmentValue)}</p>
                      <button 
                        onClick={() => payInstallment(debt.id)}
                        disabled={balance < debt.installmentValue}
                        className="text-[8px] font-black uppercase tracking-widest text-[#c026d3] hover:text-white transition-colors disabled:opacity-30"
                      >
                        [ Liquidar Parcela ]
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-10">
                  <AlertCircle size={32} className="text-gray-500 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Sem faturas bancárias</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info box Match */}
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest leading-relaxed">
              Conselho: Utilize o crédito bancário para sustentar saltos de investimento em Infraestrutura ou Marketing, mas monitore as taxas de juros para não comprometer sua margem líquida.
            </p>
        </div>
      </div>
    </Modal>
  );
};
