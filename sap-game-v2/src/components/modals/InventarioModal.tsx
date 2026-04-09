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
          <AssetCard title="Estoque Matéria-prima" value={inventory.rawMaterial} />
          <AssetCard title="inventory_finished_goods" value={inventory.finishedGoods} />
          <AssetCard title="Frota de Veículos" value={inventory.vehicles} />
        </div>

        {/* Totalizer (Purple Glow) */}
        <div className={cn(
          "w-full rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center transition-all duration-500",
          "bg-black/40 border-2 border-magenta-500/30 shadow-[0_0_30px_rgba(255,0,255,0.15)]",
          "hover:shadow-[0_0_40px_rgba(255,0,255,0.25)] hover:border-magenta-500/50"
        )} style={{ borderColor: 'rgba(255, 0, 255, 0.3)' }}>
           <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-magenta-400 mb-2">Total do Inventário</p>
           <div className="flex items-baseline gap-2">
             <span className="text-magenta-500 font-bold text-xl sm:text-2xl">$</span>
             <span className="text-3xl sm:text-5xl font-digital font-bold text-white neon-text">{formatCurrency(totalInventoryValue)}</span>
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
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 group hover:bg-[#222] transition-colors">
      <h4 className="text-[10px] sm:text-xs text-center font-bold text-gray-400 uppercase tracking-widest leading-tight">{title}</h4>
      <div className="flex items-baseline gap-1">
        <span className="text-neon-green/60 text-xs sm:text-sm font-bold">$</span>
        <span className="text-xl sm:text-2xl font-digital font-bold text-white group-hover:text-neon-green transition-colors">
          {new Intl.NumberFormat('pt-BR').format(value)}
        </span>
      </div>
    </div>
  );
};
