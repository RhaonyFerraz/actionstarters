import React from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { Truck, Factory, GraduationCap, Megaphone, Building2, FileText, ChevronRight } from 'lucide-react';
import { ModulesLevels } from '../../types';
import { cn } from '../ui/Button';

export const ConsultoriaModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const levels = useGameStore(state => state.modulesLevels);
  const balance = useGameStore(state => state.balance);
  const upgradeModule = useGameStore(state => state.upgradeModule);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const getUpgradeCost = (currentLvl: number) => Math.floor(10000 * Math.pow(1.5, currentLvl));

  const handleUpgrade = (id: keyof ModulesLevels) => {
    const cost = getUpgradeCost(levels[id]);
    if (balance >= cost) {
      upgradeModule(id, cost);    
    }
  };

  const departments: { id: keyof ModulesLevels; name: string; icon: any; desc: string; color: string }[] = [
    { id: 'commercial', name: 'Infraestrutura', icon: Building2, color: 'text-blue-400', desc: 'Melhora o galpão e os ativos industriais em até 30% por rodada.' },
    { id: 'pcp', name: 'Máquinas', icon: Factory, color: 'text-blue-500', desc: 'Melhora o maquinário da fábrica em até 40% por rodada.' },
    { id: 'hr', name: 'Treinamento', icon: GraduationCap, color: 'text-emerald-400', desc: 'Melhora o capital humano e reduz custos operacionais em até 20% por rodada.' },
    { id: 'marketing', name: 'Propaganda', icon: Megaphone, color: 'text-cyan-500', desc: 'Melhora os pontos de visibilidade em até 10% em rodadas próximas.' },
    { id: 'logistics', name: 'Logística', icon: Truck, color: 'text-amber-400', desc: 'Melhora o frete e a logística de percurso por rodada.' },
    { id: 'financial', name: 'Consultoria', icon: FileText, color: 'text-cyan-400', desc: 'Recupere 10% dos ganhos perdidos em percursos por rodada.' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GESTÃO ESTRATÉGICA" centerTitle className="max-w-4xl">
      <div className="flex flex-col space-y-8">
        
        {/* Header Style Match */}
        <div className="text-center px-4 pt-2">
          <p className="text-gray-500 text-sm font-medium italic opacity-80 max-w-2xl mx-auto">
            Invista em infraestrutura e pessoal para otimizar os buffers de produtividade e maximizar a liquidez operacional do seu ERP.
          </p>
        </div>

        {/* Improvements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map(dep => {
            const currentLvl = levels[dep.id];
            const cost = getUpgradeCost(currentLvl);
            const canAfford = balance >= cost;
            const maxLvl = 10;

            return (
              <div key={dep.id} className="bg-[#0a0a0a] rounded-[2rem] p-6 flex flex-col justify-between border border-white/5 hover:border-white/10 transition-all duration-500 group relative overflow-hidden">
                
                <div className="flex gap-5 relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0",
                    "bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/20",
                    dep.color
                  )}>
                    <dep.icon size={28} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-cyan-400 transition-colors">{dep.name}</h3>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">Nível: {currentLvl}</span>
                    </div>
                    
                    <p className="text-xs text-gray-500 leading-relaxed font-sans mb-4 opacity-80">
                      {dep.desc}
                    </p>

                    {/* Industrial Level Progress */}
                    <div className="flex gap-1.5 h-1.5 mb-2">
                      {Array.from({ length: maxLvl }).map((_, i) => {
                        const isActive = i < currentLvl;
                        const yellowColor = '#facc15';

                        return (
                          <div 
                            key={i} 
                            className={cn(
                              "flex-1 rounded-[1px] transition-all duration-500",
                              isActive ? "" : "bg-white/[0.03] border border-white/[0.05] opacity-20"
                            )}
                            style={{ 
                              backgroundColor: isActive ? yellowColor : undefined,
                              boxShadow: isActive ? `0 0 10px ${yellowColor}` : 'none'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Magenta Premium Button */}
                <button 
                  onClick={() => handleUpgrade(dep.id)}
                  disabled={!canAfford || currentLvl >= maxLvl}
                  className={cn(
                    "w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:active:scale-100",
                    canAfford && currentLvl < maxLvl
                      ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)]" 
                      : "bg-[#1a1a1a] text-gray-600 border border-white/5"
                  )}
                >
                  {currentLvl >= maxLvl 
                    ? "MOLDE DE OPERAÇÃO NO MÁXIMO" 
                    : (
                      <>
                        INVESTIR {formatCurrency(cost)}
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )
                  }
                </button>
              </div>
            );
          })}
        </div>

        {/* Status indicator Match */}
        <div className="flex justify-center pt-2">
          <div className="bg-[#111111] px-8 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
             <div className="text-right">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Saldo Disponível</p>
                <p className="text-white font-digital text-2xl">{formatCurrency(balance)}</p>
             </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
