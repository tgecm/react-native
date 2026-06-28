import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types';
import { getStorage } from './storage';

interface AuthStore {
  token: string | null;
  user: User | null;
  isSuperadmin: boolean;
  isStaff: boolean;
  login: (token: string, user: User, isStaff?: boolean) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const mmkvStorage = createJSONStorage(() => ({
  getItem: (key: string) => getStorage().getString(key) ?? null,
  setItem: (key: string, value: string) => getStorage().set(key, value),
  removeItem: (key: string) => getStorage().delete(key),
}));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isSuperadmin: false,
      isStaff: false,
      login: (token: string, user: User, isStaff = false) => {
        set({ token, user, isSuperadmin: user.is_superadmin, isStaff });
      },
      logout: () => {
        const storage = getStorage();
        storage.clearAll();
        set({ token: null, user: null, isSuperadmin: false, isStaff: false });
      },
      setUser: (user: User) => set({ user, isSuperadmin: user.is_superadmin }),
    }),
    {
      name: 'auth-storage',
      storage: mmkvStorage,
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
      }),
    },
  ),
);
