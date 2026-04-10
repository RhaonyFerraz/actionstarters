import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { cn } from '../ui/Button';

interface FinanceiroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'payable' | 'overdue' | 'receivable' | 'late';

export const FinanceiroModal: React.FC<FinanceiroModalProps> = ({ isOpen, onClose }) => {
  const { financialNotes, currentRound, balance, payFinancialNote, collectFinancialNote } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('payable');

  const tabs = [
    { id: 'payable', label: 'Contas a Pagar', color: 'border-[#f59e0b]' },
    { id: 'overdue', label: 'Contas Vencidas', color: 'border-[#ef4444]' },
    { id: 'receivable', label: 'Contas a Receber', color: 'border-[#10b981]' },
    { id: 'late', label: 'Recebimentos em Atraso', color: 'border-[#8b5cf6]' }
  ];

  const filteredNotes = financialNotes.filter(note => {
    if (activeTab === 'payable') return note.type === 'payable' && note.status === 'pending' && note.dueRound >= currentRound;
    if (activeTab === 'overdue') return note.type === 'payable' && note.status === 'pending' && note.dueRound < currentRound;
    if (activeTab === 'receivable') return note.type === 'receivable' && note.status === 'pending' && note.dueRound >= currentRound;
    if (activeTab === 'late') return note.type === 'receivable' && note.status === 'pending' && note.dueRound < currentRound;
    return false;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FINANCEIRO" centerTitle>
      <div className="flex flex-col space-y-8">
        
        {/* Navigation Tabs (Photo style) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "py-3 px-2 text-[10px] sm:text-xs font-bold transition-all border rounded-md",
                activeTab === tab.id 
                  ? `${tab.color} bg-white/5 text-white` 
                  : "border-gray-800 text-gray-500 hover:text-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-bold text-2xl tracking-tight mb-1">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-gray-500 text-sm italic">
              {activeTab === 'payable' && 'Títulos em aberto que vencerão em breve.'}
              {activeTab === 'overdue' && 'Títulos que já passaram da validade e requerem atenção imediata.'}
              {activeTab === 'receivable' && 'Previsão de entrada de capital na empresa.'}
              {activeTab === 'late' && 'Títulos faturados que ainda não foram liquidados pelo cliente.'}
            </p>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div key={note.id} className="bg-[#0a0a0a] rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative border border-white/5">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-white font-bold text-lg">
                      {note.title}
                    </h4>
                    <p className="text-gray-400 text-xs font-medium">
                      Vence em: {Math.max(0, note.dueRound - currentRound)} rodada(s) | Previsão
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xl sm:text-2xl font-digital font-bold text-white whitespace-nowrap">
                      {formatCurrency(note.amount)}
                    </span>
                    <button 
                      onClick={() => note.type === 'payable' ? payFinancialNote(note.id) : collectFinancialNote(note.id)}
                      disabled={note.type === 'payable' && balance < note.amount}
                      className="bg-[#c026d3] hover:bg-[#a21caf] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-md transition-all active:scale-95 whitespace-nowrap disabled:opacity-50"
                    >
                      {note.type === 'payable' ? 'LIQUIDAR TÍTULO' : 'RECEBER VALOR'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-black/20 rounded-2xl border border-dashed border-white/10 opacity-40">
                <p className="text-gray-400 uppercase font-black tracking-[0.3em] text-[10px]">Backlog Vazio</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info box */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-10 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-white font-bold uppercase tracking-widest text-[11px] rounded-lg transition-all border border-white/5 active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};
