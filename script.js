// Consts

const ACTIONS = {
  DELETE: "delete",
  EDIT: "edit",
  COMPLETE: "complete"
};

const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed"
};

const STORAGE_KEYS = {
  TASKS: "tasks",
  THEME: "theme"
};

// DOM Elements
const taskForm = document.getElementById("task__form")
const taskList = document.querySelector(".task__list")
const clearButton = document.querySelector(".clear-button")
const toggleThemeButton = document.querySelector(".header__theme-button")
const mediaquery = window.matchMedia("(min-width: 768px)")
const currentTheme = localStorage.getItem(STORAGE_KEYS.THEME)
const filterButtons = document.querySelector(".task__summary")
const allButton = filterButtons.firstElementChild
const completedButton = filterButtons.lastElementChild
const activeButton = filterButtons.children[1]

new Sortable(document.querySelector('.task__list'), {
  animation: 150,
  onEnd: function (event) {
    let StorageTasksList = JSON.parse(localStorage.getItem('tasks')) || [];
    const movedTask = StorageTasksList.splice(event.oldIndex,1)[0]
    StorageTasksList.splice(event.newIndex,0,movedTask)
    localStorage.setItem('tasks', JSON.stringify(StorageTasksList));
  }
});

// Data Model
class Task {
  constructor(text, id, creationDate) {
    this.text = text
    this.id = id
    this.creationDate = creationDate.toISOString()
    this.isCompleted = false
  }
}

//Init
init()

//Event Listeners

taskForm.addEventListener("submit", event => handleFormSubmit(event))
taskList.addEventListener("click", event => handleTaskAction(event))
clearButton.addEventListener("click", clearCompletedTasks)
toggleThemeButton.addEventListener("click", toggleTheme)
mediaquery.addEventListener("change", handleLayoutChange)
filterButtons.addEventListener("click", event => handleFilterButtonClick(event))

// Main functions

function init() {
  normalizeOldTasks()
  loadTasksFromLocalStorage()
  updatePendingTasksCounter()
  handleLayoutChange(mediaquery)

  if (currentTheme === "dark") {
    document.body.classList.add("dark-theme")
    toggleThemeButton.classList.add("dark__icon")
  }
}

// Event hanlders

function handleFormSubmit(event){
  event.preventDefault()

  const taskInput = document.getElementById("task__input")
  const taskText = taskInput.value.trim()
  const newTask = { text: taskText }
  const taskElement = createTaskElement(newTask)

  if (taskText) {
    taskList.append(taskElement.DOMelement)
    storeTaskInLocalStorage(taskElement.details)
    taskInput.value = ""
    updatePendingTasksCounter()
  }
}

function handleTaskAction(event){
  const target = event.target
  if (!target) return

  const classList = Array.from(target.classList)
  const li = target.closest("li")

  if (classList.includes("delete-btn")) {
    deleteTask(li)
    updatePendingTasksCounter()
  } else if (classList.includes("edit-btn")) {
    editTask(li)
  } else if (classList.includes("check-btn")) {
    toggleCheckTask(li)
    updatePendingTasksCounter()
  }
}

function toggleTheme(){
  document.body.classList.toggle("dark-theme")
  const theme = document.body.classList.contains("dark-theme")
    ? "dark"
    : "light"
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
}

