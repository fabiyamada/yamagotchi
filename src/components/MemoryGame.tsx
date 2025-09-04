import React, { useState, useEffect, useCallback } from 'react';
import { X, Coins, Heart, RotateCcw } from 'lucide-react';
import { EggType } from '../types/Pet';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onGameEnd: (results: { coinsEarned: number; happinessEarned: number }) => void;
  onCancel: () => void;
  eggType: EggType;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onGameEnd, onCancel, eggType }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameEndedRef = useRef(false);

  const symbols = ['🌸', '🎀', '⭐', '💖', '🦄', '🌈', '🍓', '🎈'];

  // Bonus multiplier based on egg rarity
  const bonusMultipliers: Record<EggType, number> = {
    ordinario: 1.0,
    common: 1.1,
    rare: 1.2,
    epic: 1.3,
    legendary: 1.4,
    mythic: 1.5,
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const gameSymbols = symbols.slice(0, 6); // Use 6 different symbols
    const cardPairs = [...gameSymbols, ...gameSymbols]; // Create pairs
    
    // Shuffle cards
    const shuffledCards = cardPairs
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
  }, []);

  // Start game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Stable game timer using useRef
  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Game will end, clear timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStarted]); // Only depend on gameStarted

  // Handle game end when timer reaches zero or all pairs are matched
  useEffect(() => {
    if ((timeLeft === 0 || matchedPairs === 6) && !gameEndedRef.current) {
      gameEndedRef.current = true;
      
      // Clear timer if game ends early due to completion
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setTimeout(() => {
        const multiplier = bonusMultipliers[eggType];
        const baseCoins = matchedPairs * 2;
        const timeBonus = Math.max(0, timeLeft);
        const movesPenalty = Math.max(0, moves - 12); // Penalty after 12 moves
        
        const coinsEarned = Math.round((baseCoins + timeBonus - movesPenalty) * multiplier);
        const happinessEarned = Math.round((matchedPairs * 3 + (matchedPairs === 6 ? 10 : 0)) * multiplier);
        
        onGameEnd({ 
          coinsEarned: Math.max(1, coinsEarned), 
          happinessEarned: Math.max(1, happinessEarned) 
        });
      }, 1000);
    }
  }, [timeLeft, matchedPairs, onGameEnd, eggType, moves]);

  // Handle card flip
  const flipCard = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.symbol === secondCard.symbol) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isGameComplete = matchedPairs === 6;
  const isGameOver = timeLeft === 0 || isGameComplete;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-poppins font-bold text-purple-600">⏱️ {timeLeft}seg</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-poppins font-semibold text-blue-600">🧩 {moves} movimientos</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-poppins font-semibold text-green-600">✅ {matchedPairs}/6</span>
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
          🧠 ¡Encuentra las parejas! 🧠
        </p>
        <p className="text-center text-sm font-poppins text-gray-600">
          Voltea las cartas para encontrar símbolos iguales
        </p>
      </div>

      {/* Game Board */}
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
        <div className="grid grid-cols-4 gap-3">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => flipCard(card.id)}
              disabled={card.isMatched || flippedCards.includes(card.id) || flippedCards.length >= 2}
              className={`
                aspect-square rounded-xl shadow-lg transform transition-all duration-300
                ${card.isFlipped || card.isMatched
                  ? 'bg-white border-2 border-pink-300 scale-105'
                  : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:scale-110 active:scale-95'
                }
                ${card.isMatched ? 'opacity-70' : ''}
                flex items-center justify-center text-2xl
              `}
            >
              {card.isFlipped || card.isMatched ? (
                <span className="animate-bounce">{card.symbol}</span>
              ) : (
                <span className="text-white/80">❓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Game over overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 text-center max-w-sm">
            <h2 className="text-3xl font-jersey font-bold text-gray-800 mb-4">
              {isGameComplete ? '🎉 ¡Perfecto! 🎉' : '⏰ ¡Tiempo Agotado!'}
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="bg-purple-50 rounded-2xl p-3 border border-purple-200">
                <div className="text-sm font-poppins text-purple-700 mb-2">📊 Resultados:</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs font-poppins text-gray-600">Parejas encontradas:</span>
                    <span className="text-xs font-poppins font-bold text-green-600">{matchedPairs}/6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-poppins text-gray-600">Movimientos:</span>
                    <span className="text-xs font-poppins font-bold text-blue-600">{moves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-poppins text-gray-600">Tiempo restante:</span>
                    <span className="text-xs font-poppins font-bold text-purple-600">{timeLeft}seg</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-600" />
                  <span className="text-xl font-poppins font-bold text-yellow-600">
                    +{Math.max(1, Math.round((matchedPairs * 2 + Math.max(0, timeLeft) - Math.max(0, moves - 12)) * bonusMultipliers[eggType]))} monedas
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <span className="text-xl font-poppins font-bold text-pink-600">
                    +{Math.max(1, Math.round((matchedPairs * 3 + (matchedPairs === 6 ? 10 : 0)) * bonusMultipliers[eggType]))} felicidad
                  </span>
                </div>
              </div>
              
              {bonusMultipliers[eggType] > 1 && (
                <div className="bg-yellow-50 rounded-xl p-2 border border-yellow-200">
                  <span className="text-xs font-poppins text-yellow-700">
                    ✨ Bonus {eggType}: +{Math.round((bonusMultipliers[eggType] - 1) * 100)}%
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 font-poppins">Regresando al juego principal...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;