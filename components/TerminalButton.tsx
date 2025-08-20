import React from 'react';

interface TerminalButtonProps {
  strategyId: string;
  onOpenTerminal: (strategyId: string) => void;
  disabled?: boolean;
}

const TerminalButton: React.FC<TerminalButtonProps> = ({ strategyId, onOpenTerminal, disabled = false }) => {
  return (
    <button
      onClick={() => onOpenTerminal(strategyId)}
      disabled={disabled}
      className={`
        px-3 py-1 text-xs font-medium rounded-md transition-colors
        ${disabled 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
        }
        flex items-center space-x-1
      `}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>Terminal</span>
    </button>
  );
};

export default TerminalButton;
