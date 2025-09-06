import React from 'react';
import { PetState, FOOD_ITEMS, AVAILABLE_HATS } from '../types/Pet';

interface PetProps {
  pet: PetState;
  feedingFoodId?: string | null;
}

const Pet: React.FC<PetProps> = ({ pet, feedingFoodId }) => {
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'sleeping': return '😴';
      case 'sick': return '🤒';
      case 'dirty': return '😵';
      case 'hungry': return '😋';
      case 'playing': return '😄';
      default: return '😊';
    }
  };

  const getPetAnimation = (mood: string) => {
    switch (mood) {
      case 'happy': return 'animate-bounce';
      case 'playing': return 'animate-pulse';
      case 'sleeping': return '';
      case 'sick': return 'animate-shake';
      default: return '';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[200px]">
      {/* Pet Body */}
      <div className="relative" style={{ zIndex: -1 }}>
        <div
          className={`w-32 h-32 rounded-full shadow-lg transform transition-all duration-300 ${getPetAnimation(pet.mood)}`}
          style={{
            backgroundColor: pet.color,
            boxShadow: `0 10px 25px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)`,
          }}
        >

          
        {/* Hat display */}
        {pet.selectedHat && pet.selectedHat !== 'none' && AVAILABLE_HATS[pet.selectedHat] && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="text-2xl">
              {AVAILABLE_HATS[pet.selectedHat].emoji}
            </div>
          </div>
        )}
          
          {/* Eyes */}
          <div className="absolute top-8 left-6 flex space-x-7">
            {/* Eye LEFT */}
            <div className={`w-5 bg-black transition-all duration-300 ${
              pet.mood === 'sleeping' ? 'h-.5 mt-2 rounded-full' : 'h-5 rounded-full'
            }`}>
              {pet.mood !== 'sleeping' && (
                <div className="w-1 h-1 bg-white rounded-full ml-1 mt-1 animate-pulse"></div>
              )}
            </div>
            
            {/* Eye RIGHT */}
            <div className={`w-5 bg-black transition-all duration-300 ${
              pet.mood === 'sleeping' ? 'h-0.5 mt-2 rounded-full' : 'h-5 rounded-full'
            }`}>
              {pet.mood !== 'sleeping' && (
                <div className="w-1 h-1 bg-white rounded-full ml-1 mt-1 animate-pulse"></div>
              )}
            </div>
          </div>

                        {/* Boca centrada entre los ojos */}
                    <div className="absolute top-9 pointer-events-none" style={{ left: '40%' }}>
                      <span className="block font-mono text-base leading-none select-none">
                        {(pet.mood === 'sleeping' || pet.mood === 'sick')
                          ? '–'
                          : pet.mood === 'sad'
                            ? '◠'
                            : '◡'}
                      </span>
                    </div>    

          {/* Blush (when happy) */}
          {pet.mood === 'happy' && (
            <>
              <div className="absolute top-12 left-2 w-3 h-2 bg-pink-200 rounded-full opacity-60"></div>
              <div className="absolute top-12 right-2 w-3 h-2 bg-pink-200 rounded-full opacity-60"></div>
            </>
          )}

          {/* Stains when cleanliness < 90% */}
          {pet.stats.cleanliness < 90 && (
            <>
              <div className="absolute top-10 right-4 w-2 h-2 bg-gray-700/60 rounded-full"></div>
              <div className="absolute bottom-8 left-3 w-1.5 h-1.5 bg-brown-600/50 rounded-full"></div>
              {pet.stats.cleanliness < 70 && (
                <>
                  <div className="absolute top-14 left-8 w-2.5 h-2.5 bg-gray-600/70 rounded-full"></div>
                  <div className="absolute bottom-12 right-6 w-1.5 h-1.5 bg-amber-800/60 rounded-full"></div>
                </>
              )}
              {pet.stats.cleanliness < 50 && (
                <div className="absolute top-16 right-8 w-3 h-2 bg-gray-800/60 rounded-full"></div>
              )}
            </>
          )}
        </div>
        
        {/* Food display below pet */}
        {feedingFoodId && FOOD_ITEMS[feedingFoodId] && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="text-4xl animate-bounce">
              {FOOD_ITEMS[feedingFoodId].emoji}
            </div>
          </div>
        )}
      </div>

      {/* Poop around pet area when cleanliness < 50% */}
      {pet.stats.cleanliness < 50 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-4 left-8 text-lg animate-pulse">💩</div>
          <div className="absolute bottom-6 right-12 text-sm" style={{ animationDelay: '0.5s' }}>💩</div>
          {pet.stats.cleanliness < 30 && (
            <>
              <div className="absolute bottom-8 left-16 text-base animate-pulse" style={{ animationDelay: '1s' }}>💩</div>
              <div className="absolute bottom-2 right-6 text-lg" style={{ animationDelay: '1.5s' }}>💩</div>
            </>
          )}
          {pet.stats.cleanliness < 10 && (
            <div className="absolute bottom-10 left-4 text-xl animate-pulse" style={{ animationDelay: '2s' }}>💩</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pet;