import React from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { cn } from '../ui/Button';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  Package,
  TrendingUp
} from 'lucide-react';

export const FinanceiroModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { financialNotes, inventory, currentRound, balance, payFinancialNote, collectFinancialNote, debts } = useGameStore();
  
  const totalDebts = debts.reduce((sum, d) => sum + d.totalAmount, 0);

  const categories = [
    { id: 'payable', label: 'Contas a Pagar', icon: FileText, color: 'text-amber-500', desc: 'Títulos em aberto que vencerão em breve.' },
    { id: 'overdue', label: 'Contas Vencidas', icon: AlertCircle, color: 'text-red-500', desc: 'Títulos atrasados com cobrança de juros.' },
    { id: 'receivable', label: 'Contas a Receber', icon: CheckCircle2, color: 'text-emerald-500', desc: 'Boletos de clientes com pagamento programado.' },
    { id: 'late', label: 'Recebimentos em Atraso', icon: Clock, color: 'text-purple-500', desc: 'Pagamentos em atraso por parte dos clientes.' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const totalInventoryValue = 
    inventory.galpao + 
    inventory.machinery + 
    inventory.supplies + 
    inventory.rawMaterial + 
    inventory.finishedGoods + 
    inventory.vehicles;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title=" " centerTitle className="max-w-6xl">
      <div className="flex flex-col space-y-12 pb-10">
        
        {/* Header: Title & Total Asset Value */}
        <div className="flex flex-col items-center gap-6 px-4">
           <div className="flex items-center gap-4 text-white">
              <DollarSign size={32} className="text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Gestão Financeira SAP</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center space-y-2">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Capital Disponível</p>
                 <p className="text-4xl font-digital text-emerald-500">{formatCurrency(balance)}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center space-y-2">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Valor Bruto de Ativos</p>
                 <p className="text-4xl font-digital text-[#3b82f6]">{formatCurrency(totalInventoryValue)}</p>
              </div>
           </div>
        </div>

        {/* Categories Sections (Emulação Direta) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-8">
           {categories.map((cat) => {
              const notes = financialNotes.filter(n => {
                if (cat.id === 'payable') return n.type === 'payable' && n.status === 'pending' && n.dueRound >= currentRound;
                if (cat.id === 'overdue') return n.type === 'payable' && n.status === 'pending' && n.dueRound < currentRound;
                if (cat.id === 'receivable') return n.type === 'receivable' && n.status === 'pending' && n.dueRound >= currentRound;
                if (cat.id === 'late') return n.type === 'receivable' && n.status === 'pending' && n.dueRound < currentRound;
                return false;
              });

              return (
                <div key={cat.id} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 flex flex-col hover:border-white/10 transition-all group min-h-[400px]">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className={cn("p-3 rounded-2xl bg-white/5", cat.color)}>
                            <cat.icon size={24} />
                         </div>
                         <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">{cat.label}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{cat.desc}</p>
                         </div>
                      </div>
                      <span className="text-xs font-digital text-white/40">{notes.length} Títulos</span>
                   </div>

                   <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 max-h-[250px]">
                      {notes.length === 0 ? (
                        <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-3xl opacity-20 py-10">
                           <p className="text-[10px] font-black uppercase tracking-widest">Nenhum título pendente</p>
                        </div>
                      ) : (
                        notes.map(note => (
                          <div key={note.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4 hover:bg-white/5 transition-all">
                             <div className="flex justify-between items-start">
                                <div>
                                   <p className="text-xs font-bold text-white mb-1">{note.title}</p>
                                   <p className="text-[10px] text-gray-500 font-medium">Ref: SAP-FIN-{note.id.split('-')[0]}</p>
                                </div>
                                <p className={cn("text-base font-digital font-bold", cat.id.includes('receivable') ? "text-emerald-500" : "text-white")}>
                                   {formatCurrency(note.amount)}
                                </p>
                             </div>
                             
                             <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Vencimento: Rodada {note.dueRound}</span>
                                <button 
                                  onClick={() => note.type === 'payable' ? payFinancialNote(note.id) : collectFinancialNote(note.id)}
                                  disabled={note.type === 'payable' && balance < note.amount}
                                  className={cn(
                                    "px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20",
                                    cat.id.includes('receivable') ? "bg-emerald-600 text-white" : "bg-[#3b82f6] text-white"
                                  )}
                                >
                                  {note.type === 'payable' ? 'Liquidar' : 'Receber'}
                                </button>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
              );
           })}
        </div>

        {/* Section: Extrato Financeiro & Ativos (Horizontal Stats) */}
        <div className="px-4 sm:px-8">
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <History size={24} className="text-[#3b82f6]" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Extrato Financeiro Consolidado</h3>
                 </div>
                 <button className="text-[10px] font-black text-[#3b82f6] uppercase tracking-[0.3em] hover:underline">Ver Histórico Completo</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { label: 'Entradas (Mês)', val: balance * 0.15, icon: ArrowUpRight, color: 'text-emerald-500' },
                   { label: 'Saídas (Mês)', val: (totalDebts / 4), icon: ArrowDownLeft, color: 'text-red-500' },
                   { label: 'Valor de Estoque', val: inventory.finishedGoods, icon: Package, color: 'text-[#3b82f6]' },
                   { label: 'Previsão de Lucro', val: balance * 0.05, icon: TrendingUp, color: 'text-amber-500' },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2 border-l border-white/5 pl-6">
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                      <div className="flex items-center gap-2">
                         <stat.icon size={14} className={stat.color} />
                         <p className="text-lg font-digital font-bold text-white">{formatCurrency(stat.val)}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center pt-4">
           <button 
             onClick={onClose}
             className="px-20 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.5em] text-[11px] rounded-[2rem] transition-all border border-white/5 active:scale-95"
           >
             Encerrar Gestão
           </button>
        </div>

      </div>
    </Modal>
  );
};

const History = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M12 7v5l4 2"/>
  </svg>
);
