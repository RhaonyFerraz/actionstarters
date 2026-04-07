import { useGameStore } from '../store/useGameStore';

/**
 * Hook customizado com toda a lógica de negócios bancária,
 * isolando do componente visual (BankModal.tsx)
 */
export const useBank = () => {
  const balance = useGameStore((state) => state.balance);
  const debts = useGameStore((state) => state.debts);
  const addBalance = useGameStore((state) => state.addBalance);
  const addDebt = useGameStore((state) => state.addDebt);
  const payDebtInstallment = useGameStore((state) => state.payDebtInstallment);
  
  // Constantes de mercado
  const MAX_LOAN = 150000;
  const MONTHLY_INTEREST = 0.05; // 5% ao turno

  const takeLoan = (amount: number, installments: number) => {
    if (amount <= 0 || amount > MAX_LOAN) return false;
    if (installments < 1 || installments > 12) return false;

    // Cálculo simples de juros compostos ou pré-fixado
    const totalToPay = amount * Math.pow((1 + MONTHLY_INTEREST), installments);
    const installmentValue = totalToPay / installments;

    // Efetiva a transação no Zustand
    addBalance(amount);
    
    addDebt({
      totalAmount: totalToPay,
      remainingInstallments: installments,
      installmentValue: installmentValue,
      interestRate: MONTHLY_INTEREST,
    });

    return true;
  };

  const payInstallment = (debtId: string) => {
    payDebtInstallment(debtId);
  };

  return {
    balance,
    debts,
    takeLoan,
    payInstallment,
    marketParams: {
      maxLoan: MAX_LOAN,
      interestRate: MONTHLY_INTEREST
    }
  };
};