function handleFilterButtonClick(event){
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

function createTaskElement(task) {
  const li = createElementWithClass("li", "task__item")
  const taskDate = task.creationDate
    ? new Date(task.creationDate)
    : new Date(Date.now())
  const taskID = task.id || `task-${Date.now()}`
  const isCompleted = task.isCompleted || false

  const taskDetails = new Task(task.text, taskID, taskDate)
  taskDetails.isCompleted = isCompleted

  const descriptionBlock = createBlock("div", "task__description")
  const checkBtn = createCheckBox("check-btn task__item-btn", taskDetails.id)
  const taskText = createElementWithClass(
    "label",
    "task__text",
    taskDetails.text
  )
  taskText.setAttribute("for", taskDetails.id)

  if (isCompleted) {
    checkBtn.classList.add("task__checked-btn")
    taskText.classList.add("task__text-checked")
    checkBtn.checked = true
  }

  descriptionBlock.append(checkBtn, taskText)

  const editBlock = createBlock("div", "task__edit-container")
  const deleteBtn = createButton("delete-btn task__item-btn", "Delete task")
  const editBtn = createButton("edit-btn task__item-btn", "Edit task")
  editBlock.append(deleteBtn, editBtn)
  li.append(descriptionBlock, editBlock)
  return { DOMelement: li, details: taskDetails }
}

function createElementWithClass(type, className, textContent = "") {
  const element = document.createElement(type)
  element.className = className
  if (textContent) element.textContent = textContent
  return element
}

function createBlock(type, className) {
  return createElementWithClass(type, className)
}

function createButton(className, label) {
  const btn = createElementWithClass("button", className)
  btn.setAttribute("aria-label", label)
  return btn
}

function createCheckBox(className, id) {
  const checkButton = createElementWithClass("input", className)
  checkButton.setAttribute("type", "checkbox")
  checkButton.setAttribute("id", id)
  return checkButton
}

function deleteTask(taskItem) {
  if (confirm("Are you sure about removing this task?")) {
    const taskID = taskItem.querySelector("label").attributes.for.value
    taskItem.remove()
    updateLocalStorageTask(taskID, ACTIONS.DELETE)
  }
}

function editTask(taskItem) {
  const newTask = prompt(
    "Please edit the task:",
    taskItem.querySelector("label").textContent
  )
  if (newTask !== null) {
    const paragraph = taskItem.querySelector("label")
    paragraph.textContent = newTask
    const taskID = paragraph.attributes.for.value
    updateLocalStorageTask(taskID, ACTIONS.EDIT, false, newTask)
  }
}

function toggleTaskUIState(taskItem) {
  const button = taskItem.querySelector(".check-btn");
  const paragraph = taskItem.querySelector(".task__text");
  button.classList.toggle("task__checked-btn");
  paragraph.classList.toggle("task__text-checked");
  return { id: button.id, isChecked: button.checked };
}

function toggleCheckTask(taskItem) {
  const { id, isChecked } = toggleTaskUIState(taskItem);
  updateLocalStorageTask(id, ACTIONS.COMPLETE, isChecked);
}

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
  const tasksList = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || []
  switch (status) {
    case FILTERS.COMPLETED:
      return tasksList.filter(task => task.isCompleted === true)
    case FILTERS.ALL:
      return tasksList
    case FILTERS.ACTIVE:
      return tasksList.filter(task => task.isCompleted === false)
  }
}

function updatePendingTasksCounter() {
  const totalTasks = taskList.children.length
  const completedTasks = GetFilteredTasksByStatus(FILTERS.COMPLETED).length
  const itemsLeft = totalTasks - completedTasks
  const span = document.querySelector(".task__management span")
  if (span) span.textContent = itemsLeft
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
    updateLocalStorageTask(ID, ACTIONS.DELETE)
  })
  updatePendingTasksCounter()
}

function storeTaskInLocalStorage(task) {
  const tasksList = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || []
  tasksList.push(task)
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksList))
}

function findLocalStorageTask(taskID) {
  const localStorageTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS))
  const updatedTask = localStorageTasks.find(task => task.id === taskID)
  const taskIndex = localStorageTasks.findIndex(task => task.id === taskID)
  return [localStorageTasks, updatedTask, taskIndex]
}

function updateLocalStorageTask(taskID, action, isChecked = false, text = "") {
  const [localStorageTasks, updatedTask, taskIndex] =
    findLocalStorageTask(taskID)
  if (action === ACTIONS.EDIT) {
    updatedTask.text = text
    localStorageTasks[taskIndex] = updatedTask
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(localStorageTasks))
  } else if (action === ACTIONS.DELETE) {
    localStorageTasks.splice(taskIndex, 1)
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(localStorageTasks))
  } else if (action === ACTIONS.COMPLETE) {
    updatedTask.isCompleted = isChecked
    localStorageTasks[taskIndex] = updatedTask
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(localStorageTasks))
  }
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || []
  tasks.forEach(task => {
    taskList.appendChild(createTaskElement(task).DOMelement)
  })
}

function normalizeOldTasks() {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || []
  const legacyTasks = tasks.filter(task => typeof task === "string")
  if (legacyTasks.length != 0) {
    const newTasks = legacyTasks.map(oldTask => {
      const dateNow = Date.now()
      return new Task(oldTask, `task-${dateNow}`, new Date(dateNow))
    })
    let cleanedTasks = tasks.filter(task => typeof task !== "string")
    const updatedTaks = [...cleanedTasks, ...newTasks]
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTaks))
  }
}

