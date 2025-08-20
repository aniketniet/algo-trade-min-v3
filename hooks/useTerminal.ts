import { useState } from 'react';

export const useTerminal = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentStrategyId, setCurrentStrategyId] = useState<string | null>(null);

  const openTerminal = (strategyId: string) => {
    setCurrentStrategyId(strategyId);
    setIsTerminalOpen(true);
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
    setCurrentStrategyId(null);
  };

  return {
    isTerminalOpen,
    currentStrategyId,
    openTerminal,
    closeTerminal
  };
};
