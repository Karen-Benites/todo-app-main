import IStorage from "../IStorage.mjs"
import { STORAGE_KEYS } from "../ActionKeys.mjs"

class TaskStorageManager extends IStorage {
  constructor(storage = window.localStorage) {
    super()
    if (TaskStorageManager.instance) {
      return TaskStorageManager.instance
    }

    this.storage = storage
    TaskStorageManager.instance = this
  }

  loadItem() {
    return JSON.parse(this.storage.getItem(STORAGE_KEYS.TASKS))
  }

  storeItem(value) {
    this.storage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(value))
  }
}

const TaskManager = new TaskStorageManager()
export default TaskManager
