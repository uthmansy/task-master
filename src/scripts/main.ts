import {
  login,
  register,
  getTasks,
  createTask,
  completeTask,
  deleteTask,
  searchTask,
} from "./api";

// Select DOM elements
const authDiv = document.getElementById("auth") as HTMLElement;
const tasksDiv = document.getElementById("tasks") as HTMLElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const registerBtn = document.getElementById("registerBtn") as HTMLButtonElement;
const addTaskBtn = document.getElementById("addTaskBtn") as HTMLButtonElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const searchInput = document.getElementById("search") as HTMLInputElement;
const searchButton = document.getElementById("search-btn") as HTMLInputElement;
const emailRegisterInput = document.getElementById(
  "emailRegister"
) as HTMLInputElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const passwordRegisterInput = document.getElementById(
  "passwordRegister"
) as HTMLInputElement;
const taskTitle = document.getElementById("taskTitle") as HTMLInputElement;
const taskDescription = document.getElementById(
  "taskDescription"
) as HTMLInputElement;
const priority = document.getElementById("priority") as HTMLInputElement;
const date = document.getElementById("date") as HTMLInputElement;
const taskList = document.getElementById("taskList") as HTMLElement;

let authToken: string | null = null;

function formatISODate(isoDate: string): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

// Show tasks UI after login
function showTasks() {
  authDiv.style.display = "none";
  tasksDiv.style.display = "block";
  loadTasks();
}

// Load tasks from the server
async function loadTasks(query: string | null = null) {
  if (!authToken) return;
  let tasks: {
    title: string;
    description: string;
    completed: boolean;
    _id: string;
    priority: string;
    date: string;
  }[];
  if (query) {
    tasks = await searchTask(authToken, query);
  } else {
    tasks = await getTasks(authToken);
  }
  taskList.innerHTML = tasks
    .map(
      (task) => `
        <div class="task">
          <div class="taskContant"><span>${task.title}</span><span>${
        task.description
      }</span><span>
        ${task.priority}
      </span><span>
        Deadline: ${task.date && formatISODate(task.date)}
      </span><span>
        ${task.completed ? "completed" : "uncompleted"}
      </span></div>
          ${
            !task.completed
              ? `<button data-id="${task._id}" class="complete-btn">Mark as Completed</button>`
              : ""
          }
          ${`<button data-id="${task._id}" class="delete-btn">Delete</button>`}
        </div>
      `
    )
    .join("");

  // Add event listeners to "Complete" buttons
  const completeButtons = document.querySelectorAll(".complete-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");
  completeButtons.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const button = event.target as HTMLButtonElement;
      const taskId = button.dataset.id;
      if (authToken && taskId) {
        await completeTask(authToken, taskId); // Call the API to complete the task
        loadTasks(); // Reload tasks after completion
      }
    });
  });
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const button = event.target as HTMLButtonElement;
      const taskId = button.dataset.id;
      console.log(taskId);
      if (authToken && taskId) {
        await deleteTask(authToken, taskId); // Call the API to complete the task
        loadTasks(); // Reload tasks after completion
      }
    });
  });
}

// Add event listeners
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  authToken = await login(email, password);
  if (authToken) showTasks();
});
searchButton.addEventListener("click", async () => {
  const query = searchInput.value;

  if (authToken && query) {
    loadTasks(query);
  }
});

registerBtn.addEventListener("click", async () => {
  const name = nameInput.value;
  const email = emailRegisterInput.value;
  const password = passwordRegisterInput.value;

  const success = await register(name, email, password);
  if (success) alert("Registration successful! Please login.");
});

addTaskBtn.addEventListener("click", async () => {
  const task = {
    title: taskTitle.value,
    description: taskDescription.value,
    date: date.value,
    priority: priority.value,
  };
  if (authToken && task) {
    await createTask(authToken, task);
    taskTitle.value = "";
    taskDescription.value = "";
    priority.value = "";
    loadTasks();
  }
});
