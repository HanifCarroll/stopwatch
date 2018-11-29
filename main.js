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

    this.timeText = null;
    this.startButton = null;
    this.resetButton = null;

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
    this.timeText.textContent = this.getTime();
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
      this.startButton.textContent = "Start";
    }

    if (!this.isTicking && this.isStarted) {
      this.startButton.textContent = "Resume";
    }

    if (this.isTicking) {
      this.startButton.textContent = "Pause";
    }
  }

  onStartClick() {
    this.startButton.textContent === "Pause" ? this.pause() : this.start();
  }
}

// Set-up the initial stopwatch.
const startButton = document.querySelector(".start");
const resetButton = document.querySelector(".reset");
const timeText = document.querySelector(".time");
const addSWButton = document.querySelector(".add");
const stopwatch = new Stopwatch();

stopwatch.timeText = timeText;
stopwatch.startButton = startButton;
stopwatch.resetButton = resetButton;

startButton.addEventListener("click", stopwatch.onStartClick);
resetButton.addEventListener("click", stopwatch.reset);
addSWButton.addEventListener("click", createNewSW);

function createNewSW() {
  // Create new elements.
  const newSection = document.createElement("section");
  const newTimeText = document.createElement("p");
  const newButtonDiv = document.createElement("div");
  const newStartButton = document.createElement("button");
  const newResetButton = document.createElement("button");

  // Set text on new elements.
  newTimeText.textContent = "00:00:00";
  newStartButton.textContent = "Start";
  newResetButton.textContent = "Reset";

  // Create stopwatch and connect elements.
  const newStopwatch = new Stopwatch();
  newStopwatch.startButton = newStartButton;
  newStopwatch.resetButton = newResetButton;
  newStopwatch.timeText = newTimeText;

  // Add event listeners for buttons.
  newStartButton.addEventListener("click", newStopwatch.onStartClick);
  newResetButton.addEventListener("click", newStopwatch.reset);

  // Append elements to the created section.
  newButtonDiv.append(newStartButton, newResetButton);
  newSection.append(newTimeText, newButtonDiv);

  // Append newly created section to the body.
  document.body.append(newSection);
}
