import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCommercial } from '../../hooks/useCommercial';
import { useToast } from '../../hooks/useToast';

export const CommercialModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { skus, currentPrice, commercialLevel, sellProducts } = useCommercial();
  const { addToast } = useToast();
  const [sellAmount, setSellAmount] = useState<number>(1);

  const handleSell = () => {
    const result = sellProducts(sellAmount);
    
    if (result.success) {
      addToast('success', 'Venda Concluída', result.message || 'Produto faturado com sucesso.');
      setSellAmount(1);
    } else {
      addToast('error', 'Falha na Venda', result.message || 'Não foi possível concluir o faturamento.');
    }
  };

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Departamento Comercial">
      <div className="space-y-6">
        
        {/* Market Status Bar */}
        <div className="bg-black/60 rounded-xl p-6 border border-neon-green/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-green/40 shadow-[0_0_10px_rgba(57,255,20,0.4)]" />
          <div>
            <p className="text-xs text-neon-green/60 uppercase tracking-[0.2em] font-mono-neon font-bold">Estoque Disponível</p>
            <h3 className="text-4xl font-digital font-bold text-white mt-1 neon-text">{skus} <span className="text-xs font-normal opacity-50 tracking-normal">UN</span></h3>
          </div>
          <div className="text-right border-l border-white/10 pl-8">
            <p className="text-xs text-neon-cyan/60 uppercase tracking-[0.2em] font-mono-neon font-bold">Preço de Mercado</p>
            <h3 className="text-2xl font-digital font-bold mt-1 text-neon-cyan tracking-tight">{formatBRL(currentPrice)}<span className="text-xs text-white/30 font-normal tracking-normal ml-1">/un</span></h3>
          </div>
        </div>

        {/* Sell Form */}
        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
          <h4 className="font-digital text-sm text-white border-b border-white/5 pb-3 mb-4 tracking-widest uppercase opacity-80">Despacho de Mercadorias</h4>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Selecione o volume de SKUs para escoar do seu estoque e injetar liquidez na empresa.
            Nível atual do setor Comercial: <strong className="text-neon-green">Lv {commercialLevel}</strong>.
          </p>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Quantidade para Venda</label>
              <input 
                type="number" 
                min={1}
                max={skus || 1}
                value={sellAmount}
                onChange={(e) => setSellAmount(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 outline-none font-digital text-xl text-white transition-all shadow-inner"
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
