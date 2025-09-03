import React, { useState } from 'react';
import { X, ShoppingCart, Coins, Plus, Minus } from 'lucide-react';
import { FOOD_ITEMS, FoodOption } from '../types/Pet';

interface FoodShopProps {
  playerCoins: number;
  foodInventory: Record<string, number>;
  onPurchaseFood: (foodId: string, quantity: number) => boolean;
  onClose: () => void;
}

const FoodShop: React.FC<FoodShopProps> = ({ playerCoins, foodInventory, onPurchaseFood, onClose }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const getQuantity = (foodId: string) => quantities[foodId] || 1;

  const setQuantity = (foodId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [foodId]: Math.max(1, Math.min(10, quantity))
    }));
  };

  const handlePurchase = (foodId: string) => {
    const quantity = getQuantity(foodId);
    const success = onPurchaseFood(foodId, quantity);
    
    if (success) {
      setPurchaseSuccess(foodId);
      setTimeout(() => setPurchaseSuccess(null), 1500);
      // Reset quantity after purchase
      setQuantity(foodId, 1);
    }
  };

  const getTotalCost = (foodId: string) => {
    return FOOD_ITEMS[foodId].price * getQuantity(foodId);
  };

  const canAfford = (foodId: string) => {
    return playerCoins >= getTotalCost(foodId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-jersey font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Tienda de Comida
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

        {/* Food Items */}
        <div className="space-y-4 mb-6">
          {Object.values(FOOD_ITEMS).map((food) => {
            const currentStock = foodInventory[food.id] || 0;
            const quantity = getQuantity(food.id);
            const totalCost = getTotalCost(food.id);
            const affordable = canAfford(food.id);
            const justPurchased = purchaseSuccess === food.id;
            
            return (
              <div
                key={food.id}
                className={`
                  p-4 rounded-2xl border-2 transition-all duration-300
                  ${justPurchased 
                    ? 'bg-green-100 border-green-300 scale-105' 
                    : 'bg-white/80 border-white/50'
                  }
                  shadow-lg
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

                  {/* Purchase Controls */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Current stock */}
                    <div className="text-xs font-poppins text-gray-600">
                      Stock: <span className="font-bold">{currentStock}</span>
                    </div>

                    {/* Quantity selector */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(food.id, quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-poppins font-bold text-gray-700">{quantity}</span>
                      <button
                        onClick={() => setQuantity(food.id, quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>

                    {/* Price and buy button */}
                    <div className="text-center">
                      <div className="text-sm font-poppins font-bold text-yellow-600 mb-2">
                        💰 {totalCost} monedas
                      </div>
                      <button
                        onClick={() => handlePurchase(food.id)}
                        disabled={!affordable}
                        className={`
                          px-4 py-2 rounded-xl font-poppins font-bold text-sm shadow-lg transform transition-all duration-200
                          ${affordable
                            ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        {affordable ? 'Comprar' : 'Sin fondos'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Purchase success animation */}
                {justPurchased && (
                  <div className="mt-2 text-center">
                    <span className="text-green-600 font-poppins font-bold text-sm animate-pulse">
                      ✅ ¡Comprado! +{quantity} {food.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Shop Info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-sm font-jersey font-semibold text-gray-700">Consejos de la Tienda</span>
          </div>
          <ul className="text-xs font-poppins text-gray-600 space-y-1">
            <li>• Gana monedas jugando mini-juegos</li>
            <li>• Las comidas más caras suelen mejores efectos</li>
            <li>• Mantén siempre stock de comida saludable</li>          
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FoodShop;