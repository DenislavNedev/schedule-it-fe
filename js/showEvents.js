"use strict";

setTimeout(function () {
  const calendars = document.querySelectorAll(".calendar");

  // console.log(calendars);
  // console.log(calendars.length);

  calendars.forEach((calendar) => {
    fetch("https://schedule-it-be.herokuapp.com/api/events/all-events", {
      method: "GET",
      headers: {
        Authorization: window.localStorage.getItem("auth_token"),
      },
    })
      .then((response) => response.json())
      .then((response) => {
        response.forEach((event) => {
          const date =
            calendar.childNodes[1].childNodes[0].childNodes[0].innerText;
          if (event.start.split("T")[0] == date) {
            const event_item = document.createElement("div");
            event_item.setAttribute("class", "event_item");
            const event_dot = document.createElement("div");
            event_dot.setAttribute("class", "ei_Dot");
            const event_title = document.createElement("p");
            event_title.setAttribute("class", "ei_Title");
            const time = document.createElement("time");
            time.setAttribute("class", "ei_Copy");
            const event_info = document.createElement("time");
            event_info.setAttribute("class", "ei_Info");

            let description = "";
            let presentationUrl = "";
            let meetingURL = "";
            let facultyNumber = "";

            if (!isEmpty(event.description)) {
              description = "\n" + event.description;
            }

            if (!isEmpty(event.presentationUrl)) {
              presentationUrl = "\n Presentation: " + event.presentationUrl;
            }

            if (!isEmpty(event.meetingUrl)) {
              meetingURL = "\n Meeting: " + event.meetingUrl;
            }

            event_title.innerText =
              event.subject +
              ", " +
              event.username +
              (!isEmpty(event.fn_number) ? ", " + event.fn_number : "");
            time.innerText =
              (new Date(event.start).getHours() < 10 ? "0" : "") +
              new Date(event.start).getHours() +
              ":" +
              (new Date(event.start).getMinutes() < 10 ? "0" : "") +
              new Date(event.start).getMinutes() +
              " - " +
              (new Date(event.end).getHours() < 10 ? "0" : "") +
              new Date(event.end).getHours() +
              ":" +
              (new Date(event.end).getMinutes() < 10 ? "0" : "") +
              new Date(event.end).getMinutes();
            event_info.innerText =
              description + presentationUrl + meetingURL + facultyNumber;

            const calendar_events = calendar.childNodes[2];

            event_item.appendChild(event_dot);
            event_item.appendChild(event_title);
            event_item.appendChild(time);
            event_item.appendChild(event_info);
            calendar_events.appendChild(event_item);

            event_item.addEventListener("click", (e) => {
              e.preventDefault();

              if (event.start.split(" ")[0] === getToday()) {
                const queryString =
                  "?date=" +
                  calendar.childNodes[1].childNodes[0].childNodes[0].innerText +
                  "&end=" +
                  new Date(event.end).getHours() +
                  ":" +
                  (new Date(event.end).getMinutes() < 10 ? "0" : "") +
                  new Date(event.end).getMinutes() +
                  "&subject=" +
                  event.subject +
                  "&presenter=" +
                  event.name;
                showVerificationCodeModal(queryString);
              }
            });
          }
        });
      });
  });
}, 500);

function isEmpty(stringValue) {
  return (
    stringValue === null || stringValue === "" || stringValue === undefined
  );
}

function showVerificationCodeModal(queryString) {
  const verificationModal = document.getElementById("verification-modal");
  verificationModal.style.display = "block";

  const span = document.getElementById("close-verification-modal");
  span.onclick = function () {
    verificationModal.style.display = "none";

    document.getElementById("verification-code-error").classList.add("hidden");
    verificationModal.style.animation = "";
    verificationModal.style.animationIterationCount = "";
  };

  const continueButton = document.getElementById("check-verification-code-btn");

  continueButton.addEventListener("click", (e) => {
    e.preventDefault();

    const verificationCode = document.getElementById("verification-code-input")
      .value;
    if (verificationCode === "") {
      console.log(verificationCode);
      showVerificationCodeErrorMessage("Verification code fileds is empty!");
      addShakeEffect(verificationModal);
    } else {
      hideVerificationCodeErrorMessage();

      var url = new URL("https://schedule-it-be.herokuapp.com/api/users/");
      url.searchParams.append(
        "username",
        window.localStorage.getItem("username")
      );

      const verificationCode = document.getElementById(
        "verification-code-input"
      ).value;
      fetch("https://schedule-it-be.herokuapp.com/api/users/verification-codes/", {
        method: "GET",
        headers: {
          Authorization: window.localStorage.getItem("auth_token"),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            let isAuthorized = false;
            for (let i = 0; i < response.codes.length; i++) {
              if (
                verificationCode.localeCompare(
                  response.codes[i].verificationCode
                ) == 0
              ) {
                isAuthorized = true;
                window.location.href = "../views/timer.html" + queryString;
                break;
              }
            }

            if (!isAuthorized) {
              addShakeEffect(verificationModal);
              showVerificationCodeErrorMessage(
                "You are not authorized to track the delay! If you think this is an error, please contact your teacher."
              );
            }
          } else {
            addShakeEffect(verificationModal);
            showVerificationCodeErrorMessage(
              "There was an error connecting to the database"
            );
            console.log(response.message);
          }
        });
    }
  });
}

function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today;
}

const showVerificationCodeErrorMessage = (message) => {
  document.getElementById("verification-code-error").classList.remove("hidden");
  document.getElementById("verification-code-error-text").innerText = message;
};

function hideVerificationCodeErrorMessage() {
  document.getElementById("verification-code-error").classList.add("hidden");
}

function addShakeEffect(elem) {
  elem.style.animation = "shake 0.3s";
  elem.style.animationIterationCount = "1s";
}
