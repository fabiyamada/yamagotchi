import { PetState } from '../types/Pet';
import { PlayerData } from '../types/Pet';

const PET_STORAGE_KEY = 'yamagotchi-pet-data';
const PLAYER_STORAGE_KEY = 'yamagotchi-player-data';

export const savePetData = (petData: PetState): void => {
  try {
    localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(petData));
  } catch (error) {
    console.error('Error al guardar datos de la mascota:', error);
  }
};

export const loadPetData = (): PetState | null => {
  try {
    const savedData = localStorage.getItem(PET_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error al cargar datos de la mascota:', error);
    return null;
  }
};

export const clearPetData = (): void => {
  try {
    localStorage.removeItem(PET_STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar datos de la mascota:', error);
  }
};

export const savePlayerData = (playerData: PlayerData): void => {
  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(playerData));
  } catch (error) {
    console.error('Error al guardar datos del jugador:', error);
  }
};

export const loadPlayerData = (): PlayerData | null => {
  try {
    const savedData = localStorage.getItem(PLAYER_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error al cargar datos del jugador:', error);
    return null;
  }
};

export const clearPlayerData = (): void => {
  try {
    localStorage.removeItem(PLAYER_STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar datos del jugador:', error);
  }
};