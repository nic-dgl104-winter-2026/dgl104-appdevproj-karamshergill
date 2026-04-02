"use strict";

const noticeBox = document.getElementById("notice-box");
const allCount = document.getElementById("all-count");
const todoCount = document.getElementById("todo-count");
const workCount = document.getElementById("work-count");
const doneCount = document.getElementById("done-count");

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

const AppState = {
  taskData: JSON.parse(localStorage.getItem("studentTaskData")) || [],
  changingId: null
};

function createUser(userName, userRole) {
  return {
    name: userName,
    role: userRole
  };
}

function sendNotice(message) {
  noticeBox.textContent = message;
}

function keepData() {
  localStorage.setItem("studentTaskData", JSON.stringify(AppState.taskData));
}

function showCounts() {
  allCount.textContent = AppState.taskData.length;
  todoCount.textContent = AppState.taskData.filter(function (item) {
    return item.status === "To Do";
  }).length;
  workCount.textContent = AppState.taskData.filter(function (item) {
    return item.status === "Working";
  }).length;
  doneCount.textContent = AppState.taskData.filter(function (item) {
    return item.status === "Done";
  }).length;
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const userNameValue = username.value.trim();
  const roleValue = role.value;

  if (userNameValue === "") {
    alert("Please enter username.");
    return;
  }

  const currentUser = createUser(userNameValue, roleValue);

  localStorage.setItem("currentUserName", currentUser.name);
  localStorage.setItem("currentUserRole", currentUser.role);

  sendNotice("User logged in: " + currentUser.name + " (" + currentUser.role + ")");
});

function resetTaskForm() {
  taskForm.reset();
  taskLevel.value = "Medium";
  taskState.value = "To Do";
  saveBtn.textContent = "Save Task";
  AppState.changingId = null;
}

function removeTask(id) {
  AppState.taskData = AppState.taskData.filter(function (item) {
    return item.id !== id;
  });

  keepData();
  drawTasks();
  showCounts();
  sendNotice("Task deleted successfully.");
}

function loadForEdit(id) {
  const found = AppState.taskData.find(function (item) {
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
  AppState.changingId = id;
  saveBtn.textContent = "Update Task";
  sendNotice("Task loaded for editing.");
}

function drawTasks() {
  listArea.innerHTML = "";

  AppState.taskData.forEach(function (item) {
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

  if (AppState.changingId !== null) {
    for (let i = 0; i < AppState.taskData.length; i++) {
      if (AppState.taskData[i].id === AppState.changingId) {
        AppState.taskData[i] = {
          id: AppState.changingId,
          name: nameValue,
          details: detailsValue,
          priority: taskLevel.value,
          status: taskState.value,
          date: dateValue,
          assigned: assignedValue
        };
      }
    }

    sendNotice("Task updated successfully.");
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

    AppState.taskData.push(newTask);
    sendNotice("New task created successfully.");
  }

  keepData();
  drawTasks();
  showCounts();
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

drawTasks();
showCounts();