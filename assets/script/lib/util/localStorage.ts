import { game, sys } from "cc";
import { LOCAL_STORAGE_KEY } from "../enum/localStorage";
import { GAME_EVENT } from "../enum/game";
import { TLocalGameConfiguration } from "../../interface/gameConfig";

export function getHighscoreFromLocalStorage() {
  return (
    Number(sys.localStorage.getItem(LOCAL_STORAGE_KEY.COCOS_HIGHSCORE)) || 0
  );
}

export function updateLocalStorageHighscore(highscore: number) {
  sys.localStorage.setItem(
    LOCAL_STORAGE_KEY.COCOS_HIGHSCORE,
    Math.round(highscore).toString()
  );
}

export function getSoundStateFromLocalStorage() {
  const state = sys.localStorage.getItem(LOCAL_STORAGE_KEY.COCOS_SOUND_STATE);

  if (state === undefined || state === null) {
    return true;
  }

  return Boolean(Number(state));
}

export function updateLocalStorageSoundState(state: boolean) {
  const value = state ? 1 : 0;
  sys.localStorage.setItem(
    LOCAL_STORAGE_KEY.COCOS_SOUND_STATE,
    value.toString()
  );

  game?.emit(GAME_EVENT.SOUND_STATE_CHANGE, state);
}

export function getUsernameFromLocalStorage() {
  return sys.localStorage.getItem(LOCAL_STORAGE_KEY.COCOS_USERNAME) ?? "";
}

export function updateLocalStorageUsername(username: string) {
  sys.localStorage.setItem(LOCAL_STORAGE_KEY.COCOS_USERNAME, username);
}

export function getLocalConfigurationFromLocalStorage() {
  const currentConfig = sys.localStorage.getItem(
    LOCAL_STORAGE_KEY.COCOS_LOCAL_GAME_CONFIG_KEY
  );
  if (!currentConfig) return null;
  return JSON.parse(currentConfig);
}

export function updateLocalStorageLocalConfiguration(
  gameConfig: TLocalGameConfiguration
) {
  return sys.localStorage.setItem(
    LOCAL_STORAGE_KEY.COCOS_LOCAL_GAME_CONFIG_KEY,
    JSON.stringify(gameConfig)
  );
}
