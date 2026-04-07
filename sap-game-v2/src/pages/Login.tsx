import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Briefcase, Github } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register, loginWithGitHub, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginFlow, setIsLoginFlow] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isLoginFlow) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/'); 
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('CONFIGURATION_NOT_FOUND')) {
        setErrorMsg('ERRO: O Firebase não está configurado no Console. Use o Modo Desenvolvedor abaixo.');
      } else {
        setErrorMsg('Falha na Autenticação. Verifique os dados ou se já possui cadastro.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await loginWithGitHub();
      navigate('/');
    } catch (err: any) {
      if (err.message?.includes('CONFIGURATION_NOT_FOUND')) {
        setErrorMsg('GitHub ainda não configurado no console. Use o Modo Desenvolvedor abaixo.');
      } else {
        setErrorMsg('Falha ao autenticar com GitHub. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sap-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-sap-blue rounded-full mb-4">
            <Briefcase size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-sap-dark">SAP Board Game</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Simulação de Gestão Empresarial V2
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-xs border border-red-100 font-bold text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-tight">E-mail Corporativo</label>
              <input 
                type="email" 
                required={!isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sap-blue/20 outline-none transition-all text-sm"
                placeholder="ceo@empresa.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-tight">Senha de Acesso</label>
              <input 
                type="password" 
                required={!isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sap-blue/20 outline-none transition-all text-sm"
              />
            </div>

            <Button type="submit" className="w-full h-10 text-sm font-bold shadow-md" disabled={isLoading}>
              {isLoading ? 'Aguarde...' : (isLoginFlow ? 'ENTRAR NO SISTEMA' : 'CRIAR CONTA')}
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-bold text-gray-400">
              <span className="px-2 bg-white">Alternativas</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="h-10 bg-[#24292F] hover:bg-[#24292F]/90 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <Github size={16} />
              GitHub
            </button>

            <button 
              type="button"
              onClick={() => {
                loginAsDemo();
                navigate('/');
              }}
              disabled={isLoading}
              className="h-10 bg-sap-blue hover:bg-sap-blue/90 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
            >
              Modo Demo
            </button>
          </div>

          <div className="text-center mt-6">
            <button 
              type="button" 
              onClick={() => setIsLoginFlow(!isLoginFlow)}
              className="text-[10px] text-gray-500 hover:text-sap-blue font-bold uppercase underline underline-offset-4 transition-colors"
            >
              {isLoginFlow ? 'Cadastre sua Empresa (CEO)' : 'Já possui acesso? Clique aqui'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
