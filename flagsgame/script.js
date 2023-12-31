let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const rulesContainer = document.querySelector(".rules-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
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
let timeRemaining = 10;
let timerDisplay;
let correctSound = new Audio("true.mp3");
let wrongSound = new Audio("wrong.mp3");
let gameStarted = false;

const createScoreDisplay = () => {
  scoreDisplay = document.createElement("div");
  scoreDisplay.classList.add("score-display");
  document.body.appendChild(scoreDisplay);

  createTimerDisplay();
};

const updateScoreDisplay = () => {
  if (scoreDisplay && timerDisplay) {
    scoreDisplay.innerText = `Score: ${score}`;
    if (gameStarted) {
      timerDisplay.innerText = `Time: ${timeRemaining}s`;
    }
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
};
function dragStart(e) {
  if (isTouchDevice()) {
    e.preventDefault();  
    e.target.ontouchmove = touchMove;
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    
    moveElement = true;
    currentElement = e.target;
  } else if (e.dataTransfer) {
    e.dataTransfer.setData("text", e.target.id);
  }
}

function dragOver(e) {
e.preventDefault();
}

const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);

    currentSelectedElement.style.position ='relative';
    currentSelectedElement.style.left = newX - initialX + 'px';
    currentSelectedElement.style.top = newY - initialY + 'px';

    initialX = newX;
    initialY = newY;
  }
};



const createTimerDisplay = () => {
  timerDisplay = document.createElement("div");
  timerDisplay.classList.add("timer-display");
  document.body.appendChild(timerDisplay);
};

const startTimer = () => {
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
};
const resetGame = () => {
count = 0;
totalFlags += 3;

updateScoreDisplay();

setTimeout(() => {
creator();
result.innerText = "";
timeRemaining = 10; 
startTimer(); 
}, 1000);
};

const drop = (e) => {
  e.preventDefault();

  if (isTouchDevice()) {
    moveElement = false;

    const currentDrop = document.querySelector(`div[data-id='${currentElement.id}']`);
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
      score += 1;
      count++;
      correctSound.play();
      checkWin();

    } else {
      score -= 1;
      wrongSound.play();

    }
  } else {
    if (e.dataTransfer) {
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
      timeRemaining = 10;
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
      flagDiv.style.position = "relative";
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
    if (!timerDisplay) {
      createTimerDisplay();
    } else {
      updateScoreDisplay();
    }
  }

  draggableObjects = document.querySelectorAll(".draggable-image");
  dropPoints = document.querySelectorAll(".countries");

  draggableObjects.forEach((element) => {
    element.addEventListener("dragstart", dragStart);
    element.addEventListener("touchstart", dragStart);
    element.addEventListener("touchend", drop);
    element.addEventListener("touchmove", touchMove);
  });

  dropPoints.forEach((element) => {
    element.addEventListener("dragover", dragOver);
    element.addEventListener("drop", drop);
  });

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }
};

startButton.addEventListener("click", () => {

  rulesContainer.classList.add("hide");
  controls.classList.add("hide");
  startButton.classList.add("hide");

  if (timer) {
    clearInterval(timer);
  }

  score = 0;
  timeRemaining = 10;
  gameStarted = false;
  remainingCountries = [...data];
  if (scoreDisplay) scoreDisplay.remove();
  if (timerDisplay) timerDisplay.remove();
  result.innerText = "";

  createScoreDisplay(); 
  creator();
  updateScoreDisplay(); 

  gameStarted = true;
});