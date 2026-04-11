import React from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Users, 
  BadgeDollarSign,
  Briefcase,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const CommercialModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { balance, currentRound } = useGameStore();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Mock data for emulation of the indicators
  const totalSales = balance * 0.45;
  const goal = balance * 0.8;
  const performancePct = Math.min(100, (totalSales / goal) * 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title=" " centerTitle className="max-w-5xl">
      <div className="flex flex-col space-y-12 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 px-4">
           <div className="flex items-center gap-4 text-white">
              <BarChart3 size={32} className="text-[#3b82f6]" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Gestão Comercial SAP</h2>
           </div>
           <p className="max-w-2xl text-center text-sm font-medium text-gray-400 leading-relaxed">
             Monitore suas metas de vendas e performance de mercado. Otimize sua força de vendas e acompanhe indicadores de penetração de mercado em tempo real.
           </p>
        </div>

        {/* Indicators Grid (Emulação Direta) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-10">
           
           {/* Card: Total de Vendas */}
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-4 hover:border-[#3b82f6]/20 transition-all group">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Total de Vendas</p>
              <h4 className="text-3xl font-digital text-white tracking-tight">{formatCurrency(totalSales)}</h4>
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                 <TrendingUp size={12} />
                 <span className="text-[9px] font-black">+12.4%</span>
              </div>
           </div>

           {/* Card: Meta Estabelecida */}
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-4 hover:border-white/20 transition-all group">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Meta de Faturamento</p>
              <h4 className="text-3xl font-digital text-white tracking-tight">{formatCurrency(goal)}</h4>
              <div className="flex items-center gap-2 text-gray-500">
                 <Target size={12} />
                 <span className="text-[9px] font-black uppercase">Q4 PROJECTED</span>
              </div>
           </div>

           {/* Card: Performance Pct */}
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-4 hover:border-[#3b82f6]/20 transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] relative z-10">Performance Geral</p>
              <h4 className="text-5xl font-digital text-[#3b82f6] tracking-tight relative z-10">{performancePct.toFixed(1)}%</h4>
              <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest relative z-10">Market Share Index</p>
           </div>
        </div>

        {/* Section: Market Performance Details */}
        <div className="px-4 sm:px-10">
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <TrendingUp size={24} className="text-[#3b82f6]" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Performance de Mercado</h3>
                 </div>
                 <div className="flex gap-2">
                    <span className="bg-white/5 px-3 py-1 rounded-lg text-[9px] text-gray-500 font-black border border-white/5">RODADA {currentRound}</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Market Stats */}
                 <div className="space-y-6">
                    {[
                      { label: 'Conversão de Leads', val: '24.8%', icon: Users },
                      { label: 'Valor Médio de Pedido', val: formatCurrency(2450), icon: BadgeDollarSign },
                      { label: 'Taxa de Retenção', val: '88.2%', icon: ShieldCheck },
                      { label: 'Pipeline Ativo', val: '14 Oportunidades', icon: Briefcase },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between group/item">
                         <div className="flex items-center gap-3">
                            <stat.icon size={18} className="text-gray-600 group-hover/item:text-[#3b82f6] transition-colors" />
                            <span className="text-[11px] font-bold text-gray-400 group-hover/item:text-white transition-colors">{stat.label}</span>
                         </div>
                         <span className="text-xs font-digital text-white">{stat.val}</span>
                      </div>
                    ))}
                 </div>

                 {/* Visualization Mock */}
                 <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center space-y-4">
                    <div className="w-full h-32 flex items-end gap-2 px-4 overflow-hidden">
                       {[40, 60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                         <div key={i} className="flex-1 bg-[#3b82f6]/40 hover:bg-[#3b82f6] transition-all rounded-t-lg" style={{ height: `${h}%` }} />
                       ))}
                    </div>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">Histórico de Vendas Mensal</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Final Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4">
           <button className="group flex items-center justify-center gap-4 px-12 py-5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2rem] transition-all active:scale-95 shadow-xl shadow-blue-900/40">
              <span>Relatórios da Força de Vendas</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>
           
           <button 
             onClick={onClose}
             className="px-16 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2rem] transition-all border border-white/5 active:scale-95"
           >
             Fechar Canal Comercial
           </button>
        </div>

      </div>
    </Modal>
  );
};
