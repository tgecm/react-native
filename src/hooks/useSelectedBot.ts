import { useBotStore } from '../store';

export const useSelectedBot = () => {
  const { bots, selectedBotId } = useBotStore();
  const selectedBot = bots.find((b) => b.id === selectedBotId) || null;
  return { selectedBot, selectedBotId };
};
