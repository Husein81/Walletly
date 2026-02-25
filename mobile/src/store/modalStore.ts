import { router } from "expo-router";
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
    transparent?: boolean,
  ) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  open: false,
  body: null,
  title: undefined,
  transparent: false,
  onClose: () => {
    set({ open: false });
    if (router.canGoBack()) {
      router.back();
    }
    setTimeout(() => {
      set({ body: null, title: undefined });
    }, 400);
  },
  onOpen: (body, title, transparent = false) => {
    set({ open: true, body, title, transparent });
    router.push("/modal");
  },
}));
