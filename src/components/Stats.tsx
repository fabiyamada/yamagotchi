import React, { useState } from 'react';
import { PetStats } from '../types/Pet';
import { Heart, Zap, Smile, Droplets, Utensils } from 'lucide-react';

interface StatsProps {
  stats: PetStats;
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const statItems = [
    { 
      name: 'Salud', 
      value: stats.health, 
      icon: Heart, 
      color: 'bg-red-400',
      bgColor: 'bg-red-100' 
    },
    { 
      name: 'Energía', 
      value: stats.energy, 
      icon: Zap, 
      color: 'bg-yellow-400',
      bgColor: 'bg-yellow-100' 
    },
    { 
      name: 'Felicidad', 
      value: stats.happiness, 
      icon: Smile, 
      color: 'bg-pink-400',
      bgColor: 'bg-pink-100' 
    },
    { 
      name: 'Limpieza', 
      value: stats.cleanliness, 
      icon: Droplets, 
      color: 'bg-blue-400',
      bgColor: 'bg-blue-100' 
    },
    { 
      name: 'Hambre', 
      value: stats.hunger, 
      icon: Utensils, 
      color: 'bg-green-400',
      bgColor: 'bg-green-100' 
    },
  ];

  const handleIconClick = (statName: string) => {
    setActivePopup(activePopup === statName ? null : statName);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-1 border border-white/50 mb-10">
      <div className="grid grid-cols-5 gap-3">
        {statItems.map((stat) => {
          const Icon = stat.icon;
          const isLow = stat.value < 30;
          
          return (
            <div key={stat.name} className="relative flex flex-col items-center">
              {/* Icon with click handler */}
              <div className="relative mb-2">
                <button
                  onClick={() => handleIconClick(stat.name)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <Icon 
                    size={20} 
                    className={`${isLow ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}
                  />
                </button>
                
                {/* Alert dot */}
                {isLow && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                )}
                
                {/* Popup */}
                {activePopup === stat.name && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50 z-50 min-w-[80px] text-center">
                    <div className="text-sm font-poppins font-medium text-gray-700 mb-1">
                      {stat.name}
                    </div>
                    <div className={`text-lg font-poppins font-bold ${isLow ? 'text-red-600' : 'text-gray-600'}`}>
                      {Math.round(stat.value)}%
                    </div>
                    
                    {/* Close button */}
                    <button
                      onClick={() => setActivePopup(null)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 hover:bg-gray-500 text-white rounded-full text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              
              {/* Short progress bar */}
              <div className={`w-8 h-1.5 ${stat.bgColor} rounded-full overflow-hidden border border-gray-400`}>
                <div
                  className={`h-full ${stat.color} rounded-full transition-all duration-500 ease-out ${isLow ? 'animate-pulse' : ''}`}
                  style={{ width: `${Math.max(0, stat.value)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;