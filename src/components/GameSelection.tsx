import React from 'react';
import { Gamepad2, ArrowLeft, Coins } from 'lucide-react';

interface GameSelectionProps {
  onSelectGame: (gameType: 'bubblePop') => void;
  onCancel: () => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({ onSelectGame, onCancel }) => {
  const games = [
    {
      id: 'bubblePop' as const,
      name: 'Revienta Burbujas',
      description: 'Revienta burbujas para ganar monedas y felicidad',
      emoji: '🫧',
      duration: '15 segundos',
      rewards: ['💰 10% probabilidad de monedas', '😊 Felicidad extra'],
      color: 'from-blue-400 to-cyan-500',
      hoverColor: 'from-blue-500 to-cyan-600',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-jersey font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
            🎮 Selecciona un Juego
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Games List */}
        <div className="space-y-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`
                w-full p-4 rounded-2xl bg-gradient-to-r ${game.color} hover:${game.hoverColor}
                text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95
                text-left
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{game.emoji}</span>
                  <div>
                    <h3 className="font-bold font-jersey text-lg">{game.name}</h3>
                    <p className="text-white/90 font-poppins text-sm">{game.description}</p>
                  </div>
                </div>
                <Gamepad2 className="w-6 h-6 text-white/80" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-poppins text-white/90">
                  <span>⏱️ {game.duration}</span>
                </div>
                <div className="space-y-1">
                  {game.rewards.map((reward, index) => (
                    <div key={index} className="text-xs font-poppins text-white/80 flex items-center gap-1">
                      <span>•</span>
                      <span>{reward}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-jersey font-semibold text-gray-700"> Gana monedas jugando los mini-juegos.</span>
          </div>
          <p className="text-xs font-poppins text-gray-600">
             ¡Podrás usarlas para comprar comida y próximamente más cositas!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;