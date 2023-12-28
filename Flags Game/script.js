let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const rulesContainer = document.querySelector(".rules-container"); // Add this line
const data = [
  "belgium",
  "bhutan",
  "brazil",
  "china",
  "cuba",
  "ecuador",
  "georgia",
  "germany",
  "hong-kong",
  "india",
  "iran",
  "myanmar",
  "norway",
  "spain",
  "sri-lanka",
  "sweden",
  "switzerland",
  "united-states",
  "uruguay",
  "wales",
];
let score = 0;
let scoreDisplay;
let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;
let timer;
let timeRemaining = 15;
let timerDisplay;
let correctSound = new Audio("true.mp3");
let wrongSound = new Audio("wrong.mp3");
let gameStarted = false;
let isGameActive = false;

const updateScoreDisplay = () => {
  if (scoreDisplay && timerDisplay) {
    scoreDisplay.innerText = `Score: ${score}`;
    timerDisplay.innerText = `Time: ${timeRemaining}s`;
  }
};

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;
let totalFlags = 3;
let remainingCountries = [...data];

const randomValueGenerator = () => {
  if (remainingCountries.length === 0) {
    remainingCountries = [...data];
  }
  const index = Math.floor(Math.random() * remainingCountries.length);
  const randomValue = remainingCountries[index];
  remainingCountries.splice(index, 1); 
  return randomValue;
};

const stopGame = () => {
  controls.classList.remove("hide");
  startButton.classList.remove("hide");
  clearInterval(timer);
  gameStarted = false;
  isGameActive = false; 
  timerDisplay.textContent = "";
};

function dragStart(e) {
  if (isTouchDevice()) {
    e.preventDefault(); // Prevent the default behavior of touch events
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    moveElement = true;
    currentElement = e.target;
  } else {
    e.dataTransfer.setData("text", e.target.id);
  }
}


function dragOver(e) {
  e.preventDefault();
}
function touchStart(e) {
  e.preventDefault(); // Touch davranışını engelle
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
  moveElement = true;
  currentElement = e.target;
}

const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft - (initialX - newX) + "px";
    initialX = newX;
    initialY = newY;
  }
};

const createTimerDisplay = () => {
  if (!timerDisplay) {
    timerDisplay = document.createElement("div");
    timerDisplay.classList.add("timer-display");
    document.body.appendChild(timerDisplay);
  }
};

const createScoreDisplay = () => {
  if (!scoreDisplay) {
    scoreDisplay = document.createElement("div");
    scoreDisplay.classList.add("score-display");
    document.body.appendChild(scoreDisplay);
  }
};

const startTimer = () => {
  if (isGameActive) {
    timer = setInterval(() => {
      timeRemaining--;
      updateScoreDisplay(); 

      if (timeRemaining <= 0) {
        clearInterval(timer); 
        score -= 5;
        updateScoreDisplay();
        resetGame();
      }
    }, 1000);
  }
};

const resetGame = () => {
  count = 0;
  totalFlags += 3;


  updateScoreDisplay();

  setTimeout(() => {
    creator();
    result.innerText = "";
    timeRemaining = 15; 

  }, 1000);
};

const drop = (e) => {
  e.preventDefault();

  if (isTouchDevice()) {
    moveElement = false;
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    const currentDropBound = currentDrop.getBoundingClientRect();

    if (
      initialX >= currentDropBound.left &&
      initialX <= currentDropBound.right &&
      initialY >= currentDropBound.top &&
      initialY <= currentDropBound.bottom
    ) {
      currentDrop.classList.add("dropped");
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src= "${currentElement.id}.png">`
      );
      score += 2; 
      count++; 
    } else {
      score -= 1; 
    }
  } else {
    const draggedElementData = e.dataTransfer.getData("text");
    const droppableElementData = e.target.getAttribute("data-id");
    if (draggedElementData === droppableElementData) {
      const draggedElement = document.getElementById(draggedElementData);
      e.target.classList.add("dropped");
      draggedElement.classList.add("hide");
      draggedElement.setAttribute("draggable", "false");
      e.target.innerHTML = ``;
      e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="${draggedElementData}.png">`
      );
      score += 1; 
      count++; 
      correctSound.play(); 
      checkWin();
    } else {
      score -= 1;
      wrongSound.play();
    }
  }
  updateScoreDisplay();
};

const checkWin = () => {
  if (count === totalFlags) {
    result.innerText = `You Matched ${totalFlags} Flags! Total Score: ${score}`;
    count = 0;
    totalFlags += 3;

    updateScoreDisplay();
    clearInterval(timer); 
    setTimeout(() => {
      creator();
      result.innerText = "";
      timeRemaining = 15; 
      startTimer(); 
    }, 1000);
  }
};

const creator = () => {
  totalFlags = 3;
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomFlags = [];
  let randomCountries = [];

  if (remainingCountries.length === 0) {
    stopGame(); 
    return;
  }
  

  for (let i = 0; i < totalFlags; i++) {
    let randomFlag = randomValueGenerator();
    while (randomFlags.includes(randomFlag)) {
      randomFlag = randomValueGenerator();
    }
    randomFlags.push(randomFlag);
    randomCountries.push(randomFlag);
  }

  randomFlags = randomFlags.sort(() => 0.5 - Math.random());
  randomCountries = randomCountries.sort(() => 0.5 - Math.random());

  for (let i = 0; i < totalFlags; i++) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      flagDiv.style.position = "absolute";
    }
    flagDiv.innerHTML = `<img src="${randomFlags[i]}.png" id="${randomFlags[i]}">`;
    dragContainer.appendChild(flagDiv);

    const countryDiv = document.createElement("div");
    countryDiv.innerHTML = `<div class='countries' data-id='${randomCountries[i]}'>
    ${randomCountries[i].charAt(0).toUpperCase() + randomCountries[i].slice(1).replace("-", " ")}
    </div>`;
    dropContainer.appendChild(countryDiv);
  }

  if (!scoreDisplay) {
    createScoreDisplay();
  }
  updateScoreDisplay();

  draggableObjects = document.querySelectorAll(".draggable-image");
  dropPoints = document.querySelectorAll(".countries");
  
  draggableObjects.forEach((element) => {
    element.addEventListener("dragstart", dragStart);
    element.addEventListener("touchstart", touchStart); // touchstart olayını ekleyin
    element.addEventListener("touchend", drop);
    element.addEventListener("touchmove", touchMove); // touchmove olayını ekleyin
  });

  dropPoints.forEach((element) => {
    element.addEventListener("dragover", dragOver);
    element.addEventListener("drop", drop);
  });

  if (!gameStarted) {
    gameStarted = true;
    isGameActive = true; 
    startTimer();
  }
};

startButton.addEventListener("click", () => {
  controls.classList.add("hide");
  startButton.classList.add("hide");
  rulesContainer.style.display = "none"; 
  if (timer) {
    clearInterval(timer);
  }
  score = 0;
  timeRemaining = 15;
  gameStarted = false;
  isGameActive = true; 
  remainingCountries = [...data];
  createTimerDisplay();
  result.innerText = "";
  creator();
  updateScoreDisplay(); 
});
