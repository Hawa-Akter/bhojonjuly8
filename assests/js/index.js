// Authenticate user and create a new session
const { ipcRenderer } = require("electron");
const login = document.querySelector("#login");
const emailMsg = document.getElementById("emptyEmail");
const passMsg = document.getElementById("emptyPass");

login.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  var users = { email, password };
  if (email == null || email == "") {
    emailMsg.innerHTML = "Email cannot be empty";
    return false;
  } else {
    emailMsg.innerHTML = "";
  }
  if (password == null || password == "") {
    passMsg.innerHTML = "Password cannot be empty";
    return false;
  } else {
    passMsg.innerHTML = "";
  }
  ipcRenderer.send("authenticated", users);
  // ipcRenderer.send("unAuthenticated", "");
});

ipcRenderer.on("unauthenticatedReply", (evt, result) => {
  document.getElementById("errorMsg").innerHTML = result;
});
