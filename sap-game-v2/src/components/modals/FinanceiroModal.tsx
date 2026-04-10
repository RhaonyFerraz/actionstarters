import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { cn } from '../ui/Button';

interface FinanceiroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'payable' | 'overdue' | 'receivable' | 'late' | 'inventory';

export const FinanceiroModal: React.FC<FinanceiroModalProps> = ({ isOpen, onClose }) => {
  const { financialNotes, inventory, currentRound, balance, payFinancialNote, collectFinancialNote } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('payable');

  const tabs = [
    { id: 'payable', label: 'Contas a Pagar', color: '#f59e0b', desc: 'Títulos em aberto que vencerão em breve.' },
    { id: 'overdue', label: 'Contas Vencidas', color: '#ef4444', desc: 'Títulos que já passaram da validade e requerem atenção imediata.' },
    { id: 'receivable', label: 'Contas a Receber', color: '#10b981', desc: 'Previsão de entrada de capital na empresa.' },
    { id: 'late', label: 'Recebimentos em Atraso', color: '#8b5cf6', desc: 'Títulos faturados que ainda não foram liquidados pelo cliente.' },
    { id: 'inventory', label: 'Inventário', color: '#facc15', desc: 'Gestão de ativos e valor bruto de estoque.' }
  ];

  const filteredNotes = financialNotes.filter(note => {
    if (activeTab === 'payable') return note.type === 'payable' && note.status === 'pending' && note.dueRound >= currentRound;
    if (activeTab === 'overdue') return note.type === 'payable' && note.status === 'pending' && note.dueRound < currentRound;
    if (activeTab === 'receivable') return note.type === 'receivable' && note.status === 'pending' && note.dueRound >= currentRound;
    if (activeTab === 'late') return note.type === 'receivable' && note.status === 'pending' && note.dueRound < currentRound;
    return false;
  });

  const totalInventoryValue = 
    inventory.galpao + 
    inventory.machinery + 
    inventory.supplies + 
    inventory.rawMaterial + 
    inventory.finishedGoods + 
    inventory.vehicles;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FINANCEIRO" centerTitle className="max-w-4xl">
      <div className="flex flex-col space-y-10">
        
        {/* Navigation Tabs (Grid 5 columns) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "relative py-4 px-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all rounded-t-lg",
                  isActive 
                    ? "bg-[#1e1e1e] text-white" 
                    : "bg-[#0f0f0f] text-gray-500 hover:text-gray-400"
                )}
                style={{
                  borderTop: `3px solid ${isActive ? tab.color : 'transparent'}`
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="space-y-8 min-h-[400px]">
          <div>
            <h3 className="text-white font-black text-2xl tracking-tight mb-1 uppercase">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              {tabs.find(t => t.id === activeTab)?.desc}
            </p>
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'inventory' ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Assets Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Galpão', val: inventory.galpao },
                    { title: 'Maquinário', val: inventory.machinery },
                    { title: 'Embalagens', val: inventory.supplies },
                    { title: 'Matéria-prima', val: inventory.rawMaterial },
                    { title: 'Produtos Acabados', val: inventory.finishedGoods },
                    { title: 'Frota de Veículos', val: inventory.vehicles },
                  ].map((asset, i) => (
                    <div key={i} className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center space-y-2 group hover:border-white/20 transition-all">
                      <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{asset.title}</h4>
                      <p className="text-xl font-digital text-white group-hover:text-[#c026d3] transition-colors">{new Intl.NumberFormat('pt-BR').format(asset.val)}</p>
                    </div>
                  ))}
                </div>

                {/* Totalizer */}
                <div className="bg-[#0a0a0a] rounded-[2rem] p-10 border border-[#c026d3]/20 flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#c026d3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c026d3] mb-4 relative z-10">Valor Bruto de Ativos</p>
                   <p className="text-5xl sm:text-6xl font-digital font-bold text-white relative z-10 drop-shadow-[0_0_15px_rgba(192,38,211,0.3)]">
                     {formatCurrency(totalInventoryValue)}
                   </p>
                </div>
              </div>
            ) : (
              filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div key={note.id} className="bg-[#0a0a0a] rounded-[2rem] p-8 border border-white/5 hover:border-white/10 transition-all duration-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-bold text-xl tracking-tight">
                        {note.title}
                      </h4>
                      <span className="text-xl sm:text-2xl font-digital font-bold text-white/90">
                        {formatCurrency(note.amount)}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-xs font-medium mb-8">
                      Vence em {Math.max(0, note.dueRound - currentRound)} rodada(s) (Previsão)
                    </p>
  
                    <div className="flex justify-end">
                      <button 
                        onClick={() => note.type === 'payable' ? payFinancialNote(note.id) : collectFinancialNote(note.id)}
                        disabled={note.type === 'payable' && balance < note.amount}
                        className="bg-[#c026d3] hover:bg-[#a21caf] text-white text-[9px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                      >
                        {note.type === 'payable' ? 'VER DETALHES' : 'EFETUAR RECEBIMENTO'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center bg-black/10 rounded-[3rem] border border-dashed border-white/5 opacity-40">
                  <p className="text-gray-500 uppercase font-black tracking-[0.5em] text-[10px]">Backlog Operacional Vazio</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer (Fechar Button) */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-[#1a1a1a] hover:bg-[#252525] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all border border-white/5 shadow-xl active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};
