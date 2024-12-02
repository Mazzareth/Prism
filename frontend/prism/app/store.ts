// app/store.ts
import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import { User } from '@/app/services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (userData: User) => Promise<void>;
  logout: () => void;
}


export type Store = ReturnType<typeof useStore>;

// Create a custom partialize function

const partialize = (state: AuthState): AuthState => ({ ...state});

type MyPersistOptions = PersistOptions<AuthState, AuthState>;

export const useStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoginModalOpen: false,
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
      login: async (userData: User) => {
        try {
          set({
            isAuthenticated: true,
            user: userData,
            accessToken: userData.access_token,
            refreshToken: userData.refresh_token,
            isLoginModalOpen: false,
          });
          console.log('User logged in:', userData);
        } catch (error) {
          console.error('Error logging in:', error);
          throw error; // Re-throw for error boundary handling
        }
      },
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name: string): AuthState | null  => {
          const storedState = localStorage.getItem(name);
          return storedState ? (JSON.parse(storedState) as AuthState) : null; // type cast to ensure type safety after parsing from a string
        },
        setItem: (name: string, state: AuthState) => localStorage.setItem(name, JSON.stringify(state)),
        removeItem: (name: string) => localStorage.removeItem(name),
      },
      partialize, //  Include the partialize function here!!
      } as unknown as MyPersistOptions // This type assertion is necessary to bypass type limitations
    )
  );