const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const resetButton = document.querySelector(".reset");
const timeText = document.querySelector(".time");

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

    this.isStarted = true;
    this.isTicking = true;
    this.setButtonText();
    this.interval = window.setInterval(this.tick, 10);
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
}

const stopwatch = new Stopwatch();

startButton.addEventListener("click", stopwatch.start);
pauseButton.addEventListener("click", stopwatch.pause);
resetButton.addEventListener("click", stopwatch.reset);
