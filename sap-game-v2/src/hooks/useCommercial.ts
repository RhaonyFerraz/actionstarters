import { useGameStore } from '../store/useGameStore';

export const useCommercial = () => {
  const skus = useGameStore((state) => state.inventory.skus);
  const removeInventory = useGameStore((state) => state.removeInventory);
  const addBalance = useGameStore((state) => state.addBalance);
  const levels = useGameStore((state) => state.modulesLevels);

  // Preço base de mercado para Venda Unitária do Produto (SKU)
  const BASE_PRICE = 2500;

  // Lógica de Margem: Ter o setor Comercial com Nível Alto eleva o preço de venda.
  const getCurrentPrice = () => BASE_PRICE + (levels.commercial * 300);

    const totalRevenue = price * quantityToSell;
    const currentRound = useGameStore.getState().currentRound;

    // Executa atomicamente a venda
    removeInventory(quantityToSell);
    
    // Em vez de dinheiro imediato, gera uma "Conta a Receber" (SAP Invoicing)
    useGameStore.getState().addFinancialNote({
      title: `Venda de ${quantityToSell} SKU(s)`,
      description: `Faturamento de mercadoria efetuado. Aguardando processamento bancário.`,
      amount: totalRevenue,
      dueRound: currentRound + 2, // Recebe em 2 rodadas
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
