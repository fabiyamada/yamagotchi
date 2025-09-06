import React from 'react';
import { Sparkles, Heart, Zap, Shield, Star } from 'lucide-react';
import { EGG_COSTS } from '../types/Pet';
 
interface EggType {
  type: string;
  name: string;
  description: string;
  color: string;
  borderColor: string;
  iconColor: string;
  rarity: string;
  cost: number;
  icon: React.ComponentType<any>;
}

interface EggSelectionProps {
  onEggSelect: (eggType: string) => void;
  playerCoins: number;
}

const eggs: EggType[] = [
  {
    type: 'ordinario',
    name: 'Ordinario',
    description: 'Un huevo básico para empezar',
    color: 'from-gray-200 to-gray-300',
    borderColor: 'border-gray-300',
    iconColor: 'text-gray-500',
    rarity: '',
    cost: EGG_COSTS.ordinario,
    icon: Heart
  },
  {
    type: 'common',
    name: 'Común',
    description: 'Un huevo simple pero lleno de amor',
    color: 'from-gray-300 to-gray-400',
    borderColor: 'border-gray-400',
    iconColor: 'text-gray-600',
    rarity: '⭐',
    cost: EGG_COSTS.common,
    icon: Heart
  },
  {
    type: 'rare',
    name: 'Raro',
    description: 'Un huevo especial con energía mágica',
    color: 'from-blue-300 to-blue-500',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-700',
    rarity: '⭐⭐',
    cost: EGG_COSTS.rare,
    icon: Zap
  },
  {
    type: 'epic',
    name: 'Épico',
    description: 'Un huevo poderoso con habilidades únicas',
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-600',
    iconColor: 'text-purple-800',
    rarity: '⭐⭐⭐',
    cost: EGG_COSTS.epic,
    icon: Shield
  },
  {
    type: 'legendary',
    name: 'Legendario',
    description: 'Un huevo místico de poder extraordinario',
    color: 'from-yellow-400 to-orange-500',
    borderColor: 'border-orange-500',
    iconColor: 'text-orange-700',
    rarity: '⭐⭐⭐⭐',
    cost: EGG_COSTS.legendary,
    icon: Star
  },
  {
    type: 'mythic',
    name: 'Mítico',
    description: 'El huevo más raro y poderoso de todos',
    color: 'from-pink-400 to-red-500',
    borderColor: 'border-red-500',
    iconColor: 'text-red-700',
    rarity: '⭐⭐⭐⭐⭐',
    cost: EGG_COSTS.mythic,
    icon: Sparkles
  }
];

