import { AsyncStorage } from './async-storage';
import { STORAGE_OBJECT_KEYS, STORAGE_STRING_KEYS } from './storageTypes';

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(
  key: STORAGE_STRING_KEYS,
): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(
  key: STORAGE_STRING_KEYS,
  value: string,
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export async function load(key: STORAGE_OBJECT_KEYS): Promise<any | null> {
  try {
    const almostThere = await AsyncStorage.getItem(key);

    if (!almostThere) {
      return null;
    }

    return JSON.parse(almostThere);
  } catch {
    return null;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function save(
  key: STORAGE_OBJECT_KEYS,
  value: any,
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export async function remove(key: STORAGE_OBJECT_KEYS): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}

/**
 * Burn it all to the ground.
 */
export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {}
}
