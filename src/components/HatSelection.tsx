import React, { useState } from 'react';
import { X, Crown, Coins, Lock } from 'lucide-react';
import { AVAILABLE_HATS, Hat } from '../types/Pet';

interface HatSelectionProps {
  playerCoins: number;
  currentHat: string | null;
  petLevel: number;
  onSelectHat: (hatId: string) => void;
  onPurchaseHat: (hatId: string) => boolean;
  onClose: () => void;
  ownedHats: string[];
}

const HatSelection: React.FC<HatSelectionProps> = ({ 
  playerCoins, 
  currentHat, 
  petLevel,
  onSelectHat, 
  onPurchaseHat,
  onClose,
  ownedHats
}) => {
  const [selectedHat, setSelectedHat] = useState<string | null>(currentHat);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const getRarityColor = (rarity: Hat['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-300 to-gray-400';
      case 'rare': return 'from-blue-300 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getRarityStars = (rarity: Hat['rarity']) => {
    switch (rarity) {
      case 'common': return '⭐';
      case 'rare': return '⭐⭐';
      case 'epic': return '⭐⭐⭐';
      case 'legendary': return '⭐⭐⭐⭐';
      default: return '';
    }
  };

  const handlePurchase = (hatId: string) => {
    const success = onPurchaseHat(hatId);
    if (success) {
      setPurchaseSuccess(hatId);
      setTimeout(() => setPurchaseSuccess(null), 1500);
    }
  };

  const handleEquip = (hatId: string) => {
    onSelectHat(hatId);
    setSelectedHat(hatId);
  };

  const isOwned = (hatId: string) => ownedHats.includes(hatId) || hatId === 'none';
  const canAfford = (hat: Hat) => playerCoins >= hat.price;
  const isUnlocked = (hat: Hat) => !hat.unlockLevel || petLevel >= hat.unlockLevel;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-jersey font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Sombreros
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Player coins display */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-100/80 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-yellow-300/50 shadow-lg">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold font-poppins text-yellow-700">{playerCoins} monedas</span>
          </div>
        </div>

        {/* Hat Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.values(AVAILABLE_HATS).map((hat) => {
            const owned = isOwned(hat.id);
            const affordable = canAfford(hat);
            const unlocked = isUnlocked(hat);
            const equipped = selectedHat === hat.id;
            const justPurchased = purchaseSuccess === hat.id;
            
            return (
              <div
                key={hat.id}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all duration-300
                  ${justPurchased 
                    ? 'bg-green-100 border-green-300 scale-105' 
                    : equipped
                      ? 'bg-purple-100 border-purple-400 scale-105'
                      : 'bg-white/80 border-white/50'
                  }
                  shadow-lg
                `}
              >
                {/* Rarity indicator */}
                {hat.id !== 'none' && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 shadow-md">
                    <span className="text-xs">{getRarityStars(hat.rarity)}</span>
                  </div>
                )}

                {/* Hat visual */}
                <div className="relative mb-3">
                  <div 
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(hat.rarity)} shadow-lg flex items-center justify-center relative overflow-hidden`}
                  >
                    {/* Hat display */}
                    <div className="text-3xl">
                      {hat.emoji || '🐾'}
                    </div>
                    
                    {/* Lock overlay for locked hats */}
                    {!unlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Hat info */}
                <div className="text-center">
                  <h3 className="font-bold font-jersey text-sm text-gray-800 mb-1">{hat.name}</h3>
                  <p className="text-xs font-poppins text-gray-600 mb-2">{hat.description}</p>
                  
                  {/* Status and actions */}
                  <div className="space-y-2">
                    {!unlocked ? (
                      <div className="text-xs font-poppins text-red-500 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" />
                        Nivel {hat.unlockLevel} requerido
                      </div>
                    ) : owned ? (
                      <button
                        onClick={() => handleEquip(hat.id)}
                        className={`
                          w-full px-3 py-2 rounded-xl font-poppins font-bold text-xs shadow-lg transform transition-all duration-200
                          ${equipped
                            ? 'bg-purple-500 text-white'
                            : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white hover:scale-105 active:scale-95'
                          }
                        `}
                      >
                        {equipped ? '✓ Equipado' : 'Equipar'}
                      </button>
                    ) : (
                      <div className="space-y-1">
                        <div className={`text-xs font-poppins font-bold ${affordable ? 'text-yellow-600' : 'text-red-500'}`}>
                          💰 {hat.price} monedas
                        </div>
                        <button
                          onClick={() => handlePurchase(hat.id)}
                          disabled={!affordable}
                          className={`
                            w-full px-3 py-2 rounded-xl font-poppins font-bold text-xs shadow-lg transform transition-all duration-200
                            ${affordable
                              ? 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white hover:scale-105 active:scale-95'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                          `}
                        >
                          {affordable ? 'Comprar' : 'Sin fondos'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchase success animation */}
                {justPurchased && (
                  <div className="absolute inset-0 rounded-2xl bg-green-400/20 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <span className="text-lg">✅</span>
                    </div>
                  </div>
                )}

                {/* Equipped indicator */}
                {equipped && (
                  <div className="absolute -top-1 -left-1">
                    <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-sm font-jersey font-semibold text-gray-700">Consejos de Moda</span>
          </div>
          <ul className="text-xs font-poppins text-gray-600 space-y-1">
            <li>• Los sombreros son puramente cosméticos</li>
            <li>• Gana monedas jugando mini-juegos</li>
            <li>• Algunos sombreros se desbloquean con niveles</li>
            <li>• ¡Cambia de sombrero cuando quieras!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HatSelection;