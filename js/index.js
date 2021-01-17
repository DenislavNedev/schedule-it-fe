"use strict";
const API_URL = "https://schedule-it-be.herokuapp.com";

var token = window.localStorage.getItem("auth_token");
var username = window.localStorage.getItem("username");

if (token && username) {
  var url = new URL(API_URL + "/api/users/");
  url.searchParams.append("username", username);

  fetch(url, {
    method: "GET",
    headers: { Authorization: window.localStorage.getItem("auth_token") },
  }).then((response) => {
    if (!response.status) {
      window.location.replace("../views/login.html");
    } else {
      response.json().then((response) => {
        if (response.role === "teacher") {
          console.log("It's a teacher!");
          document.getElementById("add-slots-menu-item").style.display =
            "inline-block";
        }
      });
    }
  });
}
