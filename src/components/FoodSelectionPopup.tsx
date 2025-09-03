import React, { useState } from 'react';
import { X, ShoppingBag, AlertTriangle } from 'lucide-react';
import { FOOD_ITEMS, PetState, PlayerData } from '../types/Pet';

interface FoodSelectionPopupProps {
  playerData: PlayerData;
  pet: PetState;
  onFeed: (foodId: string) => void;
  onClose: () => void;
  onOpenShop: () => void;
}

const FoodSelectionPopup: React.FC<FoodSelectionPopupProps> = ({ 
  playerData, 
  pet, 
  onFeed, 
  onClose, 
  onOpenShop 
}) => {
  const [showHealthWarning, setShowHealthWarning] = useState<string | null>(null);

  const isHealthy = pet.stats.health >= 50;
  
  const healthyFoods = ['apple', 'sushi', 'meat'];
  const unhealthyFoods = ['cake', 'pizza', 'ice_cream'];

  const handleFoodSelect = (foodId: string) => {
    const currentStock = playerData.foodInventory[foodId] || 0;
    
    if (currentStock <= 0) {
      return; // No stock available
    }

    // Check if pet is sick and food is unhealthy
    if (!isHealthy && unhealthyFoods.includes(foodId)) {
      setShowHealthWarning(foodId);
      return;
    }

    onFeed(foodId);
    onClose();
  };

  const handleHealthyFoodFromWarning = () => {
    // Give apple if available, otherwise close warning
    const appleStock = playerData.foodInventory['apple'] || 0;
    if (appleStock > 0) {
      onFeed('apple');
      onClose();
    }
    setShowHealthWarning(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-jersey font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
            🍎 Cocina
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Health warning for sick pets */}
        {!isHealthy && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-bold font-jersey text-red-700">⚠️ Mascota Enferma</span>
            </div>
            <p className="text-sm font-poppins text-red-600">
              {pet.name} está enfermo y solo puede comer comida saludable (🍎 🍣 🥩)
            </p>
          </div>
        )}

        {/* Food Items */}
        <div className="space-y-4 mb-6">
          {Object.values(FOOD_ITEMS).map((food) => {
            const currentStock = playerData.foodInventory[food.id] || 0;
            const isUnhealthy = unhealthyFoods.includes(food.id);
            const isDisabled = currentStock <= 0 || (!isHealthy && isUnhealthy);
            
            return (
              <div
                key={food.id}
                className={`
                  p-4 rounded-2xl border-2 transition-all duration-300 shadow-lg
                  ${isDisabled 
                    ? 'bg-gray-100/80 border-gray-200 opacity-60' 
                    : 'bg-white/80 border-white/50 hover:bg-white hover:scale-105'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  {/* Food Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${food.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">{food.emoji}</span>
                    </div>
                    <div>
                      <h3 className="font-bold font-jersey text-lg text-gray-800">{food.name}</h3>
                      <p className="text-xs font-poppins text-gray-600">{food.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-poppins text-green-600">🍽️ +{food.hungerBoost}%</span>
                        <span className="text-xs font-poppins text-pink-600">😊 +{food.happinessBoost}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock and Action */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Stock display */}
                    <div className={`text-sm font-poppins font-bold ${
                      currentStock > 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      Stock: {currentStock}
                    </div>

                    {/* Restrictions */}
                    {!isHealthy && isUnhealthy && (
                      <div className="text-xs font-poppins text-red-500 flex items-center gap-1">
                        🚫 No saludable
                      </div>
                    )}

                    {/* Feed button */}
                    <button
                      onClick={() => handleFoodSelect(food.id)}
                      disabled={isDisabled}
                      className={`
                        px-4 py-2 rounded-xl font-poppins font-bold text-sm shadow-lg transform transition-all duration-200
                        ${!isDisabled
                          ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white hover:scale-105 active:scale-95'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                     Alimentar
                    </button>
                   
                   {/* Shop button when no stock */}
                   {currentStock <= 0 && (
                     <button
                       onClick={onOpenShop}
                       className="px-4 py-2 rounded-xl font-poppins font-bold text-sm shadow-lg transform transition-all duration-200 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white hover:scale-105 active:scale-95"
                     >
                       Ir a la tienda
                     </button>
                   )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shop button */}
        <div className="text-center mb-4">
          <button
            onClick={onOpenShop}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-poppins font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            Ir a la Tienda
          </button>
        </div>

        {/* Inventory Info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-sm font-jersey font-semibold text-gray-700">Consejos de Alimentación</span>
          </div>
          <ul className="text-xs font-poppins text-gray-600 space-y-1">
            <li>• Cada comida tiene diferentes efectos en tu mascota</li>
            <li>• Las comidas más caras suelen ser más efectivas</li>
            <li>• Cuando esté enfermo, solo dale comida saludable</li>
            <li>• Compra más comida en la tienda cuando se agote</li>
          </ul>
        </div>
      </div>

      {/* Health Warning Modal */}
      {showHealthWarning && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 max-w-sm w-full text-center">
            <div className="mb-4">
              <div className="text-6xl mb-4">🤒</div>
              <h3 className="text-xl font-jersey font-bold text-red-600 mb-2">
                ¡Comida No Saludable!
              </h3>
              <p className="text-gray-700 font-poppins mb-4">
                <span className="font-bold text-pink-600">{pet.name}</span> está enfermo y necesita comer saludable para recuperarse.
              </p>
              <div className="bg-red-50 rounded-2xl p-3 border border-red-200 mb-4">
                <p className="text-sm font-poppins text-red-700 mb-2">
                  🏥 Salud actual: {Math.round(pet.stats.health)}%
                </p>
                <p className="text-xs font-poppins text-red-600">
                  Comida saludable: 🍎 Manzana, 🍣 Sushi, 🥩 Carne
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleHealthyFoodFromWarning}
                disabled={(playerData.foodInventory['apple'] || 0) <= 0}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-poppins font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
              >
                🍎 Dar Manzana {(playerData.foodInventory['apple'] || 0) <= 0 && '(Sin stock)'}
              </button>
              
              <button
                onClick={() => setShowHealthWarning(null)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-poppins font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSelectionPopup;