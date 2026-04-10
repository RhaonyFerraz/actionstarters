import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { cn } from '../ui/Button';
import { Wallet, Clock, ArrowUpRight, ArrowDownLeft, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';

interface FinanceiroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'payable' | 'overdue' | 'receivable' | 'late';

export const FinanceiroModal: React.FC<FinanceiroModalProps> = ({ isOpen, onClose }) => {
  const { financialNotes, currentRound, balance, payFinancialNote, collectFinancialNote } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('payable');

  const tabs = [
    { id: 'payable', label: 'A Pagar', icon: ArrowDownLeft, color: 'bg-amber-500', border: 'border-amber-500/50' },
    { id: 'overdue', label: 'Vencidas', icon: AlertCircle, color: 'bg-red-500', border: 'border-red-500/50' },
    { id: 'receivable', label: 'A Receber', icon: ArrowUpRight, color: 'bg-emerald-500', border: 'border-emerald-500/50' },
    { id: 'late', label: 'Em Atraso', icon: Clock, color: 'bg-purple-500', border: 'border-purple-500/50' }
  ];

  const filteredNotes = financialNotes.filter(note => {
    if (activeTab === 'payable') return note.type === 'payable' && note.status === 'pending' && note.dueRound >= currentRound;
    if (activeTab === 'overdue') return note.type === 'payable' && note.status === 'pending' && note.dueRound < currentRound;
    if (activeTab === 'receivable') return note.type === 'receivable' && note.status === 'pending' && note.dueRound >= currentRound;
    if (activeTab === 'late') return note.type === 'receivable' && note.status === 'pending' && note.dueRound < currentRound;
    return false;
  });

  const totals = {
    payable: financialNotes.filter(n => n.type === 'payable' && n.status === 'pending').reduce((s, n) => s + n.amount, 0),
    receivable: financialNotes.filter(n => n.type === 'receivable' && n.status === 'pending').reduce((s, n) => s + n.amount, 0)
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GESTÃO FINANCEIRA ERP">
      <div className="flex flex-col space-y-8 p-1">
        
        {/* Resumo de Liquidez */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-3xl p-5 border-l-4 border-amber-500/30 flex justify-between items-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <ArrowDownLeft size={120} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1">Total Passivo (A Pagar)</p>
              <h4 className="text-2xl font-digital text-white">{formatCurrency(totals.payable)}</h4>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
               <Wallet size={20} />
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 border-l-4 border-emerald-500/30 flex justify-between items-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <ArrowUpRight size={120} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1">Total Ativo (A Receber)</p>
              <h4 className="text-2xl font-digital text-white">{formatCurrency(totals.receivable)}</h4>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <ArrowUpRight size={20} />
            </div>
          </div>
        </div>

        {/* Polaroid Style Tabs */}
        <div className="flex flex-wrap justify-center gap-4 py-2">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "relative w-24 sm:w-28 h-28 sm:h-32 p-3 bg-white transition-all duration-500 shadow-xl flex flex-col items-center justify-between group",
                  idx % 2 === 0 ? "rotate-2 hover:rotate-0" : "-rotate-3 hover:rotate-0",
                  isActive 
                    ? "scale-110 -translate-y-2 z-10 border-b-8 border-gray-100 ring-2 ring-white/20" 
                    : "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 hover:-translate-y-1"
                )}
              >
                <div className={cn("w-full h-16 sm:h-20 flex items-center justify-center text-white rounded-sm transition-colors", isActive ? tab.color : "bg-gray-200")}>
                   <Icon size={isActive ? 32 : 24} className="group-hover:scale-110 transition-transform" />
                </div>
                <span className={cn("text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-900 mt-2", isActive ? "opacity-100" : "opacity-40")}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-600 rounded-full border-4 border-white flex items-center justify-center text-[8px] text-white font-bold animate-bounce shadow-lg">
                    {filteredNotes.length}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-white font-bold text-xl tracking-tight">{tabs.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-gray-500 text-xs font-medium opacity-60">Sincronizado com a Rodada {currentRound} do ERP.</p>
            </div>
            {filteredNotes.length > 0 && (
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nesta Categoria</p>
                <p className="text-sm font-digital text-white">{formatCurrency(filteredNotes.reduce((s, n) => s + n.amount, 0))}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div key={note.id} className="glass-card rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-white/20 transition-all duration-500 relative overflow-hidden">
                  
                  {/* Status Indicator Bar */}
                  <div className={cn(
                    "absolute left-0 top-0 w-1.5 h-full opacity-60",
                    note.type === 'payable' ? "bg-amber-500" : "bg-emerald-500"
                  )} />

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-lg tracking-tight group-hover:text-cyan-400 transition-colors">
                        {note.title}
                      </h4>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-[8px] font-black uppercase text-gray-500 tracking-[0.2em]">
                        #{note.id}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-md">
                      {note.description}
                    </p>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 group-hover:border-white/10 transition-colors">
                        <Clock size={12} className="text-gray-400" />
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          note.dueRound < currentRound ? "text-red-400" : "text-gray-400"
                        )}>
                          Vencimento: Rodada {note.dueRound} {note.dueRound < currentRound ? '(VENCIDO)' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Valor do Título</p>
                      <span className="text-2xl md:text-3xl font-digital font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {formatCurrency(note.amount)}
                      </span>
                    </div>

                    <button 
                      onClick={() => note.type === 'payable' ? payFinancialNote(note.id) : collectFinancialNote(note.id)}
                      disabled={note.type === 'payable' && balance < note.amount}
                      className={cn(
                        "h-14 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale group/btn relative overflow-hidden",
                        note.type === 'payable' 
                          ? "bg-amber-600/90 hover:bg-amber-500 text-white shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)]" 
                          : "bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]"
                      )}
                    >
                      <CheckCircle2 size={18} className="transition-transform group-hover/btn:scale-110" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                        {note.type === 'payable' ? 'LIQUIDAR' : 'RECEBER'}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 group">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-700">
                   <MoreHorizontal size={32} className="text-gray-500" />
                </div>
                <p className="text-gray-400 uppercase font-black tracking-[0.4em] text-[10px]">Backlog Vazio</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info box */}
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:rotate-12 transition-transform">
               <AlertCircle size={20} />
            </div>
            <p className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-widest leading-relaxed">
              Dica: Mantenha sempre um fluxo de caixa positivo para evitar travas no departamento comercial e multas por atraso.
            </p>
        </div>
      </div>
    </Modal>
  );
};
