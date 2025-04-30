import STORAGE_KEYS from "./ActionKeys.mjs"

class StorageGateway {
  constructor(storage = window.localStorage) {
    if (StorageGateway.instance) {
      return StorageGateway.instance
    }

    this.storage = storage
    StorageGateway.instance = this
  }

  getTheme() {
    return this.storage.getItem(STORAGE_KEYS.THEME)
  }

  getTasks() {
    return JSON.parse(this.storage.getItem(STORAGE_KEYS.TASKS))
  }

  setTasks(value) {
    this.storage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(value))
  }

  setTheme(theme) {
    this.storage.setItem(STORAGE_KEYS.THEME, theme)
  }
}

const storageGateway = new StorageGateway()
export default storageGateway
