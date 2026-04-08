import React, { useState } from 'react';
import { useAdminData, PlayerSaveRecord } from '../hooks/useAdminData';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import {
  Users, RefreshCw, Trash2, Edit3, Check, X, LogOut,
  DollarSign, Shield, AlertCircle, ChevronDown, ChevronUp,
  Database, BarChart3, Crown, Activity
} from 'lucide-react';

// ─── Lista de e-mails com acesso admin ───────────────────────────────────────
const ADMIN_EMAILS = [
  'rhaonyferraz@gmail.com',
  'admin@sap-game.com',
  'rhaony@actionstarters.com.br',
];

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ─── Linha de edição de saldo ─────────────────────────────────────────────────
const BalanceEditor: React.FC<{
  player: PlayerSaveRecord;
  onSave: (uid: string, val: number) => Promise<void>;
}> = ({ player, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(player.balance));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(player.uid, Number(val));
    setSaving(false);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-digital text-neon-green text-lg tracking-tight">
          {fmt(player.balance)}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="text-gray-500 hover:text-white transition-colors"
          title="Editar saldo"
        >
          <Edit3 size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-32 bg-black/60 border border-neon-green/40 rounded px-2 py-0.5 text-neon-green text-sm font-digital outline-none focus:border-neon-green"
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="text-neon-green hover:text-white p-1"
      >
        <Check size={13} />
      </button>
      <button onClick={() => setEditing(false)} className="text-red-500 hover:text-white p-1">
        <X size={13} />
      </button>
    </div>
  );
};

