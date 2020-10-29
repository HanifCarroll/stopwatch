let isDarkModeEnabled = false;

// All of the relevant elements.
const lightSwitch = document.querySelector(".light-switch");
const addSWButton = document.querySelector(".add");
const removeSWButton = document.querySelector(".remove");
const startAllButton = document.querySelector(".start-all");
const resetAllButton = document.querySelector(".reset-all");
const timeText = document.querySelector(".time");
const startButton = document.querySelector(".start");
const resetButton = document.querySelector(".reset");

// Icons
const START_ICON = "<i class='fas fa-play'></i>";
const PAUSE_ICON = "<i class='fas fa-pause'></i>";
const BULB_OFF = "<i class='fas fa-lightbulb'></i>";
const BULB_ON = "<i class='fas fa-lightbulb'></i>";

// Stopwatch and StopwatchContainer classes
class Stopwatch {
  constructor(stopwatchContainer) {
    this.time = {
      ms: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
    };
    this.stopwatchContainer = stopwatchContainer;
    this.stopwatchContainer.addStopwatch(this);
    this.interval = null;
    this.isStarted = false;
    this.isTicking = false;

    // HTML elements that correspond to the instance.
    this.timeText = null;
    this.startButton = null;
    this.resetButton = null;

    // Bind methods to the instance.
    this.tick = this.tick.bind(this);
    this.updateClock = this.updateClock.bind(this);
    this.setButtonText = this.setButtonText.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.forceContainerUpdate = this.forceContainerUpdate.bind(this);
  }

  getTime() {
    const { ms, seconds, minutes, hours } = this.time;
    const timeValues = [ms, seconds, minutes, hours];

    return timeValues.map(value => value < 10 ? `0${value}` : value)
      .reverse()
      .join(':');
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
    // Prevent intervals from piling up.
    if (this.interval) {
      this.cleanUp();
    }

    this.interval = window.setInterval(this.tick, 10);
    this.isStarted = true;
    this.isTicking = true;

    this.setButtonText();
    this.forceContainerUpdate();
  }

  pause() {
    if (this.interval) {
      this.cleanUp();
      this.isTicking = false;
      this.setButtonText();
      this.forceContainerUpdate();
    }
  }

  reset() {
    if (this.interval) {
      this.cleanUp();
    }

    this.time.ms = 0;
    this.time.seconds = 0;
    this.time.minutes = 0;
    this.time.hours = 0;
    this.isStarted = false;
    this.isTicking = false;

    this.setButtonText();
    this.updateDOM();
    this.forceContainerUpdate();
  }

  cleanUp() {
    window.clearInterval(this.interval);
  }

  setButtonText() {
    if (!this.isTicking && !this.isStarted) {
      this.startButton.textContent = "Start";
      this.startButton.classList.remove("stop-timer");
      this.startButton.classList.add("start-timer");
    }

    if (!this.isTicking && this.isStarted) {
      this.startButton.textContent = "Resume";
      this.startButton.classList.remove("stop-timer");
      this.startButton.classList.add("start-timer");
    }

    if (this.isTicking) {
      this.startButton.textContent = "Pause";
      this.startButton.classList.remove("start-timer");
      this.startButton.classList.add("stop-timer");
    }
  }

  onStartClick() {
    this.startButton.textContent === "Pause" ? this.pause() : this.start();
    this.forceContainerUpdate();
  }

  forceContainerUpdate() {
    this.stopwatchContainer.updateContainer();
  }
}

class StopwatchContainer {
  constructor() {
    this.stopwatches = [];

    this.addStopwatch = this.addStopwatch.bind(this);
    this.removeStopwatch = this.removeStopwatch.bind(this);
    this.startAllWatches = this.startAllWatches.bind(this);
    this.resetAllWatches = this.resetAllWatches.bind(this);
    this.allWatchesActive = this.allWatchesActive.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
  }

  addStopwatch(stopwatch) {
    this.stopwatches.push(stopwatch);
  }

  removeStopwatch() {
    if (this.stopwatches.length === 1) {
      return;
    }

    const indexToDelete = this.stopwatches.length - 1;
    this.stopwatches[indexToDelete].cleanUp();
    this.stopwatches[indexToDelete] = null;
    this.stopwatches.pop();
    this.updateContainer();
  }

