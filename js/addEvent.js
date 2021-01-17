"use strict";

setTimeout(function () {
  const calendars = document.querySelectorAll(".calendar");

  calendars.forEach((calendar) => {
    const calendarPlusButton =
      calendar.childNodes[1].childNodes[0].childNodes[1];
    const calendarName = calendar.childNodes[0].childNodes[0].innerText;
    const calendarDate =
      calendar.childNodes[1].childNodes[0].childNodes[0].innerText;

    const modal = document.getElementById("myModal");

    calendarPlusButton.addEventListener("click", (event) => {
      event.preventDefault();

      modal.style.display = "block";

      const span = document.getElementsByClassName("close")[0];
      span.onclick = function () {
        modal.style.display = "none";

        document
          .getElementById("add-event-general-error")
          .classList.add("hidden");
        modal.style.animation = "";
        modal.style.animationIterationCount = "";
      };

      const modal_title = document.getElementById("modal-title");
      modal_title.innerText = calendarDate + " " + calendarName;

      // here add available slots in the dropdown
      const select_time = document.getElementById("select-time");
      select_time.innerHTML = "";

      fetch(API_URL + "/api/slots/all-slots", {
        method: "GET",
        headers: {
          Authorization: window.localStorage.getItem("auth_token"),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          response.forEach((slot) => {
            if (calendarDate == slot.date) {
              let all_possible_events = calculateTimeSlots(
                slot.startHour,
                slot.endHour,
                slot.period
              );

              let taken_events = calendar.childNodes[2].querySelectorAll(
                "time"
              );

              all_possible_events.forEach((event) => {
                const option = document.createElement("option");
                option.innerText = event;

                taken_events.forEach((taken_event) => {
                  if (event == taken_event.innerText) {
                    option.setAttribute("disabled", "true");
                  }
                });

                select_time.appendChild(option);
              });
            }
          });
        });

      const addEventButton = document.getElementById("add-event-btn");
      addEventButton.addEventListener("click", (event) => {
        const subject = document.getElementById("subject").value;

        if (subject === "") {
          showErrorMessage("Subject field is empty!");
          addShakeEffect(modal);
        } else {
          let time = document.getElementById("select-time");
          let selected_time = time.options[time.selectedIndex].innerText;
          let start_time = selected_time.split("-")[0].trim();
          let end_time = selected_time.split("-")[1].trim();

          let start_timestamp = new Date(
            calendarDate.split("-")[0],
            parseInt(calendarDate.split("-")[1]) - 1,
            calendarDate.split("-")[2],
            start_time.split(":")[0],
            start_time.split(":")[1]
          );
          let end_timestamp = new Date(
            calendarDate.split("-")[0],
            parseInt(calendarDate.split("-")[1]) - 1,
            calendarDate.split("-")[2],
            end_time.split(":")[0],
            end_time.split(":")[1]
          );
          let description = document.getElementById("description-input").value;
          let presentation_url = document.getElementById(
            "presentation_url-input"
          ).value;
          let meeting_url = document.getElementById("meeting_url-input").value;

          const username = window.localStorage.getItem("username");
          //  const fn_number = response.facultyNumber;

          const event = {
            username: username,
            subject: subject,
            start: start_timestamp,
            end: end_timestamp,
            description: description,
            presentationUrl: presentation_url,
            meetingUrl: meeting_url,
          };

          fetch(API_URL + "/api/events/add-event", {
            method: "POST",
            body: JSON.stringify(event),
            headers: {
              "Content-Type": "application/json",
              Authorization: window.localStorage.getItem("auth_token"),
            },
          }).then((response) => {
            if (response.status) {
              window.location.reload();
            }
          });
        }
      });
    });
  });
}, 500);

function calculateTimeSlots(start, end, duration) {
  //This is when the start and end are in format "HH:MM" (For example "10:00")

  let startHourInSeconds =
    parseInt(start.split(":")[0], 10) * 3600 +
    parseInt(start.split(":")[1], 10) * 60;
  let endSlotsHourInSeconds =
    parseInt(end.split(":")[0], 10) * 3600 +
    parseInt(end.split(":")[1], 10) * 60;
  const durationInSeconds = duration * 60;

  let timeSlots = [];
  while (startHourInSeconds < endSlotsHourInSeconds) {
    let endSlotTime = startHourInSeconds + durationInSeconds;

    if (endSlotTime > endSlotsHourInSeconds) {
      break;
    }

    timeSlots.push(createTimeSlotString(startHourInSeconds, endSlotTime));
    startHourInSeconds = startHourInSeconds + durationInSeconds;
  }

  return timeSlots;
}

function createTimeSlotString(startSeconds, endSeconds) {
  return (
    new Date(startSeconds * 1000).toISOString().substr(11, 5) +
    " - " +
    new Date(endSeconds * 1000).toISOString().substr(11, 5)
  );
}
const showErrorMessage = (message) => {
  document.getElementById("add-event-general-error").classList.remove("hidden");
  document.getElementById("add-event-general-error-text").innerText = message;
};

function hideErrorMessage() {
  document.getElementById("add-event-general-error").classList.add("hidden");
}

function addShakeEffect(elem) {
  elem.style.animation = "shake 0.3s";
  elem.style.animationIterationCount = "1s";
}

function clearShakeEffect(elem) {}
