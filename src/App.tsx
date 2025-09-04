import React from 'react';
import { useState } from 'react';
import { usePetGame } from './hooks/usePetGame';
import { GameAction } from './types/Pet';
import Pet from './components/Pet';
import Stats from './components/Stats';
import ActionButtons from './components/ActionButtons';
import Particles from './components/Particles';
import EggSelection from './components/EggSelection';
import EggHatching from './components/EggHatching';
import PetNaming from './components/PetNaming';
import GameSelection from './components/GameSelection';
import BubblePopGame from './components/BubblePopGame';
import MemoryGame from './components/MemoryGame';
import FoodShop from './components/FoodShop';
import FoodSelectionPopup from './components/FoodSelectionPopup';
import { AlertTriangle } from 'lucide-react';
import InstallButton from "./components/InstallButton";


function App() {
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [showHygieneWarning, setShowHygieneWarning] = useState(false);
  const [showFoodSelectionPopup, setShowFoodSelectionPopup] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [containerBgColor, setContainerBgColor] = useState('bg-white/80');
  const { 
    pet, 
    playerData,
    showParticles, 
    showCleaningBubbles,
    gamePhase,
    setGamePhase,
    selectedEggType,
    currentGame,
    feedingFoodId,
    performAction, 
    toggleSleep,
    resetPet, 
    selectEgg,
    hatchEgg,
    initializePet,
    startGame,
    endGame,
    cancelGameSelection,
    cancelGame,
    purchaseFood,
    openShop
  } = usePetGame();

  const handleAction = (actionType: GameAction['type']) => {
    performAction(actionType);
  };

  const handleFeedAction = () => {
    // Verificar higiene antes de permitir comer
    if (pet.stats.cleanliness < 80) {
      setShowHygieneWarning(true);
      setTimeout(() => setShowHygieneWarning(false), 3000);
    } else {
      setShowFoodSelectionPopup(true);
    }
  };

  const handlePurchaseFood = (foodId: string, quantity: number): boolean => {
    return purchaseFood(foodId, quantity);
  };

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

  const backgroundOptions = [
    { name: 'Blanco', class: 'bg-white/90', preview: 'bg-white' },
    { name: 'Rosa', class: 'bg-pink-300/70', preview: 'bg-pink-300' },
    { name: 'Púrpura', class: 'bg-purple-300/70', preview: 'bg-purple-300' },
    { name: 'Azul', class: 'bg-blue-300/70', preview: 'bg-blue-300' },
    { name: 'Verde', class: 'bg-green-300/70', preview: 'bg-green-300' },
    { name: 'Amarillo', class: 'bg-yellow-300/70', preview: 'bg-yellow-300' },
    { name: 'Gris', class: 'bg-gray-300/80', preview: 'bg-gray-300' },
    { name: 'Imagen-1', class: 'bg-image-1', preview: 'bg-gradient-to-br from-green-400 to-blue-500' },
    { name: 'Imagen-2', class: 'bg-image-2', preview: 'bg-gradient-to-br from-purple-400 to-blue-500' },
  ];

  // Show different phases based on game state
  if (gamePhase === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (gamePhase === 'eggSelection') {
    return <EggSelection onEggSelect={selectEgg} playerCoins={playerData.coins} />;
  }

  if (gamePhase === 'hatching' && selectedEggType) {
    return <EggHatching eggType={selectedEggType} onHatch={hatchEgg} />;
  }

  if (gamePhase === 'naming') {
    return <PetNaming selectedEggType={selectedEggType!} onComplete={initializePet} />;
  }

  if (gamePhase === 'gameSelection') {
    return <GameSelection onSelectGame={startGame} onCancel={cancelGameSelection} />;
  }

  if (gamePhase === 'inGame' && currentGame === 'bubblePop') {
    return <BubblePopGame onGameEnd={(results) => endGame('bubblePop', results)} onCancel={cancelGame} eggType={pet.eggType} />;
  }

  if (gamePhase === 'inGame' && currentGame === 'memoryGame') {
    return <MemoryGame onGameEnd={(results) => endGame('memoryGame', results)} onCancel={cancelGame} eggType={pet.eggType} />;
  }

  if (gamePhase === 'shop') {
    return (
      <FoodShop 
        playerCoins={playerData.coins}
        foodInventory={playerData.foodInventory}
        onPurchaseFood={handlePurchaseFood}
        onClose={() => setGamePhase('playing')}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 p-4 ${
      pet.isSleeping 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
        : 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200'
    }`}>
      
      {/* Sleep overlay for extra darkness */}
      {pet.isSleeping && (
        <div className="fixed inset-0 bg-black/30 pointer-events-none z-10 transition-opacity duration-1000" />
      )}
      
      {/* Floating decorations */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${
        pet.isSleeping ? 'opacity-30' : 'opacity-100'
      }`}>
        <div className="absolute top-10 left-10 text-4xl opacity-20 animate-float">🌸</div>
        <div className="absolute top-32 right-16 text-3xl opacity-30 animate-float-delayed">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-25 animate-float">🎀</div>
        <div className="absolute bottom-32 right-10 text-4xl opacity-20 animate-float-delayed">💝</div>
      </div>

      <div className="max-w-md mx-auto relative z-20">
        {/* Header */}
        <div className="relative text-center mb-6 z-99">
          <h1 className={`text-3xl font-jersey font-bold mb-2 transition-all duration-1000 ${
            pet.isSleeping 
              ? 'text-white/80' 
              : 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent'
          }`}>
            {pet.name}
          </h1>
          <p className={`text-sm font-poppins transition-colors duration-1000 ${
            pet.isSleeping ? 'text-white/60' : 'text-gray-600'
          }`}>
            Yamagotchi, mascotita virtual 🌟
          </p>
          
          {/* Sleep indicator */}
          {pet.isSleeping && (
            <div className="mt-2">
              <span className="text-white/80 text-sm font-poppins animate-pulse">💤 Durmiendo... +0.5% energía/seg</span>
            </div>
          )}
          
          {/* Coins, Shop and Mood - moved here */}
          <div className="flex items-center gap-3 justify-center mt-4" style={{ position: "relative", zIndex: 999 }}>
            {/* Shop Button */}
            <button
              onClick={openShop}
              className="bg-purple-100/80 backdrop-blur-sm rounded-full px-3 py-2 border-2 border-purple-300/50 shadow-lg hover:bg-purple-200/80 transition-colors"
            >
              <div className="flex items-center gap-1">
                <span className="text-lg">🛒</span>
              </div>
            </button>
            
            {/* Coins Display */}
            <div className="bg-yellow-100/80 backdrop-blur-sm rounded-full px-3 py-2 border-2 border-yellow-300/50 shadow-lg">
              <div className="flex items-center gap-1">
                <span className="text-lg">💰</span>
                <span className="font-bold font-poppins text-yellow-700 text-sm">{playerData.coins}</span>
              </div>
            </div>
            
            {/* Background Color Button */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="bg-gray-100/80 backdrop-blur-sm rounded-full px-3 py-2 border-2 border-gray-300/50 shadow-lg hover:bg-gray-200/80 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span className="text-lg">🎨</span>
                </div>
              </button>
              
              {/* Color Picker Popup */}
              {showColorPicker && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 z-50 min-w-[200px]">
                  <div className="text-sm font-poppins font-medium text-gray-700 mb-3 text-center">
                    Papel tapiz
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {backgroundOptions.map((option) => (
                      <button
                        key={option.class}
                        onClick={() => {
                          setContainerBgColor(option.class);
                          setShowColorPicker(false);
                        }}
                        className={`
                          flex items-center gap-2 p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105
                          ${containerBgColor === option.class 
                            ? 'border-purple-400 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className={`w-4 h-4 rounded-full ${option.preview} border border-gray-300`}></div>
                        {/* <span className="text-xs font-poppins text-gray-700">{option.name}</span> */}
                      </button>
                    ))}
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 hover:bg-gray-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            
            {/* Mood Button */}
            <div className="text-3xl">
              <button
                onClick={() => setShowMoodPopup(!showMoodPopup)}
                className="hover:scale-110 transform transition-all duration-200 relative"
              >
                {getMoodEmoji(pet.mood)}
                
                {/* Mood Popup */}
                {showMoodPopup && (
                  <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 z-50 min-w-[200px]">
                    <div className="text-sm font-poppins text-gray-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Estado:</span>
                        <span className="capitalize text-gray-600">
                          {pet.mood === 'happy' ? 'feliz' :
                           pet.mood === 'sad' ? 'triste' :
                           pet.mood === 'sleeping' ? 'durmiendo' :
                           pet.mood === 'sick' ? 'enfermo' :
                           pet.mood === 'dirty' ? 'sucio' :
                           pet.mood === 'hungry' ? 'hambriento' :
                           pet.mood === 'playing' ? 'jugando' : pet.mood}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Edad:</span>
                        <span className="text-gray-600">{Math.floor(pet.age / 60)} horas</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Nivel:</span>
                        <span className="text-gray-600">{pet.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Tipo:</span>
                        <span className="text-gray-600 capitalize">
                          {pet.eggType === 'ordinario' ? 'ordinario' :
                           pet.eggType === 'common' ? 'común' :
                           pet.eggType === 'rare' ? 'raro' :
                           pet.eggType === 'epic' ? 'épico' :
                           pet.eggType === 'legendary' ? 'legendario' :
                           pet.eggType === 'mythic' ? 'mítico' : pet.eggType}
                        </span>
                      </div>
                    </div>
                    
                    {/* Close button */}
                    <button
                      onClick={() => setShowMoodPopup(false)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 hover:bg-gray-500 text-white rounded-full text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Pet Display */}
        <div className={`backdrop-blur-sm rounded-3xl p-2 shadow-xl border mb-4 relative transition-all duration-1000 ${
          pet.isSleeping 
            ? 'bg-gray-800/80 border-gray-600/50' 
            : `${containerBgColor} border-white/50`
        }`}>

          {/* Stats */}
          <Stats stats={pet.stats} />
          
          

          {/* Pet Component */}
          <Pet pet={pet} feedingFoodId={feedingFoodId} />

          {/* Action Buttons */}
          <div className="flex justify-center items-center mb-1">
            <div className="flex justify-center items-center gap-2 mb-4 sm:mb-0">
              <ActionButtons 
                onAction={handleAction}
                onFeedAction={handleFeedAction}
                onToggleSleep={toggleSleep}
                isSleeping={pet.isSleeping}
                disabled={!pet.isAlive}
              />
            </div>
          </div>

        </div>

        {/* Game Info */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
          <h3 className="font-semibold font-jersey text-gray-700 mb-2 text-center">💡 Tips</h3>
          <ul className="text-xs font-poppins text-gray-600 space-y-1">
            <li>• Las estadísticas de tu mascota disminuyen con el tiempo</li>
            <li>• ¡Mantén todas las barras altas para una mascota feliz!</li>
            <li>• Salud baja significa que tu mascota necesita medicina</li>
            <li>• Jugar hace feliz a tu mascota pero la cansa</li>
            <li>• Tu progreso se guarda automáticamente</li>
          </ul>
          
        </div>

        {/* Particles Effect */}
        <Particles show={showParticles} type={showCleaningBubbles ? 'cleaning' : 'default'} />

        {/* Info */}
        <div className="mt-8 mb-8 text-center">
          <div className={`backdrop-blur-sm rounded-2xl p-4 shadow-lg border transition-all duration-1000 ${
            pet.isSleeping 
              ? 'bg-gray-800/60 border-gray-600/50 text-white/70' 
              : 'bg-white/60 border-white/50 text-gray-600'
          }`}>
            <p className="text-xs font-poppins mb-2">
              🎮 Desarrollado por <span className="font-semibold">Fabi Yamada</span>.
            </p>
            <p className="text-xs font-poppins">
              💖 Apoya el desarrollo del Yamagotchi:{' '}
              <a 
                href="https://bolt.new/?rid=yfsvis" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`font-semibold hover:underline transition-colors ${
                  pet.isSleeping ? 'text-pink-300 hover:text-pink-200' : 'text-pink-600 hover:text-pink-700'
                }`}
              >
                Creando tu cuenta en Bolt con mi enlace
              </a> (ambos obtenemos 200K Tokens extra).
            </p>
            <p className="text-xs font-poppins mb-3">
              🐛 Reporta bugs o envía ideas:{' '}
              <a 
                href="https://www.instagram.com/fabiyamada_art/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`font-semibold hover:underline transition-colors ${
                  pet.isSleeping ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                @fabiyamada_art 
              </a>
            </p>
           
          </div>
        </div>

        
{/* Danger Zone */}
        <div className="mt-8 mb-8 text-center">
          <div className={`backdrop-blur-sm rounded-2xl p-4 shadow-lg border transition-all duration-1000 ${
            pet.isSleeping 
              ? 'bg-gray-800/60 border-gray-600/50 text-white/70' 
              : 'bg-white/60 border-white/50 text-gray-600'
          }`}>
            <p className="text-xs font-poppins mb-2">
              ☣️ <span className="font-semibold">Zona Peligrosa y de Pruebas</span>.
            </p>
            
            <p className="text-xs font-poppins mb-3">
             Si das click aquí tu mascota actual desaparecerá. Conservarás tus monedas y podras comprar otro huevito si así lo deseas:              
            </p>

            {/* Reset Button - Moved to end with warning styling */}
          <div className="mt-4 mb-6 text-center">
            <button
              onClick={resetPet}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-poppins rounded-full text-sm transition-colors border-2 border-red-600 shadow-lg"
            >
              <AlertTriangle size={16} />
              Reiniciar Mascota
            </button>
          </div>

            <p className="text-xs font-poppins mb-3">
            El siguiente botón corresponde a las pruebas para instalar el juego como app. De momento está probada su funcionalidad en el navegador Chrome para escritorio. Si puedes instalarlo en otro dispositivo, hazme saber.            
            </p>
            
            <InstallButton />

            
          </div>
        </div>


        
      </div>

      

      {/* Food Selection Popup */}
      {showFoodSelectionPopup && (
        <FoodSelectionPopup
          playerData={playerData}
          pet={pet}
          onFeed={(foodId) => performAction('feed', foodId)}
          onClose={() => setShowFoodSelectionPopup(false)}
          onOpenShop={() => {
            setShowFoodSelectionPopup(false);
            setGamePhase('shop');
          }}
        />
      )}

      {/* Hygiene Warning Popup */}
      {showHygieneWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 max-w-sm w-full text-center">
            <div className="mb-4">
              <div className="text-6xl mb-4">🚫</div>
              <h3 className="text-xl font-jersey font-bold text-red-600 mb-2">
                ¡No puede comer!
              </h3>
              <p className="text-gray-700 font-poppins mb-4">
                Debes asear a <span className="font-bold text-pink-600">{pet.name}</span> antes de comer.
              </p>
              <div className="bg-red-50 rounded-2xl p-3 border border-red-200">
                <p className="text-sm font-poppins text-red-700">
                  💧 Limpieza actual: {Math.round(pet.stats.cleanliness)}%
                </p>
                <p className="text-xs font-poppins text-red-600 mt-1">
                  Necesita al menos 80% de limpieza
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowHygieneWarning(false);
                  performAction('clean');
                }}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-poppins font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🧼 Limpiar ahora
              </button>
              
              <button
                onClick={() => setShowHygieneWarning(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-poppins font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}


      

      
    </div>



  
  );
}




export default App;