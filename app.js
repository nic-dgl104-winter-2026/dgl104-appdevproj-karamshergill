"use strict";

const loginForm = document.getElementById("login-form");
const username = document.getElementById("username");
const role = document.getElementById("role");

const taskForm = document.getElementById("task-form");
const taskName = document.getElementById("task-name");
const taskInfo = document.getElementById("task-info");
const taskLevel = document.getElementById("task-level");
const taskState = document.getElementById("task-state");
const taskDate = document.getElementById("task-date");
const assignedUser = document.getElementById("assigned-user");
const saveBtn = document.getElementById("save-btn");
const listArea = document.getElementById("list-area");

let taskData = [];
let changingId = null;

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const userNameValue = username.value.trim();
  const roleValue = role.value;

  if (userNameValue === "") {
    alert("Please enter username.");
    return;
  }

  alert("Logged in as " + userNameValue + " (" + roleValue + ")");
});

function resetTaskForm() {
  taskForm.reset();
  taskLevel.value = "Medium";
  taskState.value = "To Do";
  saveBtn.textContent = "Save Task";
  changingId = null;
}

function removeTask(id) {
  taskData = taskData.filter(function (item) {
    return item.id !== id;
  });

  drawTasks();
}

function loadForEdit(id) {
  const found = taskData.find(function (item) {
    return item.id === id;
  });

  if (!found) {
    return;
  }

  taskName.value = found.name;
  taskInfo.value = found.details;
  taskLevel.value = found.priority;
  taskState.value = found.status;
  taskDate.value = found.date;
  assignedUser.value = found.assigned;
  changingId = id;
  saveBtn.textContent = "Update Task";
}

function drawTasks() {
  listArea.innerHTML = "";

  taskData.forEach(function (item) {
    const block = document.createElement("div");
    block.className = "one-task";
    block.innerHTML =
      "<h3>" + item.name + "</h3>" +
      "<p><strong>Description:</strong> " + item.details + "</p>" +
      "<p><strong>Priority:</strong> " + item.priority + "</p>" +
      "<p><strong>Status:</strong> " + item.status + "</p>" +
      "<p><strong>Due Date:</strong> " + item.date + "</p>" +
      "<p><strong>Assigned To:</strong> " + item.assigned + "</p>" +
      '<button data-edit="' + item.id + '">Edit</button> ' +
      '<button data-remove="' + item.id + '">Delete</button>';

    listArea.appendChild(block);
  });
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameValue = taskName.value.trim();
  const detailsValue = taskInfo.value.trim();
  const dateValue = taskDate.value;
  const assignedValue = assignedUser.value.trim();

  if (nameValue === "" || detailsValue === "" || dateValue === "" || assignedValue === "") {
    alert("Please fill all task fields.");
    return;
  }

  if (changingId !== null) {
    for (let i = 0; i < taskData.length; i++) {
      if (taskData[i].id === changingId) {
        taskData[i] = {
          id: changingId,
          name: nameValue,
          details: detailsValue,
          priority: taskLevel.value,
          status: taskState.value,
          date: dateValue,
          assigned: assignedValue
        };
      }
    }
  } else {
    const newTask = {
      id: new Date().getTime(),
      name: nameValue,
      details: detailsValue,
      priority: taskLevel.value,
      status: taskState.value,
      date: dateValue,
      assigned: assignedValue
    };

    taskData.push(newTask);
  }

  drawTasks();
  resetTaskForm();
});

listArea.addEventListener("click", function (e) {
  const removeId = e.target.getAttribute("data-remove");
  const editId = e.target.getAttribute("data-edit");

  if (removeId) {
    removeTask(Number(removeId));
  }

  if (editId) {
    loadForEdit(Number(editId));
  }
});