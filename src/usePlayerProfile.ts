import { useState } from "react";
import {
  createPlayerData,
  loadPlayerData,
  savePlayerData,
  type PlayerData
} from "./player";

interface PlayerProfileState {
  data: PlayerData;
  error: string | null;
  canPersist: boolean;
}

function loadProfile(): PlayerProfileState {
  try {
    return { data: loadPlayerData(), error: null, canPersist: true };
  } catch (error) {
    console.error("Could not load local player data.", error);
    return {
      data: createPlayerData(),
      error: "Local player data could not be loaded. Stats will not be saved in this browser.",
      canPersist: false
    };
  }
}

export function usePlayerProfile() {
  const [profile, setProfile] = useState(loadProfile);

  const persist = (data: PlayerData): boolean => {
    if (!profile.canPersist) return false;
    try {
      savePlayerData(data);
      setProfile({ data, error: null, canPersist: true });
      return true;
    } catch (error) {
      console.error("Could not save local player data.", error);
      setProfile((current) => ({
        ...current,
        error: "Local player data could not be saved. Check this browser's storage settings."
      }));
      return false;
    }
  };

  return { ...profile, persist };
}
