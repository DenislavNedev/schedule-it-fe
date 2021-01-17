"use strict";

const addSlotBtn = document.getElementById("add-slot-button");
const EMPTY_FIELD = "";

const modal = document.getElementById("successModal");

const addAnotherSlot = document.getElementById("add-another-slot-button");
const goToCalendar = document.getElementById("go-to-calendar-button");

//Close modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById("add-slots-form").reset();
  }
};

addAnotherSlot.addEventListener("click", (event) => {
  event.preventDefault();
  location.reload();
});

goToCalendar.addEventListener("click", (event) => {
  event.preventDefault();
  location.replace("calendar.html");
});

function setMinDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  document.getElementById("add-slot-date").setAttribute("min", today);
}
setMinDate();

function isEndHourBeforeStartHour() {
  return (
    document.getElementById("add-slot-time-end").value <
    document.getElementById("add-slot-time-start").value
  );
}

function areThereEmptyFields() {
  return (
    document.getElementById("add-slot-name").value === EMPTY_FIELD ||
    document.getElementById("add-slot-date").value === EMPTY_FIELD ||
    document.getElementById("add-slot-time-start").value === EMPTY_FIELD ||
    document.getElementById("add-slot-time-end").value === EMPTY_FIELD ||
    document.getElementById("add-slot-time-period").value === EMPTY_FIELD
  );
}

addSlotBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (areThereEmptyFields()) {
    showErrorMessage("Error! Empty fields! All fields are required!");
  } else if (isEndHourBeforeStartHour()) {
    showErrorMessage("Error! End hour is before start hour!");
  } else {
    hideErrorMessage();
    const slot = {
      name: document.getElementById("add-slot-name").value,
      date: document.getElementById("add-slot-date").value,
      startHour: document.getElementById("add-slot-time-start").value,
      endHour: document.getElementById("add-slot-time-end").value,
      period: document.getElementById("add-slot-time-period").value,
      delay: 0,
    };

    passSlotData(slot);
  }
});

const passSlotData = (slotData) => {
  fetch(API_URL + "/api/slots/add-slot", {
    method: "POST",
    body: JSON.stringify(slotData),
    headers: {
      Authorization: window.localStorage.getItem("auth_token"),
      "Content-Type": "application/json",
    },
  }).then((response) => {
    console.log(response);
    if (response.status) {
      modal.style.display = "block";
      console.log("Succesfull added new slot!");
    } else {
      showErrorMessage("Something happened, please try again later.");
    }
  });
};

const showErrorMessage = (message) => {
  document.getElementById("add-slot-failure").classList.remove("hidden");
  document.getElementById("add-slot-failure-text").innerText = message;
  // shake animation here again
  const panel = document.getElementById("add-slots-form");
  panel.style.animation = "shake 0.3s";
  panel.style.animationIterationCount = "1s";
};
function hideErrorMessage() {
  document.getElementById("add-slot-failure").classList.add("hidden");
}
