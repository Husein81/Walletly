import { router } from "expo-router";
import { create } from "zustand";

interface BottomSheetStore {
  body: React.ReactNode | null;
  onClose: () => void;
  onOpen: (body: React.ReactNode) => void;
}

export const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  body: null,
  onClose: () => {
    router.back();
    setTimeout(() => {
      set({ body: null });
    }, 200);
  },
  onOpen: (body) => {
    set({ body });
    router.push("/bottom-sheet");
  },
}));
