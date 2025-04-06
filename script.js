const taskForm = document.getElementById("task__form");
const taskList = document.querySelector(".task__list");
const clearButton = document.querySelector(".clear-button")
const toggleThemeButton = document.querySelector(".header__theme-button")
loadTasks()

//Event Listeners

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskInput = document.getElementById("task__input");
    const task = taskInput.value.trim();

    if (task) {
        taskList.append(createTaskElement(task));
        storeTaskInLocalStorage(task)
        taskInput.value = "";
        pendingTasksCounter()
    }
});

taskList.addEventListener("click", (event)=>{
    const target = event.target
    if (target){
        const classArray = Array.from(target.classList)
        const deleteClass = classArray.find((classitem) => (classitem) === "delete-btn")
        const editClass = classArray.find((classitem) => (classitem) === "edit-btn")
        const checkClass = classArray.find((classitem) => (classitem) === "check-btn")
        if (deleteClass){
            const li = target.closest("li");
            deleteTask(li)
            pendingTasksCounter()
        } else if(editClass){
            const li = target.closest("li");
            editTask(li)
        } else if(checkClass){
            const li = target.closest("li");
            checkTask(li)
            pendingTasksCounter()
        }
    }
    
})

clearButton.addEventListener("click", ()=>{
    clearCompleted()
})

const currentTheme = localStorage.getItem("theme");

toggleThemeButton.addEventListener('click', ()=>{
    document.body.classList.toggle("dark-theme")
    const theme = document.body.classList.contains("dark-theme")
    ? "dark"
    : "light";
  localStorage.setItem("theme", theme);
})

if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
    const button = document.querySelector(".header__theme-button")
    button.classList.add("dark__icon")
}

let mediaquery = window.matchMedia("(min-width: 768px)");

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

// Executes once when loading the page
handleLayoutChange(mediaquery);

// Listen to post-loading screen changes
mediaquery.addEventListener('change', handleLayoutChange);


// Functions

function createElementWithClass(type, className, textContent = "") {
    const element = document.createElement(type);
    element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

function createTaskElement(task) {
    const li = createElementWithClass("li", "task__item");

    // 📌 Description block
    const descriptionBlock = createBlock("div", "task__description");
    const checkBtn = createButton("check-btn task__item-btn", "Check task");
    const taskText = createElementWithClass("p", "task__text", task);

    descriptionBlock.append(checkBtn, taskText);

    // 📌 Editing block
    const editBlock = createBlock("div", "task__edit-container");
    const deleteBtn = createButton("delete-btn task__item-btn", "Delete task");
    const editBtn = createButton("edit-btn task__item-btn", "Edit task");

    editBlock.append(deleteBtn, editBtn);

    // 🔗 Adding final strcuture
    li.append(descriptionBlock, editBlock);
    return li;
}

// ✅ Generic block creator
function createBlock(type, className) {
    return createElementWithClass(type, className);
}

function createButton(className, label) {
    const btn = document.createElement("button");
    btn.className = className;
    btn.setAttribute("aria-label", label);
    return btn;
}

// ✅ Button creator
function createButton(className, label) {
    const btn = createElementWithClass("button", className);
    btn.setAttribute("aria-label", label);
    return btn;
}

function deleteTask(taskItem) {
    if (confirm("Are you sure about removing this task?")) {
        taskItem.remove()
        uploadLocalStorage()
    }
}

function editTask(taskItem) {
    const newTask = prompt("Please edit the task:", taskItem.firstChild.textContent);
    if (newTask !== null) {
        const paragraph = taskItem.querySelector("p")
        paragraph.textContent = newTask
        uploadLocalStorage()
    }
}

function checkTask(taskItem){
    const button = taskItem.querySelector(".check-btn")
    const paragraph = taskItem.querySelector("p")
    button.classList.toggle("task__checked-btn")
    paragraph.classList.toggle("task__text-checked")
}

function completedTasksCollector(){
    const taskChildrenArray = [...taskList.children]
    const completedTasksArray = taskChildrenArray.filter((liElement)=>{
        const button = liElement.querySelector(".check-btn")
        return button.classList.contains("task__checked-btn")
    })
    return completedTasksArray
}

function pendingTasksCounter(){
    let itemsLeft = 0
    const totalTasks = taskList.children.length
    const completedTasksArray = completedTasksCollector()
    const completedTasks = completedTasksArray.length
    itemsLeft = totalTasks-completedTasks
    let spanContainer = document.querySelector(".task__management")
    let spanElement = spanContainer.querySelector("span")
    spanElement.textContent = itemsLeft
}

pendingTasksCounter()

function clearCompleted(){
    const completedTasksArray = completedTasksCollector()
    completedTasksArray.forEach(task=> task.remove())
    uploadLocalStorage()
}

function storeTaskInLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks.length >0){
        tasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });
    } else{
        {}
    }
}

function uploadLocalStorage(){
    const tasks = Array.from(document.querySelectorAll(".task__item"))
    const taskscontent = tasks.map(taskItem => taskItem.querySelector("p").textContent)
    localStorage.setItem('tasks', JSON.stringify(taskscontent))
}