import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useBank } from '../../hooks/useBank';
import { Landmark, QrCode, TrendingUp, Wallet, ArrowRight, ShieldCheck, History } from 'lucide-react';

export const BankModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { balance, debts } = useBank();
  const [pixKey, setPixKey] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2 
    }).format(val);
  };

  const totalDebts = debts.reduce((acc, debt) => acc + (debt.installmentValue * debt.remainingInstallments), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title=" " centerTitle className="max-w-5xl">
      <div className="flex flex-col space-y-12 pb-10">
        
        {/* Header Section: Balance & Title */}
        <div className="flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 text-[#3b82f6]">
              <Landmark size={32} className="drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Banco Corporativo SAP</h2>
           </div>
           
           <div className="bg-gradient-to-br from-[#3b82f6]/20 to-transparent border border-white/10 rounded-[2.5rem] p-10 w-full max-w-2xl flex flex-col items-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Saldo em Conta Corrente</p>
              <h3 className="text-5xl sm:text-6xl font-digital font-bold text-white tracking-tight">
                {formatCurrency(balance)}
              </h3>
              <div className="mt-6 flex items-center gap-2 opacity-40">
                <ShieldCheck size={16} className="text-[#3b82f6]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Conexão Criptografada Ativa</span>
              </div>
           </div>
        </div>

        {/* Vertical Layout Sections (Direct Emulation) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-10">
           
           {/* Section 1: Transferências PIX */}
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-[#3b82f6]/20 transition-all duration-500 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <QrCode size={24} />
                </div>
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest">Chave PIX Corporativa</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Transferências instantâneas B2B</p>
                </div>
              </div>
              
              <div className="space-y-4">
                 <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                   Digite os <span className="text-white font-bold underline">5 dígitos</span> da sua chave PIX para transferências corporativas seguras.
                 </p>
                 <input 
                   type="text" 
                   maxLength={5}
                   value={pixKey}
                   onChange={(e) => setPixKey(e.target.value.replace(/\D/g, ''))}
                   placeholder="00000"
                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 text-center text-2xl font-digital text-white tracking-[1em] focus:outline-none focus:border-emerald-500/40 transition-all"
                 />
                 <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-95 disabled:opacity-20" disabled={pixKey.length < 5}>
                   ATIVAR CHAVE PIX
                 </button>
              </div>
           </div>

           {/* Section 2: Crédito & Empréstimos */}
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-red-500/20 transition-all duration-500 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                  <Wallet size={24} />
                </div>
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest">Crédito Rotativo</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Soluções de Liquidez SAP</p>
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Juros Mensal</p>
                       <p className="text-xl font-digital text-red-500">5%</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Dívida Total</p>
                       <p className="text-xl font-digital text-white">{formatCurrency(totalDebts)}</p>
                    </div>
                 </div>

                 <div className="bg-gradient-to-r from-red-500/5 to-transparent p-4 rounded-xl border-l-2 border-red-500">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Valor por Parcela (Previsão):</p>
                    <p className="text-lg font-digital text-white">{formatCurrency(totalDebts > 0 ? (totalDebts / 12) : 0)}</p>
                 </div>

                 <button className="w-full py-4 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all border border-red-500/20 active:scale-95">
                   SOLICITAR APORTE
                 </button>
              </div>
           </div>

           {/* Section 3: Investimentos de Curto Prazo */}
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-[#facc15]/20 transition-all duration-500 group lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#facc15]/10 rounded-xl text-[#facc15]">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Rendimento Corporativo</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">CDB SAP — Liquidez Diária</p>
                  </div>
                </div>
                <span className="bg-[#facc15]/10 text-[#facc15] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#facc15]/20">TAXA ADM: 0,5%</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Rendimento</p>
                    <p className="text-3xl font-digital text-[#facc15]">3% <span className="text-xs uppercase font-black text-gray-500">/ Mês</span></p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Previsão de Lucro</p>
                    <p className="text-2xl font-digital text-white">{formatCurrency(balance * 0.03)}</p>
                 </div>
                 <div className="flex items-end">
                    <button className="w-full py-4 bg-[#facc15] hover:bg-yellow-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-95 shadow-lg shadow-yellow-900/20">
                      INVESTIR AGORA
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4 sm:px-10">
           <button className="group flex items-center gap-4 px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl transition-all border border-white/5 active:scale-95">
              <History size={18} className="text-[#3b82f6]" />
              <span>Extrato Detalhado</span>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
           </button>
           
           <button 
             onClick={onClose}
             className="px-16 py-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl transition-all border border-red-500/10 active:scale-95"
           >
             Fechar Terminal
           </button>
        </div>

      </div>
    </Modal>
  );
};
