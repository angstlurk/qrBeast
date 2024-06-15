import { create } from "zustand";

interface QRBeastState {
  processedLink: string | null;
  setExecuting: (executing: boolean) => void;
  executing: boolean;
  changeLink: (link: string | null) => void;
}

export const useQRBeastState = create<QRBeastState>((set) => ({
  executing: false,
  setExecuting: (executing: boolean) => set({ executing }),
  processedLink: null,
  changeLink: (link: string | null) => set({ processedLink: link }),
}));
