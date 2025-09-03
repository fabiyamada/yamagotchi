import React, { useState, useEffect } from 'react';
import { EggType } from '../types/Pet';
import { Sparkles, Star, Crown, Gem, Zap } from 'lucide-react';

interface EggHatchingProps {
  eggType: EggType;
  onHatch: () => void;
}

const EggHatching: React.FC<EggHatchingProps> = ({ eggType, onHatch }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [isHatching, setIsHatching] = useState(false);

  const eggConfig = {
    ordinario: {
      name: 'Ordinario',
      color: 'from-gray-200 to-gray-300',
      icon: Sparkles,
      iconColor: 'text-gray-500',
    },
    common: {
      name: 'Común',
      color: 'from-gray-300 to-gray-400',
      icon: Sparkles,
      iconColor: 'text-gray-600',
    },
    rare: {
      name: 'Raro',
      color: 'from-blue-300 to-blue-500',
      icon: Star,
      iconColor: 'text-blue-700',
    },
    epic: {
      name: 'Épico',
      color: 'from-purple-400 to-purple-600',
      icon: Crown,
      iconColor: 'text-purple-800',
    },
    legendary: {
      name: 'Legendario',
      color: 'from-yellow-400 to-orange-500',
      icon: Gem,
      iconColor: 'text-orange-700',
    },
    mythic: {
      name: 'Mítico',
      color: 'from-pink-400 via-purple-500 to-indigo-600',
      icon: Zap,
      iconColor: 'text-pink-700',
    },
  };

  const currentEgg = eggConfig[eggType];
  const Icon = currentEgg.icon;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Start hatching animation
      setIsHatching(true);
      setTimeout(() => {
        onHatch();
      }, 2000); // 2 second hatching animation
    }
  }, [timeLeft, onHatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((60 - timeLeft) / 60) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4 flex items-center justify-center">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 max-w-md w-full text-center">
        <h1 className="text-3xl font-jersey font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          🥚 Incubando... 🥚
        </h1>
        <p className="text-gray-600 font-poppins mb-8">Tu huevo {currentEgg.name.toLowerCase()} está a punto de eclosionar</p>

        {/* Egg display */}
        <div className="relative mb-8">
          <div 
            className={`
              w-32 h-40 mx-auto rounded-full bg-gradient-to-b ${currentEgg.color} shadow-2xl relative overflow-hidden
              ${isHatching ? 'animate-shake' : timeLeft <= 10 ? 'animate-pulse' : ''}
            `}
            style={{
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            }}
          >
            {/* Egg shine effect */}
            <div className="absolute top-3 left-5 w-4 h-6 bg-white/50 rounded-full blur-sm"></div>
            
            {/* Egg pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className={`w-12 h-12 ${currentEgg.iconColor} opacity-70`} />
            </div>

            {/* Cracks appear when hatching */}
            {isHatching && (
              <>
                <div className="absolute top-1/4 left-1/3 w-8 h-0.5 bg-gray-800 transform rotate-45 opacity-80"></div>
                <div className="absolute top-1/2 right-1/4 w-6 h-0.5 bg-gray-800 transform -rotate-12 opacity-80"></div>
                <div className="absolute bottom-1/3 left-1/4 w-10 h-0.5 bg-gray-800 transform rotate-12 opacity-80"></div>
              </>
            )}
          </div>

          {/* Hatching particles */}
          {isHatching && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${30 + i * 8}%`,
                    top: `${20 + (i % 4) * 20}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}
        </div>

        {!isHatching ? (
          <>
            {/* Timer */}
            <div className="mb-6">
              <div className="text-4xl font-poppins font-bold text-gray-700 mb-2">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm font-poppins text-gray-500">
                {timeLeft <= 10 ? '¡Casi listo! 🎉' : 'Tiempo restante'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>

            {/* Tips */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
              <h3 className="font-semibold font-jersey text-gray-700 mb-2">💡 Mientras esperas...</h3>
              <ul className="text-xs font-poppins text-gray-600 space-y-1 text-left">
                <li>• Los huevos más raros tardan lo mismo en eclosionar</li>
                <li>• Tu mascota heredará características del huevo</li>
                <li>• ¡Prepárate para cuidar a tu nueva mascota!</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-2xl font-jersey font-bold text-gray-700 animate-pulse">
              ¡Eclosionando! 🎉
            </div>
            <p className="text-gray-600 font-poppins">Tu mascota está naciendo...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EggHatching;