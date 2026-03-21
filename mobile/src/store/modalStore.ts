import { router } from "expo-router";
import { create } from "zustand";

interface ModalStore {
  open: boolean;
  closing: boolean;
  body: React.ReactNode | null;
  title?: string;
  onClose: () => void;
  finalizeClose: () => void;
  resetModal: () => void;
  onOpen: (body: React.ReactNode, title?: string) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  open: false,
  closing: false,
  body: null,
  title: undefined,
  onClose: () => {
    set({ open: false, closing: true });
  },
  finalizeClose: () => {
    if (router.canDismiss()) {
      router.dismiss();
    } else if (router.canGoBack()) {
      router.back();
    }

    set({ open: false, closing: false, body: null, title: undefined });
  },
  resetModal: () => {
    set({ open: false, closing: false, body: null, title: undefined });
  },
  onOpen: (body, title) => {
    set({ open: true, closing: false, body, title });
    router.push("/modal");
  },
}));
