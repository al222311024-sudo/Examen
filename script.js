const ageForm = document.querySelector("#age-form");
const birthDateInput = document.querySelector("#birth-date");
const ageResult = document.querySelector("#age-result");

ageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const birthDate = new Date(`${birthDateInput.value}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasNotPassed =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (birthDate > today) {
    ageResult.textContent = "La fecha debe ser anterior a hoy.";
    return;
  }

  if (birthdayHasNotPassed) {
    age -= 1;
  }

  ageResult.textContent = `${age} años`;
});

const temperatureForm = document.querySelector("#temperature-form");
const temperatureInput = document.querySelector("#temperature-value");
const temperatureFrom = document.querySelector("#temperature-from");
const temperatureTo = document.querySelector("#temperature-to");
const temperatureResult = document.querySelector("#temperature-result");

temperatureForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = Number(temperatureInput.value);
  const from = temperatureFrom.value;
  const to = temperatureTo.value;
  let celsius;

  if (from === "fahrenheit") {
    celsius = (value - 32) * 5 / 9;
  } else if (from === "kelvin") {
    celsius = value - 273.15;
  } else {
    celsius = value;
  }

  if (celsius < -273.15) {
    temperatureResult.textContent = "La temperatura no puede ser menor que 0 K.";
    return;
  }

  let result;
  if (to === "fahrenheit") {
    result = celsius * 9 / 5 + 32;
  } else if (to === "kelvin") {
    result = celsius + 273.15;
  } else {
    result = celsius;
  }

  const units = { celsius: "°C", fahrenheit: "°F", kelvin: "K" };
  temperatureResult.textContent = `${result.toFixed(2)} ${units[to]}`;
});

const taskForm = document.querySelector("#task-form");
const taskNameInput = document.querySelector("#task-name");
const taskTimeInput = document.querySelector("#task-time");
const taskList = document.querySelector("#task-list");
const storageKey = "punto-tasks";
let tasks = [];

try {
  const savedTasks = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(savedTasks)) {
    tasks = savedTasks;
  }
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const name = document.createElement("span");
    const deleteButton = document.createElement("button");

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    name.textContent = task.name;
    label.append(checkbox, name);
    item.append(label);

    if (task.time) {
      const time = document.createElement("time");
      time.textContent = task.time;
      item.append(time);
    }

    deleteButton.type = "button";
    deleteButton.className = "task-delete";
    deleteButton.textContent = "Borrar";
    deleteButton.setAttribute("aria-label", `Borrar tarea: ${task.name}`);
    deleteButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    item.append(deleteButton);
    taskList.append(item);
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  tasks.push({
    name: taskNameInput.value.trim(),
    time: taskTimeInput.value,
    completed: false,
  });
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskNameInput.focus();
});

renderTasks();