"use strict";

const insertAfter = (referenceNode, newNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
console.log(document.cookie);
window.onload = (event) => {
  event.preventDefault();

  var url = new URL("https://schedule-it-be.herokuapp.com/api/users/");
  url.searchParams.append("username", window.localStorage.getItem("username"));

  fetch(url, {
    method: "GET",
    headers: { Authorization: window.localStorage.getItem("auth_token") },
  }).then((response) => {
    if (!response.status) {
      window.location.replace("../views/login.html");
    } else {
      response.json().then((response) => {
        document.getElementById("welcome-prompt").innerText +=
          " " + response.name;
        document.getElementById("username").innerText +=
          " " + response.username;
        document.getElementById("email").innerText += " " + response.email;
        document.getElementById("role").innerText += " " + response.role;
        if (response.role === "student") {
          const profile = document.getElementById("profile");
          const facultyNumberNode = document.createElement("p");
          facultyNumberNode.setAttribute("id", "facultyNumber");
          const facultyNumberText = document.createTextNode(
            "Faculty number: " + response.facultyNumber
          );
          facultyNumberNode.appendChild(facultyNumberText);
          insertAfter(document.getElementById("role"), facultyNumberNode);
        } else if (response.role === "teacher") {
          const codeNode = document.createElement("p");
          codeNode.setAttribute("id", "verification-code");
          let codeText = "";

          if (response.verificationCode !== null) {
            codeText = document.createTextNode(
              "Verification code: " + response.verificationCode
            );
          } else {
            codeText = document.createTextNode("");
          }
          codeNode.appendChild(codeText);
          insertAfter(document.getElementById("role"), codeNode);

          const generateCodeButton = document.getElementById(
            "generate-verification-code-button"
          );
          generateCodeButton.classList.remove("hidden");

          generateCodeButton.addEventListener("click", (event) => {
            event.preventDefault();

            const generatedCode = generateCode(15);
            codeNode.innerText = "Verification code: " + generatedCode;

            var url = new URL(
              "https://schedule-it-be.herokuapp.com/api/users/verification-codes/"
            );
            url.searchParams.append("username", "ddnedev");
            url.searchParams.append("verificationCode", generatedCode);

            // put request to server with code;
            fetch(url, {
              method: "PATCH",
              headers: {
                Authorization: window.localStorage.getItem("auth_token"),
              },
            }).then((response) => {
              if (response.status) {
                showSnackbar("Successfully updated verification code!");
              } else {
                showSnackbar(
                  "There was an error updating your verification code. Please try again!"
                );
              }
            });
          });
        }
      });
    }
  });
};

const generateCode = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = chars.length;
  let resultCode = "";

  for (let i = 0; i < length; i++) {
    resultCode += chars.charAt(Math.floor(Math.random() * charactersLength));
  }

  return resultCode;
};

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("../views/login.html");
  window.localStorage.removeItem("auth_token");
  window.localStorage.removeItem("username");
});

const showErrorMessage = (message) => {
  document.getElementById("change-failure").classList.remove("hidden");
  document.getElementById("failure-message").innerText = message;
  // shake animation here again
  const panel = document.getElementById("profile");
  panel.style.animation = "shake 0.3s";
  panel.style.animationIterationCount = "1s";
};

const showSnackbar = (message) => {
  const snackbar = document.getElementById("snackbar");
  snackbar.innerText = message;
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
    // location.reload();
  }, 2000);
};