import { CONFIG_FULL_API_URL_PATH } from "../config/gameConfig";
import { TGameConfiguration } from "../interface/gameConfig";

export async function getGameConfiguration() {
  const response = await fetch(CONFIG_FULL_API_URL_PATH);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<TGameConfiguration>;
}

export async function setGameConfiguration(param: TGameConfiguration) {
  const response = await fetch(CONFIG_FULL_API_URL_PATH, {
    method: "POST",
    body: JSON.stringify(param),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text();
  }
}
