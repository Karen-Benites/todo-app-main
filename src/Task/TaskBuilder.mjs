export default class TaskBuilder {
  constructor(task, handlers) {
    this.task = task
    this.handlers = handlers
    this.li = null
  }

  build() {
    const li = this.#createElement("li", "task__item")
    this.li = li
    const descriptionBlock = this.#createElement("div", "task__description")
    const checkbox = this.#createCheckbox(this.task.id)
    const label = this.#createElement("label", "task__text", this.task.text)
    label.setAttribute("for", this.task.id)

    if (this.task.isCompleted) {
      checkbox.classList.add("task__checked-btn")
      label.classList.add("task__text-checked")
      checkbox.checked = true
    }

    checkbox.addEventListener("change", () =>
      this.handlers.onToggle?.(this.li, this.task.id, checkbox.checked)
    )

    descriptionBlock.append(checkbox, label)

    const editBlock = this.#createElement("div", "task__edit-container")
    const deleteBtn = this.#createButton("delete-btn", "Delete", () =>
      this.handlers.onDelete?.(this.li, this.task.id)
    )
    const editBtn = this.#createButton("edit-btn", "Edit", () =>
      this.handlers.onEdit?.(this.li, this.task.id)
    )

    editBlock.append(deleteBtn, editBtn)
    li.append(descriptionBlock, editBlock)

    return li
  }

  #createElement(tag, className, text = "") {
    const element = document.createElement(tag)
    element.className = className
    if (text) element.textContent = text
    return element
  }

  #createCheckbox(id) {
    const checkbox = this.#createElement("input", "check-btn task__item-btn")
    checkbox.type = "checkbox"
    checkbox.id = id
    return checkbox
  }

  #createButton(className, label, onClick) {
    const btn = this.#createElement("button", `${className} task__item-btn`)
    btn.setAttribute("aria-label", `${label} task`)
    btn.addEventListener("click", onClick)
    return btn
  }
}
