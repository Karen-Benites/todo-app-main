export default class IStorage {
  loadItem() {
    throw new Error("Must implement loadItem")
  }

  storeItem(value) {
    throw new Error("Must implement storeItem")
  }
}
