import { useState, useEffect, useCallback } from 'react';
import { PetState, PetStats, GameAction, GamePhase, EggType, PlayerData, EGG_COSTS, INITIAL_FOOD_STOCK, FOOD_ITEMS, GameType, AVAILABLE_HATS } from '../types/Pet';
import { savePetData, loadPetData, clearPetData, savePlayerData, loadPlayerData, clearPlayerData } from '../utils/localStorage';

const INITIAL_STATS: PetStats = {
  hunger: 80,
  energy: 70,
  happiness: 60,
  health: 100,
  cleanliness: 90,
  coins: 0,
};

const INITIAL_PET_STATE: PetState = {
  name: '',
  color: '#FFB6C1',
  eggType: 'ordinario',
  mood: 'happy',
  stats: INITIAL_STATS,
  lastUpdated: Date.now(),
  isAlive: true,
  age: 0,
  level: 1,
  isSleeping: false,
};

const INITIAL_PLAYER_DATA: PlayerData = {
  coins: 0,
  totalPetsHatched: 0,
  foodInventory: INITIAL_FOOD_STOCK,
  ownedHats: ['none'], // Everyone starts with "no hat"
};

const EGG_TO_COLOR_MAP: Record<EggType, string> = {
  ordinario: '#D3D3D3',  // Light Gray
  common: '#A8A8A8',     // Gray
  rare: '#4A90E2',       // Blue
  epic: '#8E44AD',       // Purple
  legendary: '#F39C12',  // Gold/Orange
  mythic: '#E91E63',     // Pink/Magenta
};

