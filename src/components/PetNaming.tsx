import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { EggType } from '../types/Pet';

interface PetNamingProps {
  selectedEggType: EggType;
  onComplete: (name: string) => void;
}

const PetNaming: React.FC<PetNamingProps> = ({ selectedEggType, onComplete }) => {
  const [petName, setPetName] = useState('');

  const EGG_TO_COLOR_MAP: Record<EggType, string> = {
    common: '#A8A8A8',     // Gray
    rare: '#4A90E2',       // Blue
    epic: '#8E44AD',       // Purple
    legendary: '#F39C12',  // Gold/Orange
    mythic: '#E91E63',     // Pink/Magenta
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (petName.trim()) {
      onComplete(petName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 max-w-md w-full">
        <div className="text-center">
          <div className="mb-6">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-jersey font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              ¡Tu mascota ha nacido! 🎉
            </h1>
            <div className="space-y-4">
              <p className="text-gray-600 font-poppins">Ahora dale un nombre kawaii</p>
              
              {/* Pet Preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full shadow-lg animate-bounce"
                    style={{
                      backgroundColor: EGG_TO_COLOR_MAP[selectedEggType],
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
                    }}
                  >
                    {/* Eyes */}
                    <div className="absolute top-6 left-4 flex space-x-3">
                      <div className="w-3 h-3 bg-black rounded-full">
                        <div className="w-1 h-1 bg-white rounded-full ml-0.5 mt-0.5 animate-pulse"></div>
                      </div>
                      <div className="w-3 h-3 bg-black rounded-full">
                        <div className="w-1 h-1 bg-white rounded-full ml-0.5 mt-0.5 animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Happy blush */}
                    <div className="absolute top-9 left-1 w-2 h-1.5 bg-pink-200 rounded-full opacity-60"></div>
                    <div className="absolute top-9 right-1 w-2 h-1.5 bg-pink-200 rounded-full opacity-60"></div>
                  </div>
                  
                  {/* Sparkles around pet */}
                  <div className="absolute -top-2 -left-2 text-yellow-400 animate-ping">✨</div>
                  <div className="absolute -top-1 -right-3 text-pink-400 animate-ping" style={{ animationDelay: '0.5s' }}>💖</div>
                  <div className="absolute -bottom-2 -right-1 text-purple-400 animate-ping" style={{ animationDelay: '1s' }}>🌟</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-jersey font-semibold mb-3">
                ¿Cómo se llamará tu mascota? 🌟
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Escribe un nombre kawaii..."
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-center text-lg font-poppins font-medium bg-white/80"
                maxLength={15}
                autoFocus
              />
              <p className="text-xs font-poppins text-gray-500 mt-2">Máximo 15 caracteres</p>
            </div>

            <button
              type="submit"
              disabled={!petName.trim()}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-poppins font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
            >
              ¡Empezar a jugar! ✨
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetNaming;