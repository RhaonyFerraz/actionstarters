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

  const sellProducts = (quantityToSell: number) => {
    if (quantityToSell <= 0 || quantityToSell > skus) {
      return { success: false, message: 'Estoque insuficiente ou quantidade inválida.' };
    }

    const price = getCurrentPrice();
    const totalRevenue = price * quantityToSell;

    // Executa atomicamente a venda
    removeInventory(quantityToSell);
    addBalance(totalRevenue);

    return { 
      success: true, 
      revenue: totalRevenue, 
      priceUnit: price,
      message: `Faturamento aprovado de R$ ${totalRevenue.toLocaleString('pt-BR')}`
    };
  };

  return {
    skus,
    currentPrice: getCurrentPrice(),
    commercialLevel: levels.commercial,
    sellProducts
  };
};