  startAllWatches() {
    !this.allWatchesActive() 
      ? this.stopwatches.forEach(sw => sw.start())
      : this.stopwatches.forEach(sw => sw.pause())
    this.updateContainer();
  }

  resetAllWatches() {
    this.stopwatches.forEach(sw => sw.reset());
    this.updateContainer();
  }

  allWatchesActive() {
    return this.stopwatches.every(sw => sw.isTicking);
  }

  updateContainer() {
    this.allWatchesActive()
      ? (startAllButton.innerHTML = PAUSE_ICON)
      : (startAllButton.innerHTML = START_ICON);
  }
}

// Set-up the initial page view.

const stopwatchContainer = new StopwatchContainer();
const stopwatch = new Stopwatch(stopwatchContainer);

stopwatch.timeText = timeText;
stopwatch.startButton = startButton;
stopwatch.resetButton = resetButton;

lightSwitch.addEventListener("click", switchLights);
startAllButton.addEventListener("click", stopwatchContainer.startAllWatches);
resetAllButton.addEventListener("click", stopwatchContainer.resetAllWatches);
addSWButton.addEventListener("click", createNewSW);
removeSWButton.addEventListener("click", removeSW);
startButton.addEventListener("click", stopwatch.onStartClick);
resetButton.addEventListener("click", stopwatch.reset);

function createNewSW() {
  // Create elements representing new stopwatch.
  const newSection = document.createElement("section");
  const newTimeText = document.createElement("p");
  const newButtonDiv = document.createElement("div");
  const newStartButton = document.createElement("a");
  const newResetButton = document.createElement("a");

  // Set text on new elements.
  newTimeText.textContent = "00:00:00:00";
  newStartButton.textContent = "Start";
  newResetButton.textContent = "Reset";

  // Set classes on new elements.
  newSection.classList.add("stopwatch");
  newTimeText.classList.add("time");
  newButtonDiv.classList.add("buttons");
  newStartButton.classList.add("start", "start-timer", "button");
  newResetButton.classList.add("reset", "button");
  if (isDarkModeEnabled) {
    newResetButton.classList.add("dark-button");
  }

  // Create stopwatch and connect new elements to the instance.
  const newStopwatch = new Stopwatch(stopwatchContainer);
  newStopwatch.startButton = newStartButton;
  newStopwatch.resetButton = newResetButton;
  newStopwatch.timeText = newTimeText;

  // Add event listeners for buttons.
  newStartButton.addEventListener("click", newStopwatch.onStartClick);
  newResetButton.addEventListener("click", newStopwatch.reset);

  // Append elements to the created section.
  newButtonDiv.append(newStartButton, newResetButton);
  newSection.append(newTimeText, newButtonDiv);

  // Append newly created section to the stopwatches section.
  const stopwatchesSection = document.querySelector(".stopwatches");
  stopwatchesSection.append(newSection);

  stopwatchContainer.updateContainer();
}

function removeSW() {
  const stopwatchesSection = document.querySelector(".stopwatches");
  const stopwatchSections = document.querySelectorAll(".stopwatch");

  if (stopwatchSections.length > 1) {
    const lastStopwatch = stopwatchSections[stopwatchSections.length - 1];

    stopwatchesSection.removeChild(lastStopwatch);
    stopwatchContainer.removeStopwatch();
  }
}

function switchLights() {
  isDarkModeEnabled = !isDarkModeEnabled;

  const buttons = document.querySelectorAll("a");
  const { body } = document;

  if (isDarkModeEnabled) {
    lightSwitch.innerHTML = BULB_ON;
    body.classList.toggle("dark-body");
    toggleButtonsClass(buttons, "dark-button");
  } else {
    lightSwitch.innerHTML = BULB_OFF;
    body.classList.toggle("dark-body");
    toggleButtonsClass(buttons, "dark-button");
  }
}

function toggleButtonsClass(elements, className) {
  elements.forEach(el => {
    if (
      !el.classList.contains("start-timer") &&
      !el.classList.contains("stop-timer")
    ) {
      el.classList.toggle(className);
    }
  });
}
