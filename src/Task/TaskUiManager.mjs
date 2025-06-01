import TaskManager from "./TaskStorageManager.mjs"

function deleteUITask(taskItem) {
  if (confirm("Are you sure about removing this task?")) {
    taskItem.remove()
  }
}

function editUITask(taskItem) {
  const currentText = taskItem.querySelector("label").textContent
  const newTask = prompt("Please edit the task:", currentText)
  if (newTask !== null) {
    const paragraph = taskItem.querySelector("label")
    paragraph.textContent = newTask
    return newTask
  }

  return null
}

function toggleTaskUIState(taskItem) {
  const button = taskItem.querySelector(".check-btn")
  const paragraph = taskItem.querySelector(".task__text")
  button.classList.toggle("task__checked-btn")
  paragraph.classList.toggle("task__text-checked")
}

function createTaskPlaceholder() {
  const placeholder = document.createElement("span")
  placeholder.className = "task__placeholder"
  placeholder.textContent = "No tasks available. Please add a task."
  document.querySelector(".task__list").appendChild(placeholder)
}

function removeTaskPlaceholder() {
  const placeholder = document.querySelector(".task__placeholder")
  if (placeholder) {
    placeholder.remove()
  }
}

function updateUiPendingTasksCounter() {
  const totalTasks = (TaskManager.loadItem() || []).filter(task => task !== null)
  const completedTasks = totalTasks.filter(task => task.isCompleted === true)
  const itemsLeft = totalTasks.length - completedTasks.length
  const span = document.querySelector(".task__management span")
  if (span) span.textContent = itemsLeft
  return itemsLeft
}

export default {
  deleteUITask,
  editUITask,
  toggleTaskUIState,
  createTaskPlaceholder,
  removeTaskPlaceholder,
  updateUiPendingTasksCounter
}
