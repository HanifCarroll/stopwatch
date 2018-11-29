const startButton = document.querySelector(".start");
const resetButton = document.querySelector(".reset");
const timeText = document.querySelector(".time");
const addSWButton = document.querySelector(".add");

class Stopwatch {
  constructor() {
    this.time = {
      ms: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
    };
    this.interval = null;
    this.isStarted = false;
    this.isTicking = false;

    this.tick = this.tick.bind(this);
    this.updateClock = this.updateClock.bind(this);
    this.setButtonText = this.setButtonText.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
  }

  getTime() {
    const { ms, seconds, minutes, hours } = this.time;
    let formatMs = ms;
    let formatSeconds = seconds;
    let formatMinutes = minutes;
    let formatHours = hours;

    if (ms < 10) {
      formatMs = `0${ms}`;
    }

    if (seconds < 10) {
      formatSeconds = `0${seconds}`;
    }

    if (minutes < 10) {
      formatMinutes = `0${minutes}`;
    }

    if (hours < 10) {
      formatHours = `0${hours}`;
    }

    return `${formatHours}:${formatMinutes}:${formatSeconds}:${formatMs}`;
  }

  tick() {
    this.updateClock();
    this.updateDOM();
  }

  updateClock() {
    this.time.ms += 1;
    if (this.time.ms === 100) {
      this.time.ms = 0;
      this.time.seconds++;
    }

    if (this.time.seconds === 60) {
      this.time.seconds = 0;
      this.time.minutes++;
    }

    if (this.time.minutes === 60) {
      this.time.minutes = 0;
      this.time.hours++;
    }
  }

  updateDOM() {
    timeText.textContent = this.getTime();
  }

  start() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }

    this.interval = window.setInterval(this.tick, 10);
    this.isStarted = true;
    this.isTicking = true;
    this.setButtonText();
  }

  pause() {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.isTicking = false;
      this.setButtonText();
    }
  }

  reset() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    this.isStarted = false;
    this.isTicking = false;
    this.setButtonText();
    this.time.ms = 0;
    this.time.seconds = 0;
    this.time.minutes = 0;
    this.time.hours = 0;

    this.updateDOM();
  }

  setButtonText() {
    if (!this.isTicking && !this.isStarted) {
      startButton.textContent = "Start";
    }

    if (!this.isTicking && this.isStarted) {
      startButton.textContent = "Resume";
    }

    if (this.isTicking) {
      startButton.textContent = "Pause";
    }
  }

  onStartClick() {
    startButton.textContent === "Pause" ? this.pause() : this.start();
  }
}

const stopwatch = new Stopwatch();

startButton.addEventListener("click", stopwatch.onStartClick);
resetButton.addEventListener("click", stopwatch.reset);
addSWButton.addEventListener("click", createNewSW);

function createNewSW() {
  const section = document.createElement("section");
  const timeText = document.createElement("p");
  const buttonDiv = document.createElement("div");
  const startButton = document.createElement("button");
  const resetButton = document.createElement("button");

  timeText.textContent = "00:00:00";
  startButton.textContent = "Start";
  resetButton.textContent = "Reset";

  buttonDiv.append(startButton, resetButton);
  section.append(timeText, buttonDiv);

  document.body.append(section);
}
