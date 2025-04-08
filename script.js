// 🌟 Element references
const taskForm = document.getElementById("task__form");
const taskList = document.querySelector(".task__list");
const clearButton = document.querySelector(".clear-button");
const toggleThemeButton = document.querySelector(".header__theme-button");
const mediaquery = window.matchMedia("(min-width: 768px)");
const currentTheme = localStorage.getItem("theme");
const filterButtons = document.querySelector(".task__summary");

// 🌟 Init
init();

// 🌟 Event Listeners
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskInput = document.getElementById("task__input");
  const task = taskInput.value.trim();

  if (task) {
    taskList.append(createTaskElement(task));
    storeTaskInLocalStorage(task);
    taskInput.value = "";
    updatePendingTasksCounter();
  }
});

taskList.addEventListener("click", (event) => {
  const target = event.target;
  if (!target) return;

  const classList = Array.from(target.classList);
  const li = target.closest("li");

  if (classList.includes("delete-btn")) {
    deleteTask(li);
    updatePendingTasksCounter();
  } else if (classList.includes("edit-btn")) {
    editTask(li);
  } else if (classList.includes("check-btn")) {
    toggleCheckTask(li);
    updatePendingTasksCounter();
  }
});

clearButton.addEventListener("click", () => {
  clearCompletedTasks();
});

toggleThemeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const theme = document.body.classList.contains("dark-theme")
    ? "dark"
    : "light";
  localStorage.setItem("theme", theme);
});

mediaquery.addEventListener("change", handleLayoutChange);

// filterButtons.addEventListener('click', (event) => {
//     if (event.target && event.target.classList.contains('summary__button')) {
//         const filter = event.target.dataset.filter
//         filterTasks(filter)
//     }
// })

// 🌟 Init Function
function init() {
  loadTasksFromLocalStorage();
  updatePendingTasksCounter();
  handleLayoutChange(mediaquery);

  if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
    toggleThemeButton.classList.add("dark__icon");
  }
}

// 🌟 Layout handling
function handleLayoutChange(event) {
  const movedSection = document.querySelector(".task__summary");

  if (event.matches) {
    const newParent = document.querySelector(".task__management");
    newParent.insertBefore(movedSection, newParent.children[1]);
  } else {
    const originalParent = document.querySelector("main");
    const afterThis = document.querySelector(".task__dashboard");
    originalParent.insertBefore(movedSection, afterThis.nextSibling);
  }
}

// 🌟 Task creation
function createTaskElement(task) {
  const li = createElementWithClass("li", "task__item");

  // Description block
  const descriptionBlock = createBlock("div", "task__description");
  const checkBtn = createButton("check-btn task__item-btn", "Check task");
  const taskText = createElementWithClass("p", "task__text", task);
  descriptionBlock.append(checkBtn, taskText);

  // Edit/Delete block
  const editBlock = createBlock("div", "task__edit-container");
  const deleteBtn = createButton("delete-btn task__item-btn", "Delete task");
  const editBtn = createButton("edit-btn task__item-btn", "Edit task");
  editBlock.append(deleteBtn, editBtn);

  li.append(descriptionBlock, editBlock);
  return li;
}

// 🌟 Element creators
function createElementWithClass(type, className, textContent = "") {
  const element = document.createElement(type);
  element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

function createBlock(type, className) {
  return createElementWithClass(type, className);
}

function createButton(className, label) {
  const btn = createElementWithClass("button", className);
  btn.setAttribute("aria-label", label);
  return btn;
}

// 🌟 Task logic
function deleteTask(taskItem) {
  if (confirm("Are you sure about removing this task?")) {
    taskItem.remove();
    saveTasksToLocalStorage();
  }
}

function editTask(taskItem) {
  const newTask = prompt(
    "Please edit the task:",
    taskItem.querySelector("p").textContent,
  );
  if (newTask !== null) {
    const paragraph = taskItem.querySelector("p");
    paragraph.textContent = newTask;
    saveTasksToLocalStorage();
  }
}

function toggleCheckTask(taskItem) {
  const button = taskItem.querySelector(".check-btn");
  const paragraph = taskItem.querySelector("p");
  button.classList.toggle("task__checked-btn");
  paragraph.classList.toggle("task__text-checked");
}

// 🌟 Task status helpers
function getCompletedTasks() {
  return [...taskList.children].filter((li) =>
    li.querySelector(".check-btn").classList.contains("task__checked-btn"),
  );
}

function updatePendingTasksCounter() {
  const totalTasks = taskList.children.length;
  const completedTasks = getCompletedTasks().length;
  const itemsLeft = totalTasks - completedTasks;

  const span = document.querySelector(".task__management span");
  if (span) span.textContent = itemsLeft;
}

function clearCompletedTasks() {
  getCompletedTasks().forEach((task) => task.remove());
  saveTasksToLocalStorage();
  updatePendingTasksCounter();
}

// 🌟 Local Storage
function storeTaskInLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTasksToLocalStorage() {
  const tasksContent = Array.from(
    document.querySelectorAll(".task__item p"),
  ).map((p) => p.textContent);
  localStorage.setItem("tasks", JSON.stringify(tasksContent));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });
}

// function filterTasks(filter){
//     const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     console.log(tasks)
//     tasks.forEach((task) => {
//         const taskcontainer = taskList.querySelector(task.)
//         taskList.appendChild(createTaskElement(task));
//     });
// }
