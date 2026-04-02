"use strict";

const loginForm = document.getElementById("login-form");
const username = document.getElementById("username");
const role = document.getElementById("role");

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