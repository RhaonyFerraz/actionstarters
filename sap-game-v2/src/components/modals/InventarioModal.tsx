import React from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { cn } from '../ui/Button';

export const InventarioModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { inventory } = useGameStore();

  const totalInventoryValue = 
    inventory.galpao + 
    inventory.machinery + 
    inventory.supplies + 
    inventory.rawMaterial + 
    inventory.finishedGoods + 
    inventory.vehicles;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0 }).format(val);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Gestão de Ativos"
      className="max-w-4xl"
    >
      <div className="flex flex-col items-center space-y-8 py-4">
        
        {/* Header Style from Photo */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestão de Inventário</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-sans">Acompanhe seus ativos e estoques em tempo real.</p>
        </div>

        {/* Assets Grid (3x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full px-2 sm:px-0">
          <AssetCard title="Galpão" value={inventory.galpao} />
          <AssetCard title="Maquinário" value={inventory.machinery} />
          <AssetCard title="Embalagens" value={inventory.supplies} />
          <AssetCard title="Matéria-prima" value={inventory.rawMaterial} />
          <AssetCard title="Produtos Acabados" value={inventory.finishedGoods} />
          <AssetCard title="Frota de Veículos" value={inventory.vehicles} />
        </div>

        {/* Totalizer (Aura Glow) */}
        <div className={cn(
          "w-full rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center transition-all duration-700 relative overflow-hidden",
          "bg-white/[0.03] backdrop-blur-xl border border-magenta-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
          "hover:border-magenta-500/40 hover:shadow-[0_0_50px_rgba(255,0,255,0.1)] group"
        )}>
           <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
           <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.3em] text-magenta-500/80 mb-3 relative z-10">Valor Bruto de Ativos</p>
           <div className="flex items-baseline gap-3 relative z-10">
             <span className="text-magenta-500 font-black text-2xl sm:text-3xl">$</span>
             <span className="text-4xl sm:text-6xl font-digital font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{formatCurrency(totalInventoryValue)}</span>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <button className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-12 rounded-full uppercase tracking-widest text-sm shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all active:scale-95 animate-pulse-slow">
            PENHORAR INVENTÁRIO
          </button>
          
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-4 px-8 rounded-2xl uppercase tracking-widest text-xs transition-colors"
          >
            fechar
          </button>
        </div>

      </div>
    </Modal>
  );
};

const AssetCard: React.FC<{ title: string; value: number }> = ({ title, value }) => {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 group hover:scale-[1.02] active:scale-[0.98]">
      <h4 className="text-[10px] sm:text-xs text-center font-extrabold text-gray-500 uppercase tracking-[0.2em] leading-tight group-hover:text-gray-300 transition-colors">{title}</h4>
      <div className="flex items-baseline gap-1.5">
        <span className="text-neon-green/40 text-xs sm:text-sm font-black">$</span>
        <span className="text-xl sm:text-3xl font-digital font-bold text-white group-hover:text-neon-green transition-all duration-300">
          {new Intl.NumberFormat('pt-BR').format(value)}
        </span>
      </div>
    </div>
  );
};
