let categories = [];

// DOM Elements
const categoryInput = document.getElementById("category-input");
const addCategoryBtn = document.getElementById("add-category-btn");
const categoriesContainer = document.getElementById("categories-container");
const helpBtn = document.getElementById("help-btn");
const helpModal = document.getElementById("help-modal");
const closeHelp = document.getElementById("close-help");
const speechText = document.getElementById("speech-text");
const characterSpeech = document.getElementById("character-speech");

// Modal elements
const confirmModal = document.getElementById("confirm-modal");
const confirmMessage = document.getElementById("confirm-message");
const confirmCancel = document.getElementById("confirm-cancel");
const confirmOk = document.getElementById("confirm-ok");

const editModal = document.getElementById("edit-modal");
const editTitle = document.getElementById("edit-title");
const editInput = document.getElementById("edit-input");
const editCancel = document.getElementById("edit-cancel");
const editSave = document.getElementById("edit-save");

let currentAction = null;
let currentCategoryId = null;
let currentTaskId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  renderCategories();
  setupHelpModal();
  setupModals();
});

// Add category
addCategoryBtn.addEventListener("click", () => {
  const title = categoryInput.value.trim();
  if (title) {
    addCategory(title);
    categoryInput.value = "";
    categoryInput.focus();
  }
});

categoryInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addCategoryBtn.click();
  }
});

function setupHelpModal() {
  helpBtn.addEventListener("click", () => {
    helpModal.classList.add("active");
    animateHelpText();
  });

  closeHelp.addEventListener("click", () => {
    helpModal.classList.remove("active");
  });

  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) {
      helpModal.classList.remove("active");
    }
  });
}

function setupModals() {
  confirmCancel.addEventListener("click", () => {
    confirmModal.classList.remove("active");
  });

  confirmOk.addEventListener("click", () => {
    confirmModal.classList.remove("active");
    if (currentAction === "deleteCategory") {
      deleteCategory(currentCategoryId);
    } else if (currentAction === "deleteTask") {
      deleteTask(currentCategoryId, currentTaskId);
    }
  });

  editCancel.addEventListener("click", () => {
    editModal.classList.remove("active");
  });

  editSave.addEventListener("click", () => {
    const newValue = editInput.value.trim();
    if (newValue) {
      if (currentAction === "editCategory") {
        editCategory(currentCategoryId, newValue);
      } else if (currentAction === "editTask") {
        editTask(currentCategoryId, currentTaskId, newValue);
      }
    }
    editModal.classList.remove("active");
  });

  // Close modals when clicking outside content
  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) {
      confirmModal.classList.remove("active");
    }
  });

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.classList.remove("active");
    }
  });
}

function animateHelpText() {
  const messages = [
    "Hello! I'm sam, your personal productivity assistant!",
    "Let me show you how to get the most out of this app...",
    "First, create categories to organize your tasks!",
    "Then add tasks to each category to stay organized!",
    "You can edit or delete anything anytime!",
    "Your tasks are saved automatically - how cool is that?",
    "Ready to get organized? Let's go!",
  ];

  let messageIndex = 0;

  function showNextMessage() {
    if (messageIndex >= messages.length) return;

    const message = messages[messageIndex];
    let charIndex = 0;

    speechText.textContent = "";
    const typingInterval = setInterval(() => {
      if (charIndex < message.length) {
        speechText.textContent += message.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typingInterval);

        setTimeout(() => {
          messageIndex++;
          showNextMessage();
        }, 1500);
      }
    }, 50);
  }

  showNextMessage();
}

function addCategory(title) {
  const newCategory = {
    id: Date.now(),
    title,
    tasks: [],
  };

  categories.unshift(newCategory);
  saveData();
  renderCategories();
}

function addTask(categoryId, text) {
  const category = categories.find((cat) => cat.id === categoryId);
  if (category) {
    const newTask = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text,
      completed: false,
    };

    category.tasks.unshift(newTask); // Add to beginning to show last added first
    saveData();
    renderCategories();
  }
}

//  delete a category
function deleteCategory(categoryId) {
  categories = categories.filter((cat) => cat.id !== categoryId);
  saveData();
  renderCategories();
}

// delete a task
function deleteTask(categoryId, taskId) {
  const category = categories.find((cat) => cat.id === categoryId);
  if (category) {
    category.tasks = category.tasks.filter((task) => task.id !== taskId);
    saveData();
    renderCategories();
  }
}

// edit  category title
function editCategory(categoryId, newTitle) {
  const category = categories.find((cat) => cat.id === categoryId);
  if (category) {
    category.title = newTitle;
    saveData();
    renderCategories();
  }
}