export const usePetGame = () => {
  const [pet, setPet] = useState<PetState>(INITIAL_PET_STATE);
  const [playerData, setPlayerData] = useState<PlayerData>(INITIAL_PLAYER_DATA);
  const [lastAction, setLastAction] = useState<GameAction | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [showCleaningBubbles, setShowCleaningBubbles] = useState(false);
  const [gamePhase, setGamePhase] = useState<GamePhase>('loading');
  const [selectedEggType, setSelectedEggType] = useState<EggType | null>(null);
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [feedingFoodId, setFeedingFoodId] = useState<string | null>(null);

  // Load saved pet data on mount
  useEffect(() => {
    const savedPet = loadPetData();
    const savedPlayer = loadPlayerData();
    
    if (savedPlayer) {
      // Asegurar que foodInventory siempre esté definido
      setPlayerData({
        ...INITIAL_PLAYER_DATA,
        ...savedPlayer,
        foodInventory: {
          ...INITIAL_FOOD_STOCK,
          ...(savedPlayer.foodInventory || {})
        }
      });
    } else {
      // Nuevo jugador, dar monedas iniciales
      const newPlayerData = { ...INITIAL_PLAYER_DATA, coins: 50 };
      setPlayerData(newPlayerData);
      savePlayerData(newPlayerData);
    }
    
    if (savedPet) {
      setGamePhase('playing');
      // Calcular tiempo transcurrido y actualizar estadísticas
      const timePassed = Date.now() - savedPet.lastUpdated;
      const hoursPassedDecimal = timePassed / (1000 * 60 * 60);
      const minutesPassed = timePassed / (1000 * 60);
      
      const updatedStats = { ...savedPet.stats };
      
      // Disminuir estadísticas con el tiempo (deterioro más realista)
      updatedStats.hunger = Math.max(0, savedPet.stats.hunger - hoursPassedDecimal * 15);
      updatedStats.energy = Math.max(0, savedPet.stats.energy - hoursPassedDecimal * 10);
      updatedStats.happiness = Math.max(0, savedPet.stats.happiness - hoursPassedDecimal * 8);
      updatedStats.cleanliness = Math.max(0, savedPet.stats.cleanliness - hoursPassedDecimal * 5);
      
      // La salud disminuye si otras estadísticas están bajas
      if (updatedStats.hunger < 20 || updatedStats.happiness < 20) {
        updatedStats.health = Math.max(0, savedPet.stats.health - hoursPassedDecimal * 12);
      }

      setPet({
        ...savedPet,
        stats: updatedStats,
        age: savedPet.age + minutesPassed,
        lastUpdated: Date.now(),
      });
    } else {
      setGamePhase('eggSelection');
    }
  }, []);

  // Guardar automáticamente datos del jugador
  useEffect(() => {
    if (playerData !== INITIAL_PLAYER_DATA) {
      savePlayerData(playerData);
    }
  }, [playerData]);

  // Guardar automáticamente datos de la mascota
  useEffect(() => {
    if (pet !== INITIAL_PET_STATE) {
      savePetData(pet);
    }
  }, [pet]);

  // Actualizaciones de estadísticas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prevPet => {
        if (!prevPet.isAlive) return prevPet;

        const newStats = { ...prevPet.stats };
        
        // Deterioro gradual de estadísticas (cada minuto)
        newStats.hunger = Math.max(0, newStats.hunger - 0.2);
        if (!prevPet.isSleeping) {
          newStats.energy = Math.max(0, newStats.energy - 0.15);
        }
        newStats.happiness = Math.max(0, newStats.happiness - 0.1);
        newStats.cleanliness = Math.max(0, newStats.cleanliness - 0.08);
        
        // Salud afectada por otras estadísticas
        if (newStats.hunger < 20 || newStats.happiness < 20) {
          newStats.health = Math.max(0, newStats.health - 0.2);
        } else if (newStats.hunger > 80 && newStats.happiness > 80) {
          newStats.health = Math.min(100, newStats.health + 0.1);
        }

        return {
          ...prevPet,
          stats: newStats,
          lastUpdated: Date.now(),
          age: prevPet.age + 1,
        };
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Ganancia de energía durante el sueño
  useEffect(() => {
    if (!pet.isSleeping) return;

    const sleepInterval = setInterval(() => {
      setPet(prevPet => {
        if (!prevPet.isSleeping) return prevPet;
        
        const newStats = { ...prevPet.stats };
        newStats.energy = Math.min(100, newStats.energy + 0.5);
        
        return {
          ...prevPet,
          stats: newStats,
          lastUpdated: Date.now(),
        };
      });
    }, 1000); // Cada segundo

    return () => clearInterval(sleepInterval);
  }, [pet.isSleeping]);

  // Actualizar estado de ánimo basado en estadísticas
  useEffect(() => {
    setPet(prevPet => {
      // Si la mascota está durmiendo, mantener el mood como 'sleeping'
      if (prevPet.isSleeping) {
        return prevPet.mood !== 'sleeping' ? { ...prevPet, mood: 'sleeping' } : prevPet;
      }

      const { stats } = prevPet;
      let newMood = prevPet.mood;

      if (stats.health < 30) {
        newMood = 'sick';
      } else if (stats.cleanliness < 30) {
        newMood = 'dirty';
      } else if (stats.hunger < 30) {
        newMood = 'hungry';
      } else if (stats.happiness > 70 && stats.health > 70) {
        newMood = 'happy';
      } else if (stats.happiness < 40) {
        newMood = 'sad';
      }

      return newMood !== prevPet.mood ? { ...prevPet, mood: newMood } : prevPet;
    });
  }
  )

  const performAction = useCallback((actionType: GameAction['type'], foodType?: string) => {
    const action: GameAction = {
      type: actionType,
      timestamp: Date.now(),
    };

    setPet(prevPet => {
      const newStats = { ...prevPet.stats };
      let newMood = prevPet.mood;

      switch (actionType) {
        case 'feed':
          if (!foodType || !FOOD_ITEMS[foodType]) {
            return prevPet; // No food type specified or invalid
          }
          
          // Check if player has this food in inventory
          const currentStock = playerData.foodInventory[foodType] || 0;
          if (currentStock <= 0) {
            return prevPet; // No stock available
          }
          
          // Consume food from inventory
          setPlayerData(prevData => ({
            ...prevData,
            foodInventory: {
              ...prevData.foodInventory,
              [foodType]: Math.max(0, currentStock - 1)
            }
          }));
          
          const selectedFood = FOOD_ITEMS[foodType];
          newStats.hunger = Math.min(100, newStats.hunger + selectedFood.hungerBoost);
          newStats.happiness = Math.min(100, newStats.happiness + selectedFood.happinessBoost);
          
          // Show food below pet
          setFeedingFoodId(foodType);
          setTimeout(() => setFeedingFoodId(null), 1500);
          break;
        case 'play':
          // No modificar estadísticas aquí, solo activar selección de juego
          setGamePhase('gameSelection');
          return prevPet; // Devolver mascota sin cambios
        case 'sleep':
          // El sueño ahora se maneja con la función toggleSleep
          return prevPet;
        case 'clean':
          newStats.cleanliness = Math.min(100, newStats.cleanliness + 35);
          newStats.happiness = Math.min(100, newStats.happiness + 10);
          // Activar animación de burbujas de limpieza
          setShowCleaningBubbles(true);
          setTimeout(() => setShowCleaningBubbles(false), 2000);
          break;
        case 'medicine':
          newStats.health = Math.min(100, newStats.health + 50);
          newStats.happiness = Math.max(0, newStats.happiness - 10);
          break;
      }

      return {
        ...prevPet,
        stats: newStats,
        mood: newMood,
        lastUpdated: Date.now(),
      };
    });

    setLastAction(action);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 2000);
  }, []);

  const toggleSleep = useCallback(() => {
    setPet(prevPet => {
      const newPet = {
        ...prevPet,
        isSleeping: !prevPet.isSleeping,
        mood: !prevPet.isSleeping ? 'sleeping' : 'happy',
        lastUpdated: Date.now(),
      };
      
      // Guardar inmediatamente al cambiar estado de sueño
      savePetData(newPet);
      return newPet;
    });
  }, []);

  const resetPet = useCallback(() => {
    clearPetData();
    setPet(INITIAL_PET_STATE);
    setPlayerData(prevData => ({ ...prevData, totalPetsHatched: 0 }));
    setLastAction(null);
    setGamePhase('eggSelection');
    setSelectedEggType(null);
  }, []);

  const selectEgg = useCallback((eggType: EggType) => {
    const cost = EGG_COSTS[eggType];
    
    // Verificar si el jugador tiene suficientes monedas
    if (cost > playerData.coins) {
      return; // No permitir la selección
    }
    
    // Descontar monedas
    setPlayerData(prevData => ({
      ...prevData,
      coins: prevData.coins - cost,
      totalPetsHatched: prevData.totalPetsHatched + 1,
    }));
    
    setSelectedEggType(eggType);
    setGamePhase('hatching');
  }, []);

  const hatchEgg = useCallback(() => {
    setGamePhase('naming');
  }, []);

  const initializePet = useCallback((name: string) => {
    if (!selectedEggType) return;
    
    const color = EGG_TO_COLOR_MAP[selectedEggType];
    const newPet = {
      ...INITIAL_PET_STATE,
      name,
      color,
      eggType: selectedEggType,
      lastUpdated: Date.now(),
    };
    setPet(newPet);
    setGamePhase('playing');
    savePetData(newPet);
  }, [selectedEggType]);

  const startGame = useCallback((gameType: GameType) => {
    setCurrentGame(gameType);
    setGamePhase('inGame');
  }, []);

  const endGame = useCallback((gameType: GameType, results: { coinsEarned: number; happinessEarned: number }) => {
    // Actualizar monedas del jugador
    setPlayerData(prevData => ({
      ...prevData,
      coins: prevData.coins + results.coinsEarned,
    }));
    
    setPet(prevPet => {
      const newStats = { ...prevPet.stats };
      newStats.coins = newStats.coins + results.coinsEarned;
      newStats.happiness = Math.min(100, newStats.happiness + results.happinessEarned);
      newStats.energy = Math.max(0, newStats.energy - 10); // Playing games costs energy
      
      const updatedPet = {
        ...prevPet,
        stats: newStats,
        mood: 'playing',
        lastUpdated: Date.now(),
      };
      
      // Guardar explícitamente los datos actualizados para asegurar que las monedas se mantengan
      savePetData(updatedPet);
      
      return updatedPet;
    });
    
    setCurrentGame(null);
    setGamePhase('playing');
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 2000);
  }, []);

  const cancelGameSelection = useCallback(() => {
    setGamePhase('playing');
  }, []);

  const cancelGame = useCallback(() => {
    setCurrentGame(null);
    setGamePhase('playing');
  }, []);

  const purchaseFood = useCallback((foodId: string, quantity: number): boolean => {
    const food = FOOD_ITEMS[foodId];
    if (!food) return false;
    
    const totalCost = food.price * quantity;
    
    if (playerData.coins < totalCost) {
      return false; // Not enough coins
    }
    
    // Update player data
    setPlayerData(prevData => ({
      ...prevData,
      coins: prevData.coins - totalCost,
      foodInventory: {
        ...prevData.foodInventory,
        [foodId]: (prevData.foodInventory[foodId] || 0) + quantity
      }
    }));
    
    return true;
  }, [playerData.coins]);

  const purchaseHat = useCallback((hatId: string): boolean => {
    const hat = AVAILABLE_HATS[hatId];
    if (!hat) return false;
    
    // Check if already owned
    if (playerData.ownedHats?.includes(hatId)) {
      return false;
    }
    
    // Check if can afford
    if (playerData.coins < hat.price) {
      return false;
    }
    
    // Check level requirement
    if (hat.unlockLevel && pet.level < hat.unlockLevel) {
      return false;
    }
    
    // Purchase hat
    setPlayerData(prevData => ({
      ...prevData,
      coins: prevData.coins - hat.price,
      ownedHats: [...(prevData.ownedHats || []), hatId]
    }));
    
    return true;
  }, [playerData.coins, playerData.ownedHats, pet.level]);

  const selectHat = useCallback((hatId: string) => {
    // Check if owned
    if (!playerData.ownedHats?.includes(hatId) && hatId !== 'none') {
      return;
    }
    
    setPet(prevPet => ({
      ...prevPet,
      selectedHat: hatId,
      lastUpdated: Date.now(),
    }));
  }, [playerData.ownedHats]);

  const openShop = useCallback(() => {
    setGamePhase('shop');
  }, []);

  return {
    pet,
    playerData,
    lastAction,
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
  };
};