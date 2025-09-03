export interface PetStats {
  hunger: number;
  energy: number;
  happiness: number;
  health: number;
  cleanliness: number;
  coins: number;
}

export interface PetState {
  name: string;
  color: string;
  eggType: 'ordinario' | 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  mood: 'happy' | 'sad' | 'sleeping' | 'sick' | 'dirty' | 'hungry' | 'playing';
  stats: PetStats;
  lastUpdated: number;
  isAlive: boolean;
  age: number;
  level: number;
  isSleeping: boolean;
}

export interface GameAction {
  type: 'feed' | 'play' | 'sleep' | 'clean' | 'medicine';
  timestamp: number;
}

export type GamePhase = 'loading' | 'eggSelection' | 'hatching' | 'naming' | 'playing' | 'gameSelection' | 'inGame';
export type EggType = 'ordinario' | 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface PlayerData {
  coins: number;
  totalPetsHatched: number;
  foodInventory: Record<string, number>;
}

export const EGG_COSTS: Record<EggType, number> = {
  ordinario: 0,
  common: 100,
  rare: 200,
  epic: 400,
  legendary: 800,
  mythic: 1200,
};

export interface FoodOption {
  id: string;
  name: string;
  emoji: string;
  hungerBoost: number;
  happinessBoost: number;
  description: string;
  color: string;
  price: number;
}

export const FOOD_ITEMS: Record<string, FoodOption> = {
  apple: {
    id: 'apple',
    name: 'Manzana',
    emoji: '🍎',
    hungerBoost: 20,
    happinessBoost: 5,
    description: 'Fruta fresca y saludable',
    color: 'from-red-300 to-red-400',
    price: 1,
  },
  sushi: {
    id: 'sushi',
    name: 'Sushi',
    emoji: '🍣',
    hungerBoost: 35,
    happinessBoost: 15,
    description: 'Delicioso y nutritivo',
    color: 'from-green-300 to-green-400',
    price: 5,
  },
  meat: {
    id: 'meat',
    name: 'Carne',
    emoji: '🥩',
    hungerBoost: 40,
    happinessBoost: 10,
    description: 'Rica en proteínas',
    color: 'from-red-400 to-red-500',
    price: 5,
  },
  cake: {
    id: 'cake',
    name: 'Pastel',
    emoji: '🍰',
    hungerBoost: 25,
    happinessBoost: 25,
    description: 'Dulce y delicioso',
    color: 'from-pink-300 to-pink-400',
    price: 10,
  },
  pizza: {
    id: 'pizza',
    name: 'Pizza',
    emoji: '🍕',
    hungerBoost: 45,
    happinessBoost: 20,
    description: 'Comida favorita de todos',
    color: 'from-yellow-300 to-orange-400',
    price: 15,
  },
  ice_cream: {
    id: 'ice_cream',
    name: 'Helado',
    emoji: '🍦',
    hungerBoost: 15,
    happinessBoost: 30,
    description: 'Refrescante y dulce',
    color: 'from-blue-200 to-blue-300',
    price: 10,
  },
};

export const INITIAL_FOOD_STOCK: Record<string, number> = {
  apple: 3,
  sushi: 1,
  meat: 1,
  cake: 0,
  pizza: 0,
  ice_cream: 1,
};