//  edit a task
function editTask(categoryId, taskId, newText) {
  const category = categories.find((cat) => cat.id === categoryId);
  if (category) {
    const task = category.tasks.find((t) => t.id === taskId);
    if (task) {
      task.text = newText;
      saveData();
      renderCategories();
    }
  }
}

function renderCategories() {
  if (categories.length === 0) {
    categoriesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Categories Yet</h3>
                        <p>Add your first category to get started!</p>
                    </div>
                `;
    return;
  }

  categoriesContainer.innerHTML = "";

  categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "category";
    categoryElement.innerHTML = `
                    <div class="category-header">
                        <h2 class="category-title">${category.title}</h2>
                        <div class="category-actions">
                            <button class="btn-edit" data-category-id="${
                              category.id
                            }">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" data-category-id="${
                              category.id
                            }">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    <div class="tasks-container">
                        <div class="task-form">
                            <input type="text" class="task-input" placeholder="Add a new task in ${
                              category.title
                            }" data-category-id="${category.id}">
                            <button class="add-task-btn" data-category-id="${
                              category.id
                            }">
                                <i class="fas fa-plus"></i> Add Task
                            </button>
                        </div>
                        <ul class="task-list" id="task-list-${category.id}">
                            ${renderTasks(category.tasks, category.id)}
                        </ul>
                    </div>
                `;

    categoriesContainer.appendChild(categoryElement);
  });

  attachEventListeners();
}

function renderTasks(tasks, categoryId) {
  if (tasks.length === 0) {
    return `
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <p>No tasks yet. Add your first task!</p>
                    </div>
                `;
  }

  return tasks
    .map(
      (task) => `
                    <li class="task-item">
                        <span class="task-text">${task.text}</span>
                        <div class="task-actions">
                            <button class="btn-task-edit" data-category-id="${categoryId}" data-task-id="${task.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-task-delete" data-category-id="${categoryId}" data-task-id="${task.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </li>
                `
    )
    .join("");
}

function attachEventListeners() {
  document.querySelectorAll(".add-task-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const categoryId = parseInt(e.target.dataset.categoryId);
      const input = e.target.parentElement.querySelector(".task-input");
      const text = input.value.trim();

      if (text) {
        addTask(categoryId, text);
        input.value = "";
        input.focus();
      }
    });
  });

  document.querySelectorAll(".task-input").forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const categoryId = parseInt(e.target.dataset.categoryId);
        const text = e.target.value.trim();

        if (text) {
          addTask(categoryId, text);
          e.target.value = "";
        }
      }
    });
  });

  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", (e) => {
      const categoryId = parseInt(
        e.target.closest(".btn-delete").dataset.categoryId
      );

      currentAction = "deleteCategory";
      currentCategoryId = categoryId;
      confirmMessage.textContent =
        "Are you sure you want to delete this category and all its tasks?";
      confirmModal.classList.add("active");
    });
  });

  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const categoryId = parseInt(
        e.target.closest(".btn-edit").dataset.categoryId
      );
      const category = categories.find((cat) => cat.id === categoryId);

      if (category) {
        currentAction = "editCategory";
        currentCategoryId = categoryId;
        editTitle.textContent = "Edit Category Title";
        editInput.value = category.title;
        editModal.classList.add("active");
      }
    });
  });

  document.querySelectorAll(".btn-task-delete").forEach((button) => {
    button.addEventListener("click", (e) => {
      const categoryId = parseInt(
        e.target.closest(".btn-task-delete").dataset.categoryId
      );
      const taskId = parseInt(
        e.target.closest(".btn-task-delete").dataset.taskId
      );

      currentAction = "deleteTask";
      currentCategoryId = categoryId;
      currentTaskId = taskId;
      confirmMessage.textContent = "Are you sure you want to delete this task?";
      confirmModal.classList.add("active");
    });
  });

  document.querySelectorAll(".btn-task-edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const categoryId = parseInt(
        e.target.closest(".btn-task-edit").dataset.categoryId
      );
      const taskId = parseInt(
        e.target.closest(".btn-task-edit").dataset.taskId
      );
      const category = categories.find((cat) => cat.id === categoryId);

      if (category) {
        const task = category.tasks.find((t) => t.id === taskId);
        if (task) {
          currentAction = "editTask";
          currentCategoryId = categoryId;
          currentTaskId = taskId;
          editTitle.textContent = "Edit Task";
          editInput.value = task.text;
          editModal.classList.add("active");
        }
      }
    });
  });
}

function saveData() {
  localStorage.setItem("nestedTodoData", JSON.stringify(categories));
}

function loadData() {
  const savedData = localStorage.getItem("nestedTodoData");
  if (savedData) {
    try {
      categories = JSON.parse(savedData);

      categories.reverse();
      categories.forEach((category) => {
        category.tasks.reverse();
      });
    } catch (e) {
      categories = [];
      console.error("Error loading saved data:", e);
    }
  }
}
