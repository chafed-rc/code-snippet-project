import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  username: string;
  email: string;
  userid: number;
};

type AuthStore = {
  isLoggedIn: boolean;
  loading: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => void;
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      loading: true, 
      user: null,
      token: null,
      login: (user, token) =>
        set({ isLoggedIn: true, user, token, loading: false }),
      logout: () =>
        set({ isLoggedIn: false, user: null, token: null, loading: false }),
      setLoading: (loading) => set({ loading }),
      checkAuth: () => {
        set({ loading: true });
        const storedState = get().token;
        if (storedState) {
          setTimeout(() => {
            set({ loading: false, isLoggedIn: true });
          }, 1000);
        } else {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

useAuth.getState().checkAuth();
