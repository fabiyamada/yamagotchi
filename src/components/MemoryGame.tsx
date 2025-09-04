import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Coins, Heart } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // Refs para evitar múltiples llamadas y race conditions
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Fisher-Yates shuffle algorithm for true randomness
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const gameSymbols = symbols.slice(0, 6); // Use 6 different symbols
    const cardPairs = [...gameSymbols, ...gameSymbols]; // Create pairs
    
    // Proper shuffle
    const shuffledCards = shuffleArray(cardPairs)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
    setIsProcessing(false);
    setGameEnded(false);
    gameEndedRef.current = false;
  }, []);

  // Start game on mount
  useEffect(() => {
    initializeGame();
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [initializeGame]);

  // Calculate rewards (memoized to avoid recalculation)
  const calculateRewards = useCallback(() => {
    const multiplier = bonusMultipliers[eggType];
    
    // Reduced coin rewards to 30% of original
    const baseCoins = matchedPairs * 0.6; // Was 2, now 0.6 (30% of 2)
    const timeBonus = Math.max(0, timeLeft) * 0.3; // 30% of time bonus
    const movesPenalty = Math.max(0, moves - 12) * 0.3; // 30% of penalty
    
    const rawCoins = (baseCoins + timeBonus - movesPenalty) * multiplier;
    const coinsEarned = Math.round(rawCoins);
    
    // Happiness stays the same for now
    const happinessEarned = Math.round((matchedPairs * 3 + (matchedPairs === 6 ? 10 : 0)) * multiplier);
    
    return {
      coinsEarned: Math.max(1, coinsEarned),
      happinessEarned: Math.max(1, happinessEarned)
    };
  }, [matchedPairs, timeLeft, moves, eggType, bonusMultipliers]);

  // End game function (prevents multiple calls)
  const endGame = useCallback(() => {
    if (gameEndedRef.current) return;
    
    gameEndedRef.current = true;
    setGameEnded(true);
    
    timeoutRef.current = setTimeout(() => {
      const rewards = calculateRewards();
      onGameEnd(rewards);
    }, 1500); // Increased delay for better UX
  }, [calculateRewards, onGameEnd]);

  // Game timer
  useEffect(() => {
    if (!gameStarted || gameEnded) return;
    
    if (timeLeft > 0 && matchedPairs < 6) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || matchedPairs === 6) {
      endGame();
    }
  }, [timeLeft, matchedPairs, gameStarted, gameEnded, endGame]);

  // Handle card flip (fixed race conditions)
  const flipCard = useCallback((cardId: number) => {
    // Prevent multiple clicks and invalid actions
    if (isProcessing) return;
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    if (gameEnded) return;
    
    // Check if card exists and is not matched
    const targetCard = cards.find(card => card.id === cardId);
    if (!targetCard || targetCard.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state immediately
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      
      // Get current card data to avoid race conditions
      setCards(currentCards => {
        const firstCard = currentCards.find(card => card.id === firstId);
        const secondCard = currentCards.find(card => card.id === secondId);

        if (!firstCard || !secondCard) {
          setIsProcessing(false);
          setFlippedCards([]);
          return currentCards;
        }

        if (firstCard.symbol === secondCard.symbol) {
          // Match found!
          timeoutRef.current = setTimeout(() => {
            setCards(prev => prev.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, isMatched: true }
                : card
            ));
            setMatchedPairs(prev => prev + 1);
            setFlippedCards([]);
            setIsProcessing(false);
          }, 600);
        } else {
          // No match, flip back
          timeoutRef.current = setTimeout(() => {
            setCards(prev => prev.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, isFlipped: false }
                : card
            ));
            setFlippedCards([]);
            setIsProcessing(false);
          }, 120000);
        }

        return currentCards;
      });
    }
  }, [cards, flippedCards, isProcessing, gameEnded]);

  const isGameComplete = matchedPairs === 6;
  const isGameOver = timeLeft === 0 || isGameComplete;
  const rewards = calculateRewards();

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
          disabled={isProcessing}
          className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors disabled:opacity-50"
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
              disabled={
                card.isMatched || 
                flippedCards.includes(card.id) || 
                flippedCards.length >= 2 || 
                isProcessing ||
                gameEnded
              }
              className={`
                aspect-square rounded-xl shadow-lg transform transition-all duration-300
                ${card.isFlipped || card.isMatched
                  ? 'bg-white border-2 border-pink-300 scale-105'
                  : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:scale-110 active:scale-95'
                }
                ${card.isMatched ? 'opacity-70' : ''}
                ${isProcessing || gameEnded ? 'cursor-not-allowed' : 'cursor-pointer'}
                flex items-center justify-center text-2xl
                disabled:hover:scale-100
              `}
            >
              {card.isFlipped || card.isMatched ? (
                <span className={card.isMatched ? 'text-2xl' : 'animate-bounce text-2xl'}>
                  {card.symbol}
                </span>
              ) : (
                <span className="text-white/80">❓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Processing indicator */}
      {isProcessing && !gameEnded && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
            <span className="text-sm font-poppins text-gray-600">🤔 Pensando...</span>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {isGameOver && gameEnded && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 text-center max-w-sm mx-4">
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
                    +{rewards.coinsEarned} monedas
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <span className="text-xl font-poppins font-bold text-pink-600">
                    +{rewards.happinessEarned} felicidad
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
            
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full"></div>
              <p className="text-gray-600 font-poppins text-sm">Regresando al juego principal...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;