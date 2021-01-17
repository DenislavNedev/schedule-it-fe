"use strict";

let min, sec, ms, count, malt, salt, msalt;

let stopwatch = {
  start: function () {
    if (document.getElementById("start").firstChild.nodeValue != "Start") {
      document.getElementById("start").firstChild.nodeValue = "Start";
    }
    ms = 0;
    sec = 0;
    min = 0;
    count = setInterval(function () {
      if (ms == 100) {
        ms = 0;
        if (sec == 60) {
          sec = 0;
          min++;
        } else {
          sec++;
        }
      } else {
        ms++;
      }

      malt = stopwatch.pad(min);
      salt = stopwatch.pad(sec);
      msalt = stopwatch.pad(ms);

      stopwatch.update(malt + ":" + salt + ":" + msalt);
    }, 10);
  },
  stop: function () {
    clearInterval(count);
    document.getElementById("start").firstChild.nodeValue = "Start";
  },

  update: function (txt) {
    let temp = document.getElementById("timer");
    temp.firstChild.nodeValue = txt;
  },

  pad: function (time) {
    let temp;
    if (time < 10) {
      temp = "0" + time;
    } else {
      temp = time;
    }
    return temp;
  },
};

const start = document.getElementById("start");
start.addEventListener("click", (event) => {
  event.preventDefault();

  stopwatch.start();
  start.classList.add("hidden");
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const date = urlParams.get("date");
const end = urlParams.get("end");
const subject = urlParams.get("subject");
const presenter = urlParams.get("presenter");

const timerHeading = document.getElementById("timer-heading");
timerHeading.innerText = subject + ", " + presenter;

const stop = document.getElementById("stop");
stop.addEventListener("click", (event) => {
  event.preventDefault();

  stopwatch.stop();
  start.classList.remove("hidden");

  let delay = 0;
  const now = new Date();
  // console.log('Now: ' + now);
  const endTimestamp = new Date(
    date.split("-")[0],
    parseInt(date.split("-")[1] - 1),
    date.split("-")[2],
    end.split(":")[0],
    end.split(":")[1]
  );
  // console.log('End: ' + endTimestamp);
  const timestampsDifference = now - endTimestamp;
  const differenceInMinutes = timestampsDifference / 60000;
  delay = differenceInMinutes > 0 ? differenceInMinutes : 0;
  // console.log('Delay (in minutes): ' + parseInt(delay));

  // if (delay > 0) {

  const delayObject = {
    date: date,
    delay: delay,
  };

  fetch(API_URL + "/api/slots/save-delay", {
    method: "POST",
    body: JSON.stringify(delayObject),
    headers: {
      Authorization: window.localStorage.getItem("auth_token"),
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status) {
      window.location.href = "../views/calendar.html";
    } else {
      // show error
      console.log(response);
    }
  });
  // }
});
