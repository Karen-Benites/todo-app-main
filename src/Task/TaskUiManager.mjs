function deleteUITask(taskItem) {
  if (confirm("Are you sure about removing this task?")) {
    taskItem.remove()
  }
}

function editUITask(taskItem) {
  const currentText = taskItem.querySelector("label").textContent
  const newTask = prompt(
    "Please edit the task:",
    currentText
  )
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

export default {
    deleteUITask,
    editUITask,
    toggleTaskUIState,
};