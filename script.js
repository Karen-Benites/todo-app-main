const taskForm = document.getElementById("task__form");

const taskList = document.querySelector(".task__list");
console.dir(taskList)

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskInput = document.getElementById("task__input");
    console.dir(taskInput)

    const task = taskInput.value;
    console.log(task);

    if (task) {
        taskList.append(createTaskElement(task, "task__item"));
        taskInput.value = "";
    }
});

function createTaskElement(task, className) {
    const li = document.createElement("li");
    li.className = className
    li.append(createBlock("div", "task__description", (block)=>{
        block.append(createButton("checked-btn task__item-btn"))
        const taskcontainer = document.createElement("p")
        taskcontainer.textContent = task
        block.append(taskcontainer)
    }))
    li.append(createBlock("div", "task__edit-container", (block)=>{
        block.append(createButton("delete-btn task__item-btn"))
        block.append(createButton("edit-btn task__item-btn"))
    }));
    return li;
}

function createBlock(type, className, callback){
    //Create a generic block that has specific items
    const block = document.createElement(type)
    block.className = className
    callback(block) //executes a callback where you add a specific item to the block
    return block
}

function createButton(className) {
    const btn = document.createElement("span");
    btn.className = className;
    return btn;
}