import React from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { Truck, Factory, GraduationCap, Megaphone, Building2, FileText } from 'lucide-react';
import { ModulesLevels } from '../../types';
import { cn } from '../ui/Button';

export const ConsultoriaModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const levels = useGameStore(state => state.modulesLevels);
  const balance = useGameStore(state => state.balance);
  const upgradeModule = useGameStore(state => state.upgradeModule);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  // Exponencial de Custo: Nível 1 pro 2 custa 10k. Nível 2 pro 3 custa 15k...
  const getUpgradeCost = (currentLvl: number) => Math.floor(10000 * Math.pow(1.5, currentLvl));

  const handleUpgrade = (id: keyof ModulesLevels) => {
    const cost = getUpgradeCost(levels[id]);
    if (balance >= cost) {
      upgradeModule(id, cost);    
    }
  };

  const departments: { id: keyof ModulesLevels; name: string; icon: any; desc: string; color: string }[] = [
    { id: 'commercial', name: 'Infraestrutura', icon: Building2, color: 'text-blue-500', desc: 'Melhora o galpão e os ativos industriais em até 30% por rodada.' },
    { id: 'pcp', name: 'Máquinas', icon: Factory, color: 'text-purple-500', desc: 'Melhora o maquinário da fábrica em até 40% por rodada.' },
    { id: 'hr', name: 'Treinamento', icon: GraduationCap, color: 'text-green-500', desc: 'Melhora o capital humano e reduz custos operacionais em até 20% por rodada.' },
    { id: 'marketing', name: 'Propaganda', icon: Megaphone, color: 'text-red-500', desc: 'Melhora os pontos de visibilidade em até 10% em rodadas próximas.' },
    { id: 'logistics', name: 'Logística', icon: Truck, color: 'text-orange-500', desc: 'Melhora o frete e a logística de percurso por rodada.' },
    { id: 'financial', name: 'Consultoria', icon: FileText, color: 'text-blue-400', desc: 'Recupere 10% dos ganhos perdidos em percursos por rodada.' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestão Estratégica" className="max-w-4xl">
      <div className="flex flex-col space-y-6 pt-4">
        
        {/* Header Style from Photo */}
        <div className="text-center space-y-2 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Melhorias Estratégicas</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-sans max-w-2xl mx-auto">
            Invista em sua operação para aumentar a produtividade e o lucro por rodada.
          </p>
        </div>

        {/* Improvements Grid (2 columns on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map(dep => {
            const currentLvl = levels[dep.id];
            const cost = getUpgradeCost(currentLvl);
            const canAfford = balance >= cost;
            const maxLvl = 10;

            return (
              <div key={dep.id} className="glass-card rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:scale-[1.01] active:scale-[0.99] group">
                
                <div className="flex gap-5">
                  {/* Icon Container linked to department color */}
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-500",
                    "bg-white/5 border-white/10 group-hover:bg-white/10",
                    dep.color
                  )}>
                    <dep.icon size={28} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <h3 className="font-extrabold text-white text-lg tracking-tight">{dep.name}</h3>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Nível: {currentLvl}</span>
                    </div>
                    
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans mb-5 italic opacity-80">
                      {dep.desc}
                    </p>

                    {/* Industrial Lamp Progress Dots (10 units) */}
                    <div className="flex gap-1.5 h-2.5">
                      {Array.from({ length: maxLvl }).map((_, i) => {
                        const isActive = i < currentLvl;
                        // Industrial Color Map: Red -> Orange -> Yellow -> Green -> Blue -> White
                        const colors = [
                          '#ef4444', // 1: Red
                          '#f97316', // 2: Orange
                          '#facc15', // 3: Yellow
                          '#a3e635', // 4: Lime
                          '#22c55e', // 5: Green
                          '#10b981', // 6: Emerald
                          '#06b6d4', // 7: Cyan
                          '#3b82f6', // 8: Blue
                          '#8b5cf6', // 9: Violet
                          '#f8fafc', // 10: Ice White
                        ];
                        const color = colors[i];

                        return (
                          <div 
                            key={i} 
                            className={cn(
                              "flex-1 rounded-[1px] transition-all duration-700",
                              isActive ? "opacity-100" : "bg-white/[0.03] border border-white/[0.05] opacity-30"
                            )}
                            style={{ 
                              backgroundColor: isActive ? color : undefined,
                              boxShadow: isActive ? `0 0 15px ${color}, 0 0 5px ${color}` : 'none',
                              filter: isActive ? 'brightness(1.2)' : 'none'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Premium Gradient Button */}
                <button 
                  onClick={() => handleUpgrade(dep.id)}
                  disabled={!canAfford || currentLvl >= maxLvl}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500",
                    currentLvl >= maxLvl 
                      ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
                      : canAfford 
                        ? "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(147,51,234,0.2)] active:scale-95" 
                        : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                  )}
                >
                  {currentLvl >= maxLvl 
                    ? "UNIDADE MÁXIMA ALCANÇADA" 
                    : `INVESTIR ${formatCurrency(cost)}`
                  }
                </button>
              </div>
            );
          })}
        </div>

        {/* Wallet Indicator */}
        <div className="flex justify-center pt-4">
          <div className="bg-purple-900/20 px-6 py-2 rounded-full border border-purple-500/20">
             <span className="text-[10px] text-purple-400 uppercase font-black tracking-widest mr-2">Disponível:</span>
             <span className="text-white font-digital text-xl">{formatCurrency(balance)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