export default function EggSelection({ onEggSelect, playerCoins }: EggSelectionProps) {
  const [selectedEgg, setSelectedEgg] = React.useState<string | null>(null);

  // Debug logs
  console.log('PlayerCoins:', playerCoins, 'Type:', typeof playerCoins);
  console.log('EGG_COSTS:', EGG_COSTS);

  const handleEggSelect = (eggType: string) => {
    const egg = eggs.find(e => e.type === eggType);
    console.log('Attempting to select egg:', eggType);
    console.log('Egg data:', egg);
    console.log('Can afford?', egg && egg.cost <= playerCoins);
    
    if (egg && egg.cost > playerCoins) {
      console.log('Cannot afford egg - Cost:', egg.cost, 'Player coins:', playerCoins);
      return; // No permitir seleccionar si no tiene suficientes monedas
    }
    console.log('Egg selected successfully:', eggType);
    setSelectedEgg(eggType);
  };

  const handleConfirm = () => {
    if (selectedEgg) {
      console.log('Confirming egg selection:', selectedEgg);
      onEggSelect(selectedEgg);
    }
  };

  const selectedEggData = eggs.find(e => e.type === selectedEgg);
  const canAfford = selectedEggData ? selectedEggData.cost <= playerCoins : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl max-w-4xl w-full">
        <div className="text-center mb-6 sm:mb-8">
          {/* Player coins display */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-yellow-100/80 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-yellow-300/50 shadow-lg">
              <span className="text-lg">💰</span>
              <span className="font-bold font-poppins text-yellow-700">{playerCoins} monedas</span>
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            <span role="img" aria-label="egg" className="mr-2">🥚</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Elige tu Huevo de Yamagotchi
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Cada huevo contiene una mascota única con diferentes habilidades
          </p>
        </div>

        {/* Egg Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {eggs.map((egg) => {
            const Icon = egg.icon;
            const isSelected = selectedEgg === egg.type;
            const canAffordEgg = egg.cost <= playerCoins;
            const isDisabled = !canAffordEgg && egg.cost > 0;
            
            console.log(`Egg ${egg.name}: Cost=${egg.cost}, PlayerCoins=${playerCoins}, CanAfford=${canAffordEgg}, IsDisabled=${isDisabled}`);
            
            return (
              <button
                key={egg.type}
                onClick={() => handleEggSelect(egg.type)}
                disabled={isDisabled}
                className={`
                  relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 sm:border-3 transition-all duration-300 transform
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                  ${isSelected 
                    ? `${egg.borderColor} bg-white shadow-2xl scale-105` 
                    : `border-gray-200 ${isDisabled ? 'bg-gray-100/80' : 'bg-white/80 hover:bg-white'} shadow-lg`
                  }
                `}
              >
                {/* Rarity indicator */}
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-white rounded-full px-1 sm:px-2 py-0.5 sm:py-1 shadow-md">
                  <span className="text-xs sm:text-xs">{egg.rarity}</span>
                </div>

                {/* Egg visual */}
                <div className="relative mb-2 sm:mb-3 md:mb-4">
                  <div 
                    className={`w-12 h-14 sm:w-16 sm:h-20 md:w-20 md:h-24 mx-auto rounded-full bg-gradient-to-b ${egg.color} shadow-lg relative overflow-hidden`}
                    style={{
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    }}
                  >
                    {/* Egg shine effect */}
                    <div className="absolute top-1 sm:top-2 left-2 sm:left-3 w-2 sm:w-3 h-2 sm:h-4 bg-white/40 rounded-full blur-sm"></div>
                    
                    {/* Egg pattern */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className={`w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 ${egg.iconColor} opacity-60`} />
                    </div>
                  </div>
                </div>

                {/* Egg info */}
                <div className="text-center">
                  <h3 className="font-bold font-jersey text-sm sm:text-base md:text-lg text-gray-800 mb-1 sm:mb-2">{egg.name}</h3>
                  
                  {/* Cost display */}
                  <div className="mb-2">
                    {egg.cost === 0 ? (
                      <span className="text-xs sm:text-sm font-poppins font-bold text-green-600">¡GRATIS!</span>
                    ) : (
                      <div className={`text-xs sm:text-sm font-poppins font-bold ${canAffordEgg ? 'text-yellow-600' : 'text-red-500'}`}>
                        💰 {egg.cost} monedas
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm font-poppins text-gray-600 leading-tight hidden sm:block">{egg.description}</p>
                </div>

                {/* Insufficient funds overlay */}
                {isDisabled && (
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-red-500/20 flex items-center justify-center">
                    <div className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-poppins font-bold">
                      Sin fondos
                    </div>
                  </div>
                )}

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-400/20 to-purple-400/20 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <span className="text-lg sm:text-2xl">✨</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Confirm button */}
        <div className="text-center">
          <h1 className="text-3xl font-jersey font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          </h1>
          <button
            onClick={handleConfirm}
            disabled={!selectedEgg || !canAfford}
            className={`font-poppins
              px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg transform transition-all duration-200
              ${selectedEgg && canAfford
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white hover:scale-105 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {!selectedEgg 
              ? 'Selecciona un huevo' 
              : !canAfford 
                ? 'Monedas insuficientes' 
                : `¡Elegir ${eggs.find(e => e.type === selectedEgg)?.name}! 🎉`
            }
          </button>
          
          {selectedEggData && (
            <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/50">
              <p className="text-xs font-poppins text-gray-600 mb-2">
                {selectedEggData.cost === 0 
                  ? '¡Tu primer huevo es gratis! 🎁' 
                  : `Costo: ${selectedEggData.cost} monedas`
                }
              </p>
              <p className="text-xs font-poppins text-gray-500">
                Cada huevo contiene una mascota única con diferentes habilidades
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}