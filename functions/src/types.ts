import * as admin from "firebase-admin";

export interface User {
  telegramId: string;
  coins: number;
  inviter: string | null;
  refferals: string[];
  rowLog: {
    count: number;
    lastDate: admin.firestore.Timestamp;
  };
  fragments: { [key: string]: string[] };
  treasures: string[];
  squadId: string | null;
  succsesQRs: string[];
}

export interface FragmentRoot {
  fragments: string[];
  rewardCoin: number;
  remainingCount: number | null;
}

export interface Squad {
  name: string;
  members: string[];
  inviter: string;
  sources: Record<string, Source[]>;
  date: admin.firestore.Timestamp;
  lastUpdate: admin.firestore.Timestamp;
}

export interface Source {
  id: string;
}

export interface Treasure {
  remainingCount: number;
  reward: number;
  userId: string;
}
