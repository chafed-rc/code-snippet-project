import { create } from "zustand";

type SignUpStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useSignUp = create<SignUpStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
