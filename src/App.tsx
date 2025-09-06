// Agrega esto justo después de la línea donde obtienes los valores del hook

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
  openShop,
  purchaseHat,
  selectHat,
} = usePetGame();

// AÑADE ESTOS CONSOLE.LOGS PARA DEBUG:
console.log('=== DEBUG APP.TSX ===');
console.log('gamePhase:', gamePhase);
console.log('selectedEggType:', selectedEggType);
console.log('pet:', pet);
console.log('===================');

// También modifica la condición de hatching para agregar más debug:
if (gamePhase === 'hatching') {
  console.log('🥚 HATCHING PHASE - selectedEggType:', selectedEggType);
  if (selectedEggType) {
    console.log('✅ Rendering EggHatching component');
    return <EggHatching eggType={selectedEggType} onHatch={hatchEgg} />;
  } else {
    console.log('❌ selectedEggType is null/undefined');
    // Fallback - volver a egg selection si no hay selectedEggType
    return <EggSelection onEggSelect={selectEgg} playerCoins={playerData.coins} />;
  }
}