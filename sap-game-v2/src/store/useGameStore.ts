import { create } from 'zustand';
import { PlayerState, Debt, EmailMessage, ModulesLevels } from '../types';

interface GameStore extends PlayerState {
  // Actions
  setTheme: (theme: PlayerState['theme']) => void;
  addBalance: (amount: number) => void;
  removeBalance: (amount: number) => void;
  advanceRound: () => void;
  addDebt: (debt: Omit<Debt, 'id' | 'createdAtRound'>) => void;
  payDebtInstallment: (debtId: string) => void;
  addInventory: (skus: number) => void;
  removeInventory: (skus: number) => void;
  addEmail: (email: Omit<EmailMessage, 'id' | 'read'>) => void;
  markEmailAsRead: (emailId: string) => void;
  upgradeModule: (moduleName: keyof ModulesLevels, cost: number) => void;
}

const initialState: PlayerState = {
  theme: 'modern-glass',
  balance: 50000,
  currentRound: 1,
  inventory: { skus: 0, machinery: 0, bonusPoints: 0 },
  modulesLevels: {
    commercial: 1,
    financial: 1,
    marketing: 1,
    hr: 1,
    pcp: 1,
    logistics: 1,
  },
  debts: [],
  inbox: [
    {
      id: 'welcome-01',
      sender: 'board@sap-game.com',
      subject: 'Bem-vindo ao SAP ERP Board Game',
      content: 'Parabéns por assumir a nova empresa! Sua missão é organizar as vendas e se manter líquido pagando os impostos em dia. Adquira ferramentas, expanda consultorias e ganhe o mercado.',
      read: false,
      timestampRound: 1
    }
  ]
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  
  setTheme: (theme) => set({ theme }),

  addBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
  
  removeBalance: (amount) => set((state) => ({ balance: state.balance - amount })),
  
  advanceRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),
  
  addDebt: (debtInfo) => set((state) => {
    const newDebt: Debt = {
      ...debtInfo,
      id: crypto.randomUUID(),
      createdAtRound: state.currentRound,
    };
    return { debts: [...state.debts, newDebt] };
  }),
  
  payDebtInstallment: (debtId) => set((state) => {
    const debtIndex = state.debts.findIndex(d => d.id === debtId);
    if (debtIndex === -1) return state;
    
    const debt = state.debts[debtIndex];
    
    // Simples check de segurança, mas a UI deve impedir isso também
    if (state.balance < debt.installmentValue) return state; 
    
    const updatedDebt = { 
      ...debt, 
      remainingInstallments: debt.remainingInstallments - 1, 
      totalAmount: debt.totalAmount - debt.installmentValue 
    };
    
    let newDebts = [...state.debts];
    if (updatedDebt.remainingInstallments <= 0) {
      newDebts.splice(debtIndex, 1);
    } else {
      newDebts[debtIndex] = updatedDebt;
    }

    return {
      balance: state.balance - debt.installmentValue,
      debts: newDebts
    };
  }),

  addInventory: (amount) => set((state) => ({ 
    inventory: { ...state.inventory, skus: state.inventory.skus + amount } 
  })),

  removeInventory: (amount) => set((state) => ({ 
    inventory: { ...state.inventory, skus: Math.max(0, state.inventory.skus - amount) } 
  })),

  addEmail: (emailData) => set((state) => ({
    inbox: [{ ...emailData, id: crypto.randomUUID(), read: false }, ...state.inbox]
  })),

  markEmailAsRead: (emailId) => set((state) => ({
    inbox: state.inbox.map(em => em.id === emailId ? { ...em, read: true } : em)
  })),

  upgradeModule: (moduleName, cost) => set((state) => {
    if (state.balance < cost) return state;
    return {
      balance: state.balance - cost,
      modulesLevels: {
        ...state.modulesLevels,
        [moduleName]: state.modulesLevels[moduleName] + 1
      }
    };
  })
}));
