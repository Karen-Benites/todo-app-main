import TaskManager from "./TaskStorageManager.mjs"
import Task from "./TaskModel.mjs"

function findTaskById(taskID) {
  const tasks = TaskManager.loadItem()
  const index = tasks.findIndex(task => task.id === taskID)
  const taskData = tasks[index]

  return {
    tasks,
    index,
    taskData: taskData
      ? new Task(taskData.text, taskData.id, new Date(taskData.creationDate))
      : null,
  }
}

function deleteTask(taskID) {
  const { tasks, index } = findTaskById(taskID)
  if (index !== -1) {
    tasks.splice(index, 1)
    TaskManager.storeItem(tasks)
  }
}

function editTask(taskID, newText) {
  const { tasks, index, taskData } = findTaskById(taskID)
  if (!taskData) return

  taskData.editDescription(newText)
  tasks[index] = taskData.toJSON()
  TaskManager.storeItem(tasks)
}

function toggleCompletion(taskID, isChecked) {
  const { tasks, index, taskData } = findTaskById(taskID)
  if (!taskData) return

  taskData.isCompleted = isChecked
  tasks[index] = taskData.toJSON()
  TaskManager.storeItem(tasks)
}

export default {
  deleteTask,
  editTask,
  toggleCompletion,
}
