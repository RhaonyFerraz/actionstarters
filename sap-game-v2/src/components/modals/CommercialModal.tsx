import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { useCommercial } from '../../hooks/useCommercial';
import { Package, TrendingUp, ShoppingCart, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../ui/Button';

export const CommercialModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { skus, currentRound } = useGameStore();
  const { sellProducts } = useCommercial();
  const [sellAmount, setSellAmount] = useState(1);
  const [isSelling, setIsSelling] = useState(false);

  const pricePerUnit = 2500;
  const totalStock = skus.length;

  const handleSell = async () => {
    if (sellAmount <= 0 || sellAmount > totalStock) return;
    setIsSelling(true);
    await sellProducts(sellAmount);
    setIsSelling(false);
    setSellAmount(1);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="DEPARTAMENTO COMERCIAL" centerTitle className="max-w-2xl">
      <div className="flex flex-col space-y-8">
        
        {/* Status Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Package size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-0.5">Estoque Disponível</p>
              <h4 className="text-2xl font-digital text-white">{totalStock} <span className="text-[10px] font-sans text-gray-400">UNIDADES</span></h4>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-0.5">Preço de Mercado</p>
              <h4 className="text-2xl font-digital text-white">{formatCurrency(pricePerUnit)}</h4>
            </div>
          </div>
        </div>

        {/* Sell Form Card */}
        <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8 space-y-8 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShoppingCart size={20} className="text-[#c026d3]" />
              Painel de Vendas
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Selecione a quantidade de produtos acabados para faturamento. O valor será convertido em um título a receber.
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Quantidade</label>
                <span className="text-xs text-gray-500 font-bold">{sellAmount} de {totalStock} selecionados</span>
              </div>
              <input 
                type="range"
                min="0"
                max={totalStock}
                value={sellAmount}
                onChange={(e) => setSellAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#c026d3] border border-white/5"
              />
            </div>
            
            <Button 
              variant="neon" 
              className="h-[52px] px-8 text-sm group" 
              onClick={handleSell}
              disabled={skus < 1 || sellAmount < 1 || sellAmount > skus}
            >
              Faturar {formatBRL(currentPrice * (sellAmount || 0))}
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
