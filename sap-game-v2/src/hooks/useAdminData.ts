import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export interface PlayerSaveRecord {
  uid: string;
  email: string;
  balance: number;
  currentRound: number;
  lastSavedAt: string;
  inventory: { skus: number; machinery: number; bonusPoints: number };
  modulesLevels: { financial: number; marketing: number; hr: number; pcp: number; logistics: number };
  debts: any[];
}

export const useAdminData = () => {
  const [players, setPlayers] = useState<PlayerSaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'player_saves'));
      const data: PlayerSaveRecord[] = snapshot.docs.map((d) => ({
        uid: d.id,
        email: d.data().email ?? 'sem-email',
        balance: d.data().balance ?? 0,
        currentRound: d.data().currentRound ?? 1,
        lastSavedAt: d.data().lastSavedAt ?? '—',
        inventory: d.data().inventory ?? { skus: 0, machinery: 0, bonusPoints: 0 },
        modulesLevels: d.data().modulesLevels ?? { financial: 1, marketing: 1, hr: 1, pcp: 1, logistics: 1 },
        debts: d.data().debts ?? [],
      }));
      // Ordena por saldo decrescente (ranking)
      data.sort((a, b) => b.balance - a.balance);
      setPlayers(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const resetPlayer = async (uid: string) => {
    const docRef = doc(db, 'player_saves', uid);
    await setDoc(docRef, {
      balance: 50000,
      currentRound: 1,
      inventory: { skus: 0, machinery: 0, bonusPoints: 0 },
      modulesLevels: { financial: 1, marketing: 1, hr: 1, pcp: 1, logistics: 1 },
      debts: [],
      lastSavedAt: new Date().toISOString(),
    }, { merge: true });
    await fetchPlayers();
  };

  const deletePlayer = async (uid: string) => {
    await deleteDoc(doc(db, 'player_saves', uid));
    await fetchPlayers();
  };

  const editBalance = async (uid: string, newBalance: number) => {
    await setDoc(doc(db, 'player_saves', uid), { balance: newBalance }, { merge: true });
    await fetchPlayers();
  };

  return { players, loading, error, refetch: fetchPlayers, resetPlayer, deletePlayer, editBalance };
};
