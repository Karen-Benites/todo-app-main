export default class Task {
  constructor(text, id, creationDate) {
    this.text = text
    this.id = id
    this.creationDate = creationDate.toISOString()
    this.isCompleted = false
  }

  toggleCompletion() {
    this.isCompleted = !this.isCompleted
  }

  editDescription(newText) {
    this.text = newText
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      isCompleted: this.isCompleted,
      creationDate: this.creationDate,
    }
  }
}
