import React from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { 
  Building2, 
  Cpu, 
  GraduationCap, 
  Megaphone, 
  Truck, 
  UserRound,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../ui/Button';

export const ConsultoriaModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { balance, modulesLevels, upgradeModule } = useGameStore();

  const handleUpgrade = (id: string, cost: number) => {
    upgradeModule(id as any, cost);
  };

  const improvements = [
    {
      id: 'hr', // Mapping to 'Treinamento' in the old system or HR in current
      title: 'Treinamento',
      icon: GraduationCap,
      description: 'Valoriza matéria-prima e reduz multas por erros em 2% por nível.',
      cost: 5000,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    },
    {
      id: 'marketing', // Propaganda
      title: 'Propaganda',
      icon: Megaphone,
      description: 'Valoriza produtos acabados e dá + R$ 20 em eventos positivos.',
      cost: 4500,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      id: 'logistics', // Logística
      title: 'Logística',
      icon: Truck,
      description: 'Valoriza frota e dá + R$ 5 de bônus por acerto.',
      cost: 6000,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    },
    {
      id: 'pcp', // Using PCP for Machines/Infrastructure or similar
      title: 'Máquinas',
      icon: Cpu,
      description: 'Pronto para aumentar a produtividade e o valor do maquinário.',
      cost: 8000,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      id: 'infrastructure', // New conceptual ID or mapping to existing
      title: 'Infraestrutura',
      icon: Building2,
      description: 'Aumenta o valor do Galpão no inventário em o dobro do investimento.',
      cost: 12000,
      color: 'text-rose-400',
      bgColor: 'bg-rose-400/10'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title=" " centerTitle className="max-w-6xl">
      <div className="flex flex-col space-y-12 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 px-4">
           <div className="flex items-center gap-4 text-white">
              <TrendingUp size={32} className="text-[#3b82f6]" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Melhorias Estratégicas</h2>
           </div>
           <p className="max-w-2xl text-center text-sm font-medium text-gray-400 leading-relaxed">
             Aprimore sua operação para aumentar a eficiência e o lucro por rodada. Escolha investimentos de alto ROI para valorizar seus ativos e mitigar riscos operacionais.
           </p>
        </div>

        {/* Improvements Grid (Exact Emulation of the 6 areas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-10">
           {improvements.map((item) => {
              const level = (modulesLevels as any)[item.id] || 0;
              const currentCost = item.cost * (level + 1);
              const canAfford = balance >= currentCost;

              return (
                <div key={item.id} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 flex flex-col space-y-6 hover:border-white/20 transition-all group relative overflow-hidden">
                   <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 pointer-events-none", item.bgColor)} />
                   
                   <div className="flex items-center justify-between">
                      <div className={cn("p-4 rounded-2xl", item.bgColor, item.color)}>
                         <item.icon size={28} />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Nível Atual</p>
                         <p className="text-xl font-digital text-white">0{level}</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <h3 className="text-lg font-black text-white uppercase tracking-widest">{item.title}</h3>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed min-h-[48px]">
                        {item.description}
                      </p>
                   </div>

                   <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                         <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Custo Upgrade</p>
                         <p className="text-lg font-digital text-emerald-500">R$ {currentCost.toLocaleString()}</p>
                      </div>
                      <button 
                         onClick={() => handleUpgrade(item.id, currentCost)}
                         disabled={!canAfford}
                         className={cn(
                           "p-3 rounded-xl transition-all active:scale-95 disabled:opacity-20",
                           canAfford ? "bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-lg shadow-blue-900/40" : "bg-white/5 text-gray-500"
                         )}
                      >
                         <ArrowUpRight size={20} />
                      </button>
                   </div>
                </div>
              );
           })}
        </div>

        {/* Institutional Footer */}
        <div className="flex flex-col items-center gap-6 px-4">
           <div className="flex items-center gap-2 opacity-30">
              <ShieldCheck size={16} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Protocolo de Auditoria SAP Ativo</p>
           </div>
           
           <button 
             onClick={onClose}
             className="px-20 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.5em] text-[11px] rounded-[2rem] transition-all border border-white/5 active:scale-95 shadow-2xl"
           >
             Fechar Painel Estratégico
           </button>
        </div>

      </div>
    </Modal>
  );
};
