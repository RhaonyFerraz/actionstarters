import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { useCommercial } from '../../hooks/useCommercial';
import { Package, TrendingUp, ShoppingCart, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../ui/Button';

export const CommercialModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { skus: totalStock, currentPrice, sellProducts } = useCommercial();
  const [sellAmount, setSellAmount] = useState(1);
  const [isSelling, setIsSelling] = useState(false);

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
              <h4 className="text-2xl font-digital text-white">{formatCurrency(currentPrice)}</h4>
            </div>
          </div>
        </div>

        {/* Sell Form Card */}
        <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8 space-y-8 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShoppingCart size={20} className="text-[#3b82f6]" />
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
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#3b82f6] border border-white/5"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-6 flex justify-between items-center border border-white/5">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Previsão de Receita</p>
                <h4 className="text-3xl font-digital text-white tracking-tighter">
                  {formatCurrency(sellAmount * currentPrice)}
                </h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Prazo de Recebimento</p>
                <p className="text-xs text-white font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10 italic">2 Rodadas</p>
              </div>
            </div>

            <button 
              onClick={handleSell}
              disabled={sellAmount <= 0 || isSelling}
              className={cn(
                "w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale group relative overflow-hidden",
                "bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)]"
              )}
            >
              {isSelling ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Confirmar Faturamento</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info box Match */}
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex items-start gap-4 group">
            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest leading-relaxed">
              Nota: A venda de produtos gera "Contas a Receber". Verifique o fluxo de caixa no módulo Financeiro para garantir liquidez nas próximas rodadas.
            </p>
        </div>
      </div>
    </Modal>
  );
};
