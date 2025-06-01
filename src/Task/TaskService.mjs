import TaskManager from "./TaskStorageManager.mjs"
import Task from "./TaskModel.mjs"
import TaskUI from "./TaskUiManager.mjs"

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

function updatePendingTasksCounter(){
  const itemsLeft = TaskUI.updateUiPendingTasksCounter()
  const UITaskList = document.querySelector(".task__list")
  const LiNodeChildren = UITaskList.querySelectorAll("li")
  console.dir(LiNodeChildren)
  const placeholder = document.querySelector(".task__placeholder")
  if (itemsLeft === 0 && !placeholder && LiNodeChildren.length === 0) {
    TaskUI.createTaskPlaceholder()
  } else {
    TaskUI.removeTaskPlaceholder()
  }
}

export default {
  deleteTask,
  editTask,
  toggleCompletion,
  updatePendingTasksCounter
}
