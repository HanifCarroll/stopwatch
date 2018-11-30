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
    this.cleanUp = this.cleanUp.bind(this);
    this.forceContainerUpdate = this.forceContainerUpdate.bind(this);
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

    this.isStarted = false;
    this.isTicking = false;
    this.setButtonText();

    this.time.ms = 0;
    this.time.seconds = 0;
    this.time.minutes = 0;
    this.time.hours = 0;

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

    this.push = this.push.bind(this);
    this.pop = this.pop.bind(this);
    this.startAllWatches = this.startAllWatches.bind(this);
    this.resetAllWatches = this.resetAllWatches.bind(this);
    this.allWatchesActive = this.allWatchesActive.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
  }

  push(stopwatch) {
    this.stopwatches.push(stopwatch);
  }

  pop() {
    let deletedStopwatch = this.stopwatches[this.stopwatches.length - 1];
    deletedStopwatch.cleanUp();
    this.stopwatches[this.stopwatches.length - 1] = null;

    this.stopwatches.pop();
  }

  startAllWatches() {
    if (!this.allWatchesActive()) {
      this.stopwatches.forEach(sw => {
        sw.start();
      });
    } else {
      this.stopwatches.forEach(sw => {
        sw.pause();
      });
    }
    this.updateContainer();
  }

  resetAllWatches() {
    this.stopwatches.forEach(sw => sw.reset());
    this.updateContainer();
  }

  allWatchesActive() {
    let status = true;

    this.stopwatches.forEach(sw => {
      if (!sw.isTicking) {
        status = false;
      }
    });

    return status;
  }

  updateContainer() {
    const startIcon = "<i class='fas fa-play'></i>";
    const pauseIcon = "<i class='fas fa-pause'></i>";
    this.allWatchesActive()
      ? (startAllButton.innerHTML = pauseIcon)
      : (startAllButton.innerHTML = startIcon);
  }
}

// Set-up the initial page view.

const stopwatchContainer = new StopwatchContainer();
const stopwatch = new Stopwatch(stopwatchContainer);
stopwatchContainer.push(stopwatch);

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
  // Create new elements.
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
  if (isDarkModeEnabled) {
    newResetButton.classList.add("reset", "dark-button", "button");
  } else {
    newResetButton.classList.add("reset", "button");
  }

  // Create stopwatch and connect new elements to the instance.
  const newStopwatch = new Stopwatch(stopwatchContainer);
  stopwatchContainer.push(newStopwatch);
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

    stopwatchContainer.pop();
  }
}

function switchLights() {
  isDarkModeEnabled = !isDarkModeEnabled;

  const bulbOff = "<i class='fas fa-lightbulb'></i>";
  const bulbOn = "<i class='fas fa-lightbulb'></i>";
  const buttons = document.querySelectorAll("a");
  const { body } = document;

  if (isDarkModeEnabled) {
    lightSwitch.innerHTML = bulbOn;
    body.classList.add("dark-body");
    addClassToButtons(buttons, "dark-button");
  } else {
    lightSwitch.innerHTML = bulbOff;
    body.classList.remove("dark-body");
    removeClassFromButtons(buttons, "dark-button");
  }
}

function addClassToButtons(elements, className) {
  elements.forEach(el => {
    if (
      !el.classList.contains("start-timer") &&
      !el.classList.contains("stop-timer")
    ) {
      el.classList.add(className);
    }
  });
}

function removeClassFromButtons(elements, className) {
  elements.forEach(el => el.classList.remove(className));
}
