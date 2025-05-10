import { create } from "zustand";

interface ModalStore {
  open: boolean;
  body: React.ReactNode | null;
  title?: string;
  onClose: () => void;
  onOpen: (body: React.ReactNode, title?: string) => void;
}

const useModalStore = create<ModalStore>((set) => ({
  open: false,
  body: null,
  title: undefined,
  onClose: () => set({ open: false, body: null, title: undefined }),
  onOpen: (body, title) => set({ open: true, body, title }),
}));

export default useModalStore;
