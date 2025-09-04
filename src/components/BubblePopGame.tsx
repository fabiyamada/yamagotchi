import React, { useState, useEffect, useCallback } from 'react';
import { useRef } from 'react';
import { X, Coins, Heart } from 'lucide-react';
import { EggType } from '../types/Pet';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  isCoin: boolean;
  color: string;
}

interface BubblePopGameProps {
  onGameEnd: (results: { coinsEarned: number; happinessEarned: number }) => void;
  onCancel: () => void;
  eggType: EggType;
}

const BubblePopGame: React.FC<BubblePopGameProps> = ({ onGameEnd, onCancel, eggType }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [happinessEarned, setHappinessEarned] = useState(0);
  const [poppedBubbles, setPoppedBubbles] = useState<{ id: number; x: number; y: number; isCoin: boolean }[]>([]);
  const bubbleIdCounter = useRef(0);

  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  // Coin probability based on egg rarity
  const coinProbabilities: Record<EggType, number> = {
    ordinario: 0.15,  // 15%
    common: 0.17,     // 17%
    rare: 0.19,       // 19%
    epic: 0.22,       // 22%
    legendary: 0.25,  // 25%
    mythic: 0.30,     // 30%
  };

  // Generate a new bubble
  const generateBubble = useCallback(() => {
    const coinChance = coinProbabilities[eggType];
    const isCoin = Math.random() < coinChance;
    bubbleIdCounter.current += 1;
    return {
      id: bubbleIdCounter.current,
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: window.innerHeight + 50, // Start from below screen
      size: Math.random() * 30 + 40, // 40-70px
      speed: Math.random() * 12 + 8, // 8-20 pixeles per 100ms
      isCoin,
      color: isCoin ? '#FFD700' : colors[Math.floor(Math.random() * colors.length)],
    };
  }, [eggType]);

  // Initialize bubbles
  useEffect(() => {
    const initialBubbles = Array.from({ length: 5 }, () => ({
      ...generateBubble(),
      y: Math.random() * (window.innerHeight - 100) + 50, // Spread initial bubbles across screen
    }));
    setBubbles(initialBubbles);
  }, [generateBubble]);

  // Game timer
useEffect(() => {
  console.log('Timer useEffect triggered, timeLeft:', timeLeft);
  
  if (timeLeft > 0) {
    console.log('Setting timer for', timeLeft, 'seconds');
    const startTime = Date.now();
    
    const timer = setTimeout(() => {
      const actualTime = Date.now() - startTime;
      console.log('Timer fired after', actualTime, 'ms, expected 1000ms');
      console.log('Reducing timeLeft from', timeLeft, 'to', timeLeft - 1);
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => {
      console.log('Timer cleanup called for timeLeft:', timeLeft);
      clearTimeout(timer);
    };
  } else {
    console.log('Game ended, timeLeft is 0');
    setTimeout(() => {
      console.log('Calling onGameEnd');
      setCoinsEarned(currentCoins => {
        setHappinessEarned(currentHappiness => {
          onGameEnd({ coinsEarned: currentCoins, happinessEarned: currentHappiness });
          return currentHappiness;
        });
        return currentCoins;
      });
    }, 1000);
  }
}, [timeLeft, onGameEnd]);

  // Bubble movement and generation
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prevBubbles => {
        let newBubbles = prevBubbles
          .map(bubble => ({
            ...bubble,
            y: bubble.y - bubble.speed,
          }))
          .filter(bubble => bubble.y > -bubble.size); // Remove bubbles that went off screen

        // Add new bubbles occasionally
        if (Math.random() < 0.3 && newBubbles.length < 8) {
          newBubbles.push(generateBubble());
        }

        return newBubbles;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [generateBubble]);

  // Pop bubble
const popBubble = (bubble: Bubble) => {
  console.log('=== BUBBLE CLICKED ===');
  console.log('Current timeLeft when bubble clicked:', timeLeft);
  console.log('Bubble popped:', bubble.id, 'isCoin:', bubble.isCoin);
  
  // Add to popped bubbles for animation
  setPoppedBubbles(prev => {
    console.log('Setting popped bubbles');
    return [...prev, { id: bubble.id, x: bubble.x, y: bubble.y, isCoin: bubble.isCoin }];
  });
  
  // Remove from bubbles
  setBubbles(prev => {
    console.log('Removing bubble from bubbles array');
    return prev.filter(b => b.id !== bubble.id);
  });
  
  // Update rewards
  if (bubble.isCoin) {
    console.log('Adding coin, current coins:', coinsEarned);
    setCoinsEarned(prev => prev + 1);
  } else {
    console.log('Adding happiness, current happiness:', happinessEarned);
    setHappinessEarned(prev => prev + 1);
  }

  console.log('=== END BUBBLE CLICK ===');

  // Remove popped bubble animation after delay
  setTimeout(() => {
    setPoppedBubbles(prev => prev.filter(p => p.id !== bubble.id));
  }, 800);
};

// También agrega un log cada vez que timeLeft cambie:
useEffect(() => {
  console.log('TimeLeft state changed to:', timeLeft);
}, [timeLeft]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-poppins font-bold text-blue-600">⏱️ {timeLeft}seg</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="font-poppins font-semibold text-yellow-600">{coinsEarned}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-pink-600" />
              <span className="font-poppins font-semibold text-pink-600">{happinessEarned}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onCancel}
          className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
        <p className="text-center text-gray-700 font-poppins font-medium">
          🫧 ¡Toca las burbujas para reventarlas! 🫧
        </p>
        <p className="text-center text-sm font-poppins text-gray-600">
          Doradas = monedas 💰 | De colores = felicidad 😊
        </p>
      </div>

      {/* Bubbles */}
      {bubbles.map(bubble => (
        <button
  key={bubble.id}
  onMouseDown={(e) => {
    e.preventDefault();
    e.stopPropagation();
    popBubble(bubble);
  }}
  onTouchStart={(e) => {
    e.preventDefault();
    e.stopPropagation();
    popBubble(bubble);
  }}
  className="absolute rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
  style={{
    left: `${bubble.x}%`,
    top: `${bubble.y}px`,
    width: `${bubble.size}px`,
    height: `${bubble.size}px`,
    backgroundColor: bubble.color,
    boxShadow: `0 4px 15px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)`,
    border: bubble.isCoin ? '3px solid #FFA500' : '2px solid rgba(255,255,255,0.3)',
  }}
>
          {/* Bubble shine effect */}
          <div 
            className="absolute top-2 left-2 rounded-full bg-white/40 blur-sm"
            style={{
              width: `${bubble.size * 0.3}px`,
              height: `${bubble.size * 0.4}px`,
            }}
          />
          
          {/* Coin symbol for coin bubbles */}
          {bubble.isCoin && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-orange-800 font-bold" style={{ fontSize: `${bubble.size * 0.3}px` }}>
                💰
              </span>
            </div>
          )}
        </button>
      ))}

      {/* Popped bubble animations */}
      {poppedBubbles.map(popped => (
        <div
          key={`popped-${popped.id}`}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: `${popped.x}%`,
            top: `${popped.y}px`,
          }}
        >
          <div className="text-2xl font-poppins">
            {popped.isCoin ? '💰+1' : '😊+1'}
          </div>
        </div>
      ))}

      {/* Game over overlay */}
      {timeLeft === 0 && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 text-center max-w-sm">
            <h2 className="text-3xl font-jersey font-bold text-gray-800 mb-4">🎉 ¡Juego Terminado! 🎉</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-6 h-6 text-yellow-600" />
                <span className="text-xl font-poppins font-bold text-yellow-600">+{coinsEarned} monedas</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                <span className="text-xl font-poppins font-bold text-pink-600">+{happinessEarned} felicidad</span>
              </div>
            </div>
            <p className="text-gray-600 font-poppins">Regresando al juego principal...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubblePopGame;