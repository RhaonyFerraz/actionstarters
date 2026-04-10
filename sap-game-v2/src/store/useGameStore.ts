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
  payFinancialNote: (id: string) => void;
  collectFinancialNote: (id: string) => void;
  addFinancialNote: (note: Omit<FinancialNote, 'id' | 'status'>) => void;
}

const initialState: PlayerState = {
  theme: 'modern-glass',
  balance: 50000,
  currentRound: 1,
  inventory: { 
    skus: 750, 
    galpao: 5000, 
    machinery: 8000, 
    supplies: 800, 
    rawMaterial: 0, 
    finishedGoods: 750, 
    vehicles: 0, 
    bonusPoints: 0 
  },
  modulesLevels: {
    commercial: 1,
    financial: 1,
    marketing: 1,
    hr: 1,
    pcp: 1,
    logistics: 1,
  },
  debts: [],
  financialNotes: [
    {
      id: 'fin-01',
      title: 'Energia & Cloud (AWS)',
      description: 'Custo fixo de infraestrutura tecnológica.',
      amount: 450,
      dueRound: 2,
      type: 'payable',
      status: 'pending'
    },
    {
      id: 'fin-02',
      title: 'Faturamento Venda #1042',
      description: 'Recebimento de venda a prazo (30 dias).',
      amount: 12500,
      dueRound: 4,
      type: 'receivable',
      status: 'pending'
    },
    {
      id: 'fin-03',
      title: 'Impostos (DAS/Simples)',
      description: 'Recolhimento tributário mensal.',
      amount: 2100,
      dueRound: 5,
      type: 'payable',
      status: 'pending'
    },
    {
      id: 'fin-04',
      title: 'Crédito de Consultoria',
      description: 'Reembolso de serviço não prestado.',
      amount: 800,
      dueRound: 1,
      type: 'receivable',
      status: 'pending'
    }
  ],
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
  }),

  payFinancialNote: (id) => set((state) => {
    const note = state.financialNotes.find(n => n.id === id);
    if (!note || state.balance < note.amount) return state;
    return {
      balance: state.balance - note.amount,
      financialNotes: state.financialNotes.map(n => n.id === id ? { ...n, status: 'paid' } : n)
    };
  }),

  collectFinancialNote: (id) => set((state) => {
    const note = state.financialNotes.find(n => n.id === id);
    if (!note) return state;
    return {
      balance: state.balance + note.amount,
      financialNotes: state.financialNotes.map(n => n.id === id ? { ...n, status: 'paid' } : n)
    };
  }),
  
  addFinancialNote: (noteData) => set((state) => ({
    financialNotes: [
      ...state.financialNotes,
      {
        ...noteData,
        id: `fin-${crypto.randomUUID().split('-')[0]}`,
        status: 'pending'
      }
    ]
  }))
}));
