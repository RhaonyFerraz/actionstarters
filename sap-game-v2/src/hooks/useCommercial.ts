import { useGameStore } from '../store/useGameStore';

export const useCommercial = () => {
  const skus = useGameStore((state) => state.inventory.skus);
  const removeInventory = useGameStore((state) => state.removeInventory);
  const addBalance = useGameStore((state) => state.addBalance);
  const levels = useGameStore((state) => state.modulesLevels);

  const BASE_PRICE = 2500;

  const getCurrentPrice = () => BASE_PRICE + (levels.commercial * 300);

  const sellProducts = (quantityToSell: number) => {
    const price = getCurrentPrice();
    const totalRevenue = price * quantityToSell;
    const currentRound = useGameStore.getState().currentRound;

    removeInventory(quantityToSell);
    
    useGameStore.getState().addFinancialNote({
      title: `Venda de ${quantityToSell} SKU(s)`,
      description: `Faturamento de mercadoria efetuado. Aguardando processamento bancário.`,
      amount: totalRevenue,
      dueRound: currentRound + 2,
      type: 'receivable'
    });

    return { 
      success: true, 
      revenue: totalRevenue, 
      priceUnit: price,
      message: `Mercadoria faturada: R$ ${totalRevenue.toLocaleString('pt-BR')}. Título gerado no Financeiro.`
    };
  };

  return {
    skus,
    currentPrice: getCurrentPrice(),
    commercialLevel: levels.commercial,
    sellProducts
  };
};
