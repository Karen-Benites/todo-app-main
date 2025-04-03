const taskForm = document.getElementById("task__form");
const taskList = document.querySelector(".task__list");

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskInput = document.getElementById("task__input");
    const task = taskInput.value.trim();

    if (task) {
        taskList.append(createTaskElement(task));
        taskInput.value = "";
    }
});

taskList.addEventListener("click", (event)=>{
    const target = event.target
    if (target){
        const classArray = Array.from(target.classList)
        const deleteClass = classArray.find((classitem) => (classitem) === "delete-btn")
        const editClass = classArray.find((classitem) => (classitem) === "edit-btn")
        if (deleteClass){
            const li = target.closest("li");
            deleteTask(li)
        } else if(editClass){
            const li = target.closest("li");
            editTask(li)
        }
    }
    
})

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
    const checkBtn = createButton("checked-btn task__item-btn", "Checked task");
    const taskText = createElementWithClass("p", "", task);

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
    if (confirm("¿Estás segura, seguro, de borrar este elemento?")) {
        taskItem.remove();
    }
}

function editTask(taskItem) {
    const newTask = prompt("Please edit the task:", taskItem.firstChild.textContent);
    if (newTask !== null) {
        const paragraph = taskItem.querySelector("p")
        paragraph.textContent = newTask
    }
}