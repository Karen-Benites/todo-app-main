import IStorage from "../IStorage.mjs";
import { STORAGE_KEYS } from "../ActionKeys.mjs";

class ThemeStorageManager extends IStorage {
  constructor(storage = window.localStorage) {
    super()
    if (ThemeStorageManager.instance) {
      return ThemeStorageManager.instance
    }

    this.storage = storage
    ThemeStorageManager.instance = this
  }

  loadItem() {
    return this.storage.getItem(STORAGE_KEYS.THEME);
  }

  storeItem(value) {
    this.storage.setItem(STORAGE_KEYS.THEME, value);
  }
}

const ThemeManager = new ThemeStorageManager()
export default ThemeManager
