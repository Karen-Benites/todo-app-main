# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

### Screenshot

![screenshot dark](./assets/images/screenshot-dark.png)
![screenshot light](./assets/images/Screenshot-light.png)

### Links

<!-- - Solution URL: [Add solution URL here](https://your-solution-url.com) -->

- Live Site URL: [live site URL here](https://karen-benites.github.io/todo-app-main/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- Vanilla Javascript
- Sortable js library

### What I learned

This was my first time working with the DOM, and I learned a lot throughout the process. I got hands-on experience handling not only click events, but also screen resize events. I also took the opportunity to reflect on function design—understanding when and why to wrap code in reusable functions to make my script cleaner and more efficient.

When it comes to styling, I explored how to implement a dark theme using existing CSS classes and specificity, avoiding unnecessary or redundant CSS rules.

One unexpected challenge was dealing with styling issues on mobile browsers, particularly in Chrome. I discovered that Android often applies default styles to elements like scrollbars and sticky hover states, which are very difficult to override with CSS. These limitations forced me to rethink and redesign certain parts of the interface to ensure a better user experience.

The toughest part of the project was managing the interaction between drag-and-drop functionality and vertical scrolling on mobile devices. Scrolling through draggable tasks was frustrating, so I ended up adding space on the right side of the task container to enable smooth scrolling without interfering with drag-and-drop.

I also had my first experience handling form data directly from HTML, which was a great learning opportunity.

💡 CSS tip: Check out how I implemented dark theme styles by reusing existing CSS classes effectively.

Regarding Javascript, this was also my first time trying a js library for helping me building the drag and drop functionality: Sortable js. After doing some internet research, I found out this simple yet effective library that, with few lines of code, allowed me to build an amazing drag and drop effect on tasks.

```css
.dark-theme .task__dashboard,
.dark-theme .task__summary {
  box-shadow: 0px 35px 50px -15px rgba(0, 0, 0, 0.5);
}
```

js: How I refactored a function with lots of duplicated code.

It went from this:

```js
function filterTasks(filter) {
  const tasksList = JSON.parse(localStorage.getItem("tasks")) || []
  const completedTasks = tasksList.filter(task => task.isCompleted === true)
  const activeTasks = tasksList.filter(task => task.isCompleted === false)
  switch (filter) {
    case "all":
      tasksList.forEach(task => {
        const ID = task.id
        const taskElement = document.getElementById(`${ID}`)
        const taskLiParent = taskElement.closest("li")
        taskLiParent.classList.remove("hidden")
      })

      break
    case "completed":
      activeTasks.forEach(task => {
        const ID = task.id
        const taskElement = document.getElementById(`${ID}`)
        const taskLiParent = taskElement.closest("li")
        taskLiParent.classList.add("hidden")
      })
      completedTasks.forEach(task => {
        const ID = task.id
        const taskElement = document.getElementById(`${ID}`)
        const taskLiParent = taskElement.closest("li")
        taskLiParent.classList.remove("hidden")
      })
      break
    case "active":
      completedTasks.forEach(task => {
        const ID = task.id
        const taskElement = document.getElementById(`${ID}`)
        const taskLiParent = taskElement.closest("li")
        taskLiParent.classList.add("hidden")
      })
      activeTasks.forEach(task => {
        const ID = task.id
        const taskElement = document.getElementById(`${ID}`)
        const taskLiParent = taskElement.closest("li")
        taskLiParent.classList.remove("hidden")
      })
      break
  }
}
```

to this:

```js
function filterTasks(filter) {
  const tasksList = getTasksList("all")
  const completedTasks = getTasksList("completed")
  const activeTasks = getTasksList("active")

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
    case "all":
      processTasksList(tasksList, "remove")
      break
    case "completed":
      processTasksList(activeTasks, "add")
      processTasksList(completedTasks, "remove")
      break
    case "active":
      processTasksList(completedTasks, "add")
      processTasksList(activeTasks, "remove")
      break
  }
}
```

### Useful resources

- [Platzi DOM course](https://platzi.com/cursos/document-object-model/) - This helped me for understanding and practicing DOM manipulation.
- [Moredev Intermediate JS course](https://github.com/mouredev/hello-javascript) - This repository consists of a series of live classes regarding beginner and intermediate javascript concepts for all purposes. It helped me getting the basis of the language and go further with POO and advanced functions.
- [Sortable JS library](https://sortablejs.github.io/Sortable/) - The js library that helped me build the drag and drop functionality

## Author

- Linkedin - [Karen Benites](https://www.linkedin.com/in/karenlbenites/)
- Frontend Mentor - [@Karen-Benites](https://www.frontendmentor.io/profile/Karen-Benites)
