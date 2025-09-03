import React from 'react';
import { GameAction } from '../types/Pet';

interface ActionButtonsProps {
  onAction: (action: GameAction['type']) => void;
  onFeedAction: () => void;
  onToggleSleep: () => void;
  isSleeping: boolean;
  disabled?: boolean;
  showCleaningBubbles?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAction, onFeedAction, onToggleSleep, isSleeping, disabled, showCleaningBubbles }) => {
  const actions = [
    { 
      type: 'play' as const, 
      emoji: '🎮',
      color: 'bg-purple-400/80 hover:bg-purple-500/90'
    },
    { 
      type: 'clean' as const, 
      emoji: '🧼',
      color: 'bg-cyan-400/80 hover:bg-cyan-500/90'
    },
    { 
      type: 'medicine' as const, 
      emoji: '💊',
      color: 'bg-red-400/80 hover:bg-red-500/90'
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 relative">
      {/* Feed button (special handling) */}
      <button
        onClick={onFeedAction}
        disabled={disabled || isSleeping}
        className={`
          bg-green-400/80 hover:bg-green-500/90
          ${disabled || isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
          w-12 h-12 rounded-full shadow-lg 
          transform transition-all duration-200 ease-out
          flex items-center justify-center
          border-2 border-white/40 backdrop-blur-sm
        `}
      >
        <span className="text-xl">🍎</span>
      </button>
      
      {actions.map((action) => {
        const isCleanButton = action.type === 'clean';
        
        return (
          <div key={action.type} className="relative">
            <button
            onClick={() => onAction(action.type)}
            disabled={disabled || isSleeping}
            className={`
              ${action.color}
              ${disabled || isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
              w-12 h-12 rounded-full shadow-lg 
              transform transition-all duration-200 ease-out
              flex items-center justify-center
              border-2 border-white/40 backdrop-blur-sm
            `}
            >
            <span className="text-xl">{action.emoji}</span>
            </button>
          </div>
        );
      })}
      
      {/* Sleep/Wake button */}
      <button
        onClick={onToggleSleep}
        className={`
          ${isSleeping 
            ? 'bg-yellow-400/80 hover:bg-yellow-500/90' 
            : 'bg-indigo-400/80 hover:bg-indigo-500/90'
          }
          w-12 h-12 rounded-full shadow-lg 
          transform transition-all duration-200 ease-out hover:scale-110 active:scale-95
          flex items-center justify-center
          border-2 border-white/40 backdrop-blur-sm
        `}
      >
        <span className="text-xl">{isSleeping ? '☀️' : '💤'}</span>
      </button>
    </div>
  );
};

export default ActionButtons;