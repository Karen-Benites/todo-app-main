import { FILTERS } from "./ActionKeys.mjs"
import ThemeManager from "./Theme/ThemeStorageManager.mjs"
import TaskManager from "./Task/TaskStorageManager.mjs"
import Task from "./Task/TaskModel.mjs"
import TaskBuilder from "./Task/TaskBuilder.mjs"
import normalizeTaskData from "./utils/normalizeData.mjs"
import TaskService from "./Task/TaskService.mjs"
import { toggleTheme } from "./Theme/ThemeUIManager.mjs"
import TaskUI from "./Task/TaskUiManager.mjs"

// DOM Elements
const taskForm = document.getElementById("task__form")
const taskList = document.querySelector(".task__list")
const clearButton = document.querySelector(".clear-button")
const toggleThemeButton = document.querySelector(".header__theme-button")
const mediaquery = window.matchMedia("(min-width: 768px)")
const currentTheme = ThemeManager.loadItem()
const filterButtons = document.querySelector(".task__summary")
const allButton = filterButtons.firstElementChild
const completedButton = filterButtons.lastElementChild
const activeButton = filterButtons.children[1]

new Sortable(document.querySelector(".task__list"), {
  animation: 150,
  onEnd: function (event) {
    let StorageTasksList = (TaskManager.loadItem() || []).filter(task => task !== null)
    const movedTask = StorageTasksList.splice(event.oldIndex, 1)[0]
    StorageTasksList.splice(event.newIndex, 0, movedTask)
    TaskManager.storeItem(StorageTasksList)
  },
})

//Init
init()

//Event Listeners

taskForm.addEventListener("submit", event => handleFormSubmit(event))
clearButton.addEventListener("click", clearCompletedTasks)
toggleThemeButton.addEventListener("click", toggleTheme)
mediaquery.addEventListener("change", handleLayoutChange)
filterButtons.addEventListener("click", event => handleFilterButtonClick(event))

// Main functions

function init() {
  const tasksList = (TaskManager.loadItem() || []).filter(task => task !== null)
  TaskManager.storeItem(tasksList)
  normalizeOldTasks()
  loadTasksFromLocalStorage()
  TaskService.updatePendingTasksCounter()
  handleLayoutChange(mediaquery)

  if (currentTheme === "dark") {
    document.body.classList.add("dark-theme")
    toggleThemeButton.classList.add("dark__icon")
  }

}

function renderTask(rawTask) {
  const normalized = normalizeTaskData(rawTask)
  const task = new Task(normalized.text, normalized.id, normalized.creationDate)
  task.isCompleted = normalized.isCompleted

  const builder = new TaskBuilder(task, {
    onDelete: (taskItem, taskID) => {
      TaskUI.deleteUITask(taskItem)
      TaskService.deleteTask(taskID)
      TaskService.updatePendingTasksCounter()
    },
    onEdit: (taskItem, taskID) => {
      const newTask = TaskUI.editUITask(taskItem)
      if (newTask) {
        TaskService.editTask(taskID, newTask)
      }
    },
    onToggle: (taskItem, taskID, checked) => {
      TaskUI.toggleTaskUIState(taskItem)
      TaskService.toggleCompletion(taskID, checked)
      TaskService.updatePendingTasksCounter()
    },
  })

  return {
    element: builder.build(),
    taskInstance: task,
  }
}

// Event hanlders

function handleFormSubmit(event) {
  event.preventDefault()
  const taskInput = document.getElementById("task__input")
  const taskText = taskInput.value.trim()
  if (taskText) {
    const { element, taskInstance } = renderTask(taskText)
    taskList.append(element)
    storeTaskInLocalStorage(taskInstance)
    taskInput.value = ""
    TaskService.updatePendingTasksCounter()
  }
}

function handleFilterButtonClick(event) {
  if (event.target && event.target.classList.contains("summary__button")) {
    const filter = event.target.dataset.filter
    filterTasksOnScreen(filter)
    switch (filter) {
      case FILTERS.ALL:
        changeFilterTextColor(
          event.target,
          "summary__button-selected",
          completedButton,
          activeButton
        )
        break
      case FILTERS.ACTIVE:
        changeFilterTextColor(
          event.target,
          "summary__button-selected",
          completedButton,
          allButton
        )
        break
      case FILTERS.COMPLETED:
        changeFilterTextColor(
          event.target,
          "summary__button-selected",
          activeButton,
          allButton
        )
        break
    }
  }
}

function handleLayoutChange(event) {
  const movedSection = document.querySelector(".task__summary")

  if (event.matches) {
    const newParent = document.querySelector(".task__management")
    newParent.insertBefore(movedSection, newParent.children[1])
  } else {
    const originalParent = document.querySelector("main")
    const afterThis = document.querySelector(".task__dashboard")
    originalParent.insertBefore(movedSection, afterThis.nextSibling)
  }
}

// UI Functions

function changeFilterTextColor(eventTarget, className, ...buttons) {
  eventTarget.classList.add(className)
  buttons.forEach(button => button.classList.remove(className))
}

function filterTasksOnScreen(filter) {
  const tasksList = GetFilteredTasksByStatus(FILTERS.ALL)
  const completedTasks = GetFilteredTasksByStatus(FILTERS.COMPLETED)
  const activeTasks = GetFilteredTasksByStatus(FILTERS.ACTIVE)

  function processTasksList(targetTasksList, action) {
    targetTasksList.forEach(task => {
      const [, , taskLiParent] = getTaskData(task)
      if (action === "remove") {
        taskLiParent.classList.remove("hidden")
      } else if (action === "add") {
        taskLiParent.classList.add("hidden")
      }
    })
  }

  switch (filter) {
    case FILTERS.ALL:
      processTasksList(tasksList, "remove")
      break
    case FILTERS.COMPLETED:
      processTasksList(activeTasks, "add")
      processTasksList(completedTasks, "remove")
      break
    case FILTERS.ACTIVE:
      processTasksList(completedTasks, "add")
      processTasksList(activeTasks, "remove")
      break
  }
}

// Data Storage Functions

function GetFilteredTasksByStatus(status) {
  const tasksList = (TaskManager.loadItem() || []).filter(task => task !== null)
  switch (status) {
    case FILTERS.COMPLETED:
      return tasksList.filter(task => task.isCompleted === true)
    case FILTERS.ALL:
      return tasksList
    case FILTERS.ACTIVE:
      return tasksList.filter(task => task.isCompleted === false)
  }
}

function getTaskData(task) {
  const ID = task.id
  const taskElement = document.getElementById(`${ID}`)
  const taskLiParent = taskElement.closest("li")
  return [ID, taskElement, taskLiParent]
}

function clearCompletedTasks() {
  GetFilteredTasksByStatus(FILTERS.COMPLETED).forEach(task => {
    const [ID, , taskLiParent] = getTaskData(task)
    taskLiParent.remove()
    TaskService.deleteTask(ID)
  })
  TaskService.updatePendingTasksCounter()
}

function storeTaskInLocalStorage(task) {
  const tasksList = TaskManager.loadItem() || []
  tasksList.push(task)
  TaskManager.storeItem(tasksList)
}

function loadTasksFromLocalStorage() {
  const tasks = TaskManager.loadItem() || []
  tasks.forEach(task => {
    taskList.appendChild(renderTask(task).element)
  })
}

function normalizeOldTasks() {
  const tasks = TaskManager.loadItem() || []
  const legacyTasks = tasks.filter(task => typeof task === "string")
  if (legacyTasks.length != 0) {
    const newTasks = legacyTasks.map(oldTask => {
      const dateNow = Date.now()
      return new Task(oldTask, `task-${dateNow}`, new Date(dateNow))
    })
    let cleanedTasks = tasks.filter(task => typeof task !== "string")
    const updatedTaks = [...cleanedTasks, ...newTasks]
    TaskManager.storeItem(updatedTaks)
  }
}