// ─── Card de jogador ──────────────────────────────────────────────────────────
const PlayerCard: React.FC<{
  player: PlayerSaveRecord;
  rank: number;
  onReset: (uid: string) => Promise<void>;
  onDelete: (uid: string) => Promise<void>;
  onEditBalance: (uid: string, val: number) => Promise<void>;
}> = ({ player, rank, onReset, onDelete, onEditBalance }) => {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState<'reset' | 'delete' | null>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (action: 'reset' | 'delete') => {
    setBusy(true);
    if (action === 'reset') await onReset(player.uid);
    else await onDelete(player.uid);
    setBusy(false);
    setConfirming(null);
  };

  const moduleAvg = Math.round(
    Object.values(player.modulesLevels).reduce((a, b) => a + b, 0) /
    Object.values(player.modulesLevels).length
  );

  const rankColor =
    rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-orange-400' : 'text-gray-600';

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300">
      {/* Row */}
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Rank */}
        <span className={`font-digital text-2xl w-8 text-center shrink-0 ${rankColor}`}>
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
        </span>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center shrink-0">
          <span className="text-neon-green font-bold text-lg uppercase">
            {player.email[0]}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{player.email}</p>
          <p className="text-gray-500 text-[10px] font-mono truncate">UID: {player.uid}</p>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <BalanceEditor player={player} onSave={onEditBalance} />
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Rodada</p>
            <p className="font-digital text-neon-cyan text-lg">{player.currentRound}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">SKUs</p>
            <p className="font-digital text-white text-lg">{player.inventory.skus}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Módulos</p>
            <p className="font-digital text-white text-lg">Lv.{moduleAvg}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Dívidas</p>
            <p className={`font-digital text-lg ${player.debts.length > 0 ? 'text-red-400' : 'text-gray-600'}`}>
              {player.debts.length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {confirming === 'reset' ? (
            <>
              <button onClick={() => handle('reset')} disabled={busy} className="text-[10px] bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-500/30">
                Confirmar Reset
              </button>
              <button onClick={() => setConfirming(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
            </>
          ) : confirming === 'delete' ? (
            <>
              <button onClick={() => handle('delete')} disabled={busy} className="text-[10px] bg-red-500/20 border border-red-500 text-red-400 px-2 py-1 rounded hover:bg-red-500/30">
                Confirmar Exclusão
              </button>
              <button onClick={() => setConfirming(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirming('reset')}
                title="Resetar save"
                className="p-1.5 text-yellow-500/60 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setConfirming('delete')}
                title="Deletar jogador"
                className="p-1.5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-6 pb-5 border-t border-white/5 pt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Módulos */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <h4 className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-bold">Módulos SAP</h4>
              <div className="space-y-1.5">
                {Object.entries(player.modulesLevels).map(([mod, lvl]) => (
                  <div key={mod} className="flex justify-between items-center">
                    <span className="text-[11px] text-gray-400 capitalize">{mod}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-3 h-1.5 rounded-sm ${i <= lvl ? 'bg-neon-green' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventário */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <h4 className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-bold">Inventário</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-[11px] text-gray-400">SKUs</span><span className="font-digital text-white text-sm">{player.inventory.skus}</span></div>
                <div className="flex justify-between"><span className="text-[11px] text-gray-400">Maquinário</span><span className="font-digital text-white text-sm">{player.inventory.machinery}</span></div>
                <div className="flex justify-between"><span className="text-[11px] text-gray-400">Bônus Pts</span><span className="font-digital text-white text-sm">{player.inventory.bonusPoints}</span></div>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <h4 className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-bold">Metadados</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-[11px] text-gray-400">Dívidas</span><span className={`font-bold text-sm ${player.debts.length ? 'text-red-400' : 'text-gray-600'}`}>{player.debts.length}</span></div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-gray-400">Último Save</span>
                  <span className="text-[10px] text-gray-500 font-mono">{player.lastSavedAt.replace('T', ' ').slice(0, 19)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Página Principal ─────────────────────────────────────────────────────────
export const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const { players, loading, error, refetch, resetPlayer, deletePlayer, editBalance } = useAdminData();
  const [search, setSearch] = useState('');

  // Guarda de segurança: somente admins
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return <Navigate to="/" />;
  }

  const filtered = players.filter(p =>
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.uid.toLowerCase().includes(search.toLowerCase())
  );

  const totalBalance = players.reduce((s, p) => s + p.balance, 0);
  const avgRound = players.length
    ? Math.round(players.reduce((s, p) => s + p.currentRound, 0) / players.length)
    : 0;
  const playersInDebt = players.filter(p => p.debts.length > 0).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
              <Shield size={16} className="text-neon-green" />
            </div>
            <div>
              <span className="font-digital text-white text-sm tracking-widest">SAP ADMIN</span>
              <span className="text-[10px] text-gray-600 block font-mono">Control Center v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-neon-green/5 border border-neon-green/20 rounded-full px-3 py-1">
              <Crown size={12} className="text-neon-green" />
              <span className="text-[11px] text-neon-green font-bold">{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-[11px] text-gray-500 hover:text-white transition-colors"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Jogadores', value: players.length, icon: <Users size={20} />, color: 'text-neon-cyan', sub: 'cadastros ativos' },
            { label: 'Saldo Total', value: fmt(totalBalance), icon: <DollarSign size={20} />, color: 'text-neon-green', sub: 'em circulação' },
            { label: 'Rodada Média', value: avgRound, icon: <Activity size={20} />, color: 'text-white', sub: 'progresso médio' },
            { label: 'Em Dívida', value: playersInDebt, icon: <AlertCircle size={20} />, color: 'text-red-400', sub: 'jogadores endividados' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-black/40 border border-white/8 rounded-2xl p-5 flex flex-col gap-3 hover:border-white/15 transition-all">
              <div className={`${kpi.color} opacity-60`}>{kpi.icon}</div>
              <div>
                <p className={`font-digital text-2xl ${kpi.color}`}>{kpi.value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{kpi.label}</p>
                <p className="text-[10px] text-gray-600">{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-gray-500" />
            <h2 className="font-digital text-white tracking-widest text-sm uppercase">
              Ranking de Jogadores
            </h2>
            <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-gray-500 font-mono">
              {filtered.length}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por e-mail ou UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 sm:w-72 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-white/30 transition-all"
            />
            <button
              onClick={refetch}
              className="flex items-center gap-2 bg-neon-green/10 border border-neon-green/20 hover:bg-neon-green/20 text-neon-green px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:block">Atualizar</span>
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-neon-green/30 border-t-neon-green animate-spin" />
            <p className="text-gray-500 font-digital tracking-widest text-sm animate-pulse">
              CARREGANDO BANCO DE DADOS...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-red-950/30 border border-red-500/30 rounded-2xl p-6 text-red-400">
            <AlertCircle size={20} />
            <div>
              <p className="font-bold text-sm">Erro ao acessar Firestore</p>
              <p className="text-[12px] text-red-500/70 font-mono mt-0.5">{error}</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Database size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-600 font-digital tracking-widest text-sm">
              {search ? 'NENHUM JOGADOR ENCONTRADO' : 'NENHUM SAVE REGISTRADO'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((player, i) => (
              <PlayerCard
                key={player.uid}
                player={player}
                rank={i + 1}
                onReset={resetPlayer}
                onDelete={deletePlayer}
                onEditBalance={editBalance}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
