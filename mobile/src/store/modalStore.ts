import { create } from "zustand";

interface ModalStore {
  open: boolean;
  body: React.ReactNode | null;
  title?: string;
  transparent?: boolean;
  onClose: () => void;
  onOpen: (
    body: React.ReactNode,
    title?: string,
    transparent?: boolean
  ) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  open: false,
  body: null,
  title: undefined,
  transparent: false,
  onClose: () => set({ open: false, body: null, title: undefined }),
  onOpen: (body, title, transparent = false) =>
    set({ open: true, body, title, transparent }),
}));
