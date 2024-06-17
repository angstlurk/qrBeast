import { create } from "zustand";
import { InitUserResponse } from "functions/src/index";

type Reward =
  | {
      reward: InitUserResponse;
      showReward: boolean;
    }
  | { reward: null; showReward: false };

interface QRBeastState {
  processedLink: string | null;
  setExecuting: (executing: boolean) => void;
  executing: boolean;
  processedLinkIsEqualExist: boolean;
  clearProcessedLinkIsEqual: () => void;
  changeLink: (link: string | null) => void;

  reward: Reward;
  setReward: (reward: Reward) => void;
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

  reward: {
    reward: null,
    showReward: false,
  },
  setReward: (reward: Reward) => set({ reward }),
}));
