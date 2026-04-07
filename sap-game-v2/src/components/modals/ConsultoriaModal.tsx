import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/useGameStore';
import { TrendingUp, Users, Truck, Factory } from 'lucide-react';
import { ModulesLevels } from '../../types';

export const ConsultoriaModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const levels = useGameStore(state => state.modulesLevels);
  const balance = useGameStore(state => state.balance);
  const upgradeModule = useGameStore(state => state.upgradeModule);

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Exponencial de Custo: Nível 1 pro 2 custa 10k. Nível 2 pro 3 custa 15k...
  const getUpgradeCost = (currentLvl: number) => Math.floor(10000 * Math.pow(1.5, currentLvl));

  const handleUpgrade = (id: keyof ModulesLevels) => {
    const cost = getUpgradeCost(levels[id]);
    if (balance >= cost) {
      upgradeModule(id, cost);    
      // Não exibe alert aqui no design V2 para ser dinâmico, o level no UI já pula instantaneamente pra +1.
    }
  };

  const departments: { id: keyof ModulesLevels; name: string; icon: any; desc: string }[] = [
    { id: 'commercial', name: 'Depto. Comercial', icon: TrendingUp, desc: 'Eleva exponencialmente o seu Markup, cobrando mais pelos SKUs no mercado.' },
    { id: 'logistics', name: 'Logística', icon: Truck, desc: 'Aprimora o escoamento logístico cortando taxas de percurso na expedição.' },
    { id: 'hr', name: 'Recursos Humanos', icon: Users, desc: 'Atrai especialistas melhores, reduzindo sua Base de OPEX nas rodadas.' },
    { id: 'pcp', name: 'Indústria (PCP)', icon: Factory, desc: 'Masteriza a linha de montagem, inflando sua produção de SKUs limpos.' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Central de Consultoria Industrial" className="max-w-4xl">
      <div className="bg-black/60 -m-6 mb-8 p-10 text-white rounded-t-xl border-b border-neon-cyan/20 relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] text-neon-cyan opacity-50 blur-3xl w-40 h-40 bg-neon-cyan/20 rounded-full" />
        <div className="absolute right-10 top-10 text-neon-cyan opacity-10">
           <TrendingUp size={140} />
        </div>
        <h2 className="text-4xl font-digital font-bold relative z-10 tracking-tight neon-text-cyan">UPGRADES DE INFRAESTRUTURA</h2>
        <p className="text-gray-400 max-w-xl mt-4 relative z-10 leading-relaxed font-mono-neon uppercase tracking-widest text-xs">Contrate agências táticas para realizar a ciclem de setores. Níveis altos são o segredo da dominação do Market Share no ERP.</p>
        <div className="mt-8 inline-flex items-center gap-4 bg-neon-cyan/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-neon-cyan/30 font-digital text-2xl relative z-10 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <span className="text-[10px] text-neon-cyan/60 uppercase tracking-[0.2em] font-bold">Reserva:</span>
          <span className="text-white ml-2">{formatBRL(balance)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
        {departments.map(dep => {
          const cost = getUpgradeCost(levels[dep.id]);
          const canAfford = balance >= cost;
          const currentLvl = levels[dep.id];

          return (
            <div key={dep.id} className="bg-black/40 border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-all group relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                 <div className="flex gap-5">
                   <div className="p-4 bg-white/5 text-gray-300 rounded-2xl border border-white/10 group-hover:border-white/30 transition-all"><dep.icon size={32}/></div>
                   <div>
                     <h3 className="font-digital font-bold text-white text-xl tracking-tight mb-2">{dep.name}</h3>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green/80 bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/20 inline-block">STATUS: LV {currentLvl}</p>
                   </div>
                 </div>
               </div>
               <p className="text-sm text-gray-500 mb-8 font-mono-neon leading-relaxed min-h-[48px] px-2">{dep.desc}</p>
               
               <Button 
                onClick={() => handleUpgrade(dep.id)} 
                disabled={!canAfford}
                variant={canAfford ? 'neon' : 'secondary'}
                className={`w-full py-5 text-sm uppercase tracking-[0.2em] transition-all ${canAfford ? '!border-neon-cyan/40 !text-neon-cyan hover:!border-neon-cyan' : 'opacity-40'}`}
               >
                 {canAfford ? `UPGRADE » ${formatBRL(cost)}` : `BLOQUEADO » ${formatBRL(cost)}`}
               </Button>
            </div>
          )
        })}
      </div>
    </Modal>
  );
};
