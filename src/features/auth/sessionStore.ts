import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { MockManagerSession } from './types';

interface ManagerSessionState {
  session: MockManagerSession | null;
  signIn: (session: MockManagerSession) => void;
  signOut: () => void;
}

export const useManagerSession = create<ManagerSessionState>()(
  persist(
    (set) => ({
      session: null,
      signIn: (session) => set({ session }),
      signOut: () => set({ session: null })
    }),
    {
      name: 'operations-manager-demo-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ session: state.session })
    }
  )
);
