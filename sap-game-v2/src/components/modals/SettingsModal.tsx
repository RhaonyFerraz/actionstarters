import React from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { ThemeStyle } from '../../types';
import { MonitorPlay, Briefcase, Mail, Lock, User as UserIcon, LogOut, Loader2, Cloud } from 'lucide-react';
import { cn } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useGameStore();
  const { user, login, register, logout, loading: loadingAuth } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [isRegister, setIsRegister] = React.useState(false);

  const handleSubmit = async () => {
    if (!email || !pass) return;
    try {
      if (isRegister) {
        await register(email, pass);
        addToast('success', 'Conta Criada', 'Sua conta de CEO foi registrada com sucesso!');
      } else {
        await login(email, pass);
        addToast('success', 'Acesso Autorizado', 'Bem-vindo de volta ao cockpit operacional, Diretor!');
      }
    } catch (e: any) {
      addToast('error', 'Falha na Autenticação', e.message);
    }
  };

  const themes: { id: ThemeStyle; name: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'modern-glass',
      name: 'Modern Cyber-Glass',
      desc: 'Transparência, neons vivos e desfoque elegante.',
      icon: <MonitorPlay size={32} />
    },
    {
      id: 'sap-blue',
      name: 'SAP Clássico',
      desc: 'Azul corporativo, seriedade e foco em dados.',
      icon: <Briefcase size={32} />
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SISTEMA & VISUAL">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-digital text-neon-green mb-4 border-b border-white/10 pb-2">
            Selecionar Estilo do Terminal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "flex flex-col items-center text-center p-6 rounded-xl border transition-all duration-300",
                    isActive 
                      ? "bg-white/10 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-gray-400"
                  )}
                >
                  <div className={cn("mb-4", isActive ? "text-neon-green" : "text-gray-400")}>
                    {t.icon}
                  </div>
                  <h4 className={cn("font-bold text-lg mb-2", isActive ? "text-white" : "text-gray-300")}>
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Firebase Authentication Section */}
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-xl font-digital text-neon-cyan mb-4 flex items-center gap-2">
            <Cloud size={20} className="text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
            Perfil Cloud (Sincronização)
          </h3>

          {!user ? (
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <p className="text-xs text-gray-400 mb-4 font-mono-neon italic">
                {isRegister ? "Crie sua conta global de CEO para salvar seu progresso." : "Entre com sua conta para restaurar seu saldo e inventário."}
              </p>
              
              <div className="space-y-3">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-neon-cyan transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="E-mail Operacional SAP"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-neon-cyan outline-none transition-all placeholder:text-gray-600" 
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-neon-cyan transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="Senha de Acesso"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-neon-cyan outline-none transition-all placeholder:text-gray-600" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={handleSubmit}
                  disabled={loadingAuth}
                  className="w-full py-3 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded-xl font-bold hover:bg-neon-cyan/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingAuth ? <Loader2 className="animate-spin" size={20} /> : (isRegister ? 'CRIAR ACESSO CEO' : 'AUTENTICAR LOGIN')}
                </button>
                <button 
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[10px] text-gray-500 uppercase font-bold text-center hover:text-gray-300 transition-colors"
                >
                  {isRegister ? 'Já possui conta? Clique para entrar' : 'Não tem conta? Clique para registrar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-neon-green/5 border border-neon-green/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-neon-green/20 border border-neon-green flex items-center justify-center text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                   <UserIcon size={24} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] text-neon-green font-bold uppercase tracking-widest">Sessão Ativa - CEO SAP B1</p>
                    <p className="text-white font-mono-neon text-sm">{user.email}</p>
                 </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl text-red-500 text-xs font-bold hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <LogOut size={16} /> LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
