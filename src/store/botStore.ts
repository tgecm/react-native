import { create } from 'zustand';
import { Bot } from '../types';
import { getStorage } from './storage';

interface BotStore {
  bots: Bot[];
  botsLoaded: boolean;
  selectedBotId: number | null;
  setBots: (bots: Bot[]) => void;
  setSelectedBot: (botId: number | null) => void;
}

export const useBotStore = create<BotStore>((set) => ({
  bots: [],
  botsLoaded: false,
  selectedBotId: getStorage().getNumber('selectedBotId') ?? null,
  setBots: (bots: Bot[]) => set({ bots, botsLoaded: true }),
  setSelectedBot: (botId: number | null) => {
    if (botId) {
      getStorage().set('selectedBotId', botId);
    } else {
      getStorage().delete('selectedBotId');
    }
    set({ selectedBotId: botId });
  },
}));
