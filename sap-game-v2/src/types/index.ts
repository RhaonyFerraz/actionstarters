export interface Debt {
  id: string;
  totalAmount: number;
  remainingInstallments: number;
  installmentValue: number;
  interestRate: number;
  createdAtRound: number;
}

export interface EmailMessage {
  id: string;
  subject: string;
  sender: string;
  content: string;
  read: boolean;
  timestampRound: number;
}

export interface Inventory {
  skus: number;
  machinery: number;
  bonusPoints: number;
}

export interface ModulesLevels {
  commercial: number;
  financial: number;
  marketing: number;
  hr: number;
  pcp: number;
  logistics: number;
}

export type ThemeStyle = 'modern-glass' | 'retro-2000' | 'terminal-hacker' | 'sap-blue' | 'high-tech-red';

export interface PlayerState {
  theme: ThemeStyle;
  balance: number;
  currentRound: number;
  inventory: Inventory;
  modulesLevels: ModulesLevels;
  debts: Debt[];
  inbox: EmailMessage[];
}
