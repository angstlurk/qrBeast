import { create } from "zustand";

interface QRBeastState {
  processedLink: string | null;
  setExecuting: (executing: boolean) => void;
  executing: boolean;
  processedLinkIsEqualExist: boolean;
  clearProcessedLinkIsEqual: () => void;
  changeLink: (link: string | null) => void;
}

export const useQRBeastState = create<QRBeastState>((set) => ({
  executing: false,
  setExecuting: (executing: boolean) => set({ executing }),
  processedLink: null,
  processedLinkIsEqualExist: false,
  clearProcessedLinkIsEqual: () => set({ processedLinkIsEqualExist: false }),
  changeLink: (link: string | null) => {
    set((state) => ({
      processedLink: link,
      processedLinkIsEqualExist: state.processedLink === link,
    }));
  },
}));
