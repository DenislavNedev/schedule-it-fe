"use strict";

window.onload = (event) => {
  event.preventDefault();

  if (
    !window.localStorage.getItem("username") ||
    !window.localStorage.getItem("auth_token")
  ) {
    window.location.replace("../views/login.html");
  }

  fetch(API_URL + "/api/slots/all-slots", {
    method: "GET",
    headers: {
      Authorization: window.localStorage.getItem("auth_token"),
    },
  })
    .then((response) => response.json())
    .then((res) => {
      res.forEach((slot) => {
        const calendar = document.createElement("section");
        calendar.setAttribute("class", "calendar");

        const calendar_header = document.createElement("header");
        calendar_header.setAttribute("class", "calendar_header");
        const header_title = document.createElement("h1");
        header_title.setAttribute("class", "header_title");
        header_title.setAttribute("id", "header-title");

        const calendar_plan = document.createElement("article");
        calendar_plan.setAttribute("class", "calendar_plan");
        const cl_plan = document.createElement("div");
        cl_plan.setAttribute("class", "cl_plan");
        const date = document.createElement("div");
        date.setAttribute("class", "cl_copy");
        date.setAttribute("id", "date");
        const enroll_day = document.createElement("i");
        enroll_day.setAttribute("class", "cl_add");
        enroll_day.setAttribute("id", "enroll_day" + slot.id);
        enroll_day.innerText = "+";

        const calendar_events = document.createElement("article");
        calendar_events.setAttribute("class", "calendar_events");
        calendar_events.setAttribute("id", "calendar-events");
        const delay = document.createElement("p");
        delay.setAttribute("class", "ce_title");
        delay.innerText = "Current delay is " + slot.delay + " minutes.";

        header_title.innerText = slot.name;
        date.innerText = slot.date;

        let e_calendars = document.getElementById("calendars");

        calendar_header.appendChild(header_title);
        cl_plan.appendChild(date);
        cl_plan.appendChild(enroll_day);

        calendar_plan.appendChild(cl_plan);

        calendar_events.appendChild(delay);

        calendar.appendChild(calendar_header);
        calendar.appendChild(calendar_plan);
        calendar.appendChild(calendar_events);

        e_calendars.appendChild(calendar);
      });
    });
};
