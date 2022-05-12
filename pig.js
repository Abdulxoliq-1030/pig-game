"use strict";
const diceImg = document.querySelector(".dice");
const resetBtn = document.querySelector(".btn--new");
const rollBtn = document.querySelector(".btn--roll");
const startBtn = document.querySelector(".btn--start");
const holdBtn = document.querySelector(".btn--hold");
const players = document.querySelectorAll(".player");
const scores = document.querySelectorAll(".score");
const currentScores = document.querySelectorAll(".current-score");
const playerInput_0 = document.getElementById("player_0");
const playerInput_1 = document.getElementById("player_1");
const playerNames = document.querySelectorAll(".name");
const gameZone = document.querySelector(".game-zone");
const loginZone = document.querySelector(".login-zone");
const message = document.querySelector(".message");

const MAX_SCORE = 50;
let currentScore = 0;
let _scores = [0, 0];
let currentPlayer = 0;
let isPlaying = false;
let winnerExist = false;
let isValid = false;
let firstPlayerName = "";
let secondPlayerName = "";
let botIndex;
let interval;
let expectedScoreOfBot = 10;

rollBtn.onclick = onRollDice;
holdBtn.onclick = onHold;
resetBtn.onclick = onReset;
startBtn.onclick = onStart;

function onStart() {
  firstPlayerName = playerInput_0.value;
  secondPlayerName = playerInput_1.value;

  if (firstPlayerName.toLowerCase().includes("bot")) botIndex = 0;
  else if (secondPlayerName.toLowerCase().includes("bot")) botIndex = 1;
  if (
    firstPlayerName.toLowerCase().includes("bot") &&
    secondPlayerName.toLowerCase().includes("bot")
  ) {
    message.innerText = "Ikkalasi ham bot bolishi mumkin emas";
    gameZone.classList.add("hidden");
    loginZone.classList.remove("hidden");
  } else {
    gameZone.classList.remove("hidden");
    loginZone.classList.add("hidden");
    playerNames[0].innerText = firstPlayerName;
    playerNames[1].innerText = secondPlayerName;

    if (!botIndex && botIndex !== 0) {
      message.innerText = "Playing without BOT";
    } else {
      message.innerText = "Game starts after 3 seconds...";
      if (botIndex === 0) setTimeout(startBOT, 3000);
      else {
        message.innerText = "Sizdan bosin";
      }
    }
  }
}

function onRollDice() {
  let dice = Math.ceil(Math.random() * 6);
  if (!isPlaying) {
    diceImg.classList.remove("hidden");
    isPlaying = true;
  }

  //random image
  let imgURL = `./images/dice-${dice}.png`;
  diceImg.src = imgURL;

  // add dice value currentScore
  if (dice === 1) {
    message.innerText = "Eyy, men tugatdim";
    nextPlayer();
  } else {
    currentScore += dice;
    currentScores[currentPlayer].innerText = currentScore;
    message.innerText = `Man tashadim, ${dice} tushdi.`;
  }

  if (currentPlayer === botIndex) {
    if (currentScore > expectedScoreOfBot) {
      holdBtn.click();
      clearInterval(interval);
    }
  }
}

function onHold() {
  let isBot = currentPlayer === botIndex;
  _scores[currentPlayer] += currentScore;
  scores[currentPlayer].innerText = _scores[currentPlayer];

  checkWinner();
  if (!winnerExist) {
    if (!isBot) {
      startBOT();
      message.innerText = "Bot tasha";
    } else {
      message.innerText = "Siz tashang";
    }
  }
  nextPlayer();
}

function onReset() {
  currentScores[currentPlayer].innerHTML = 0;
  scores.forEach((score) => (score.innerHTML = 0));
  diceImg.classList.add("hidden");
  rollBtn.disabled = false;
  holdBtn.disabled = false;

  currentScore = 0;
  _scores = [0, 0];

  if (winnerExist) {
    players[currentPlayer].classList.remove("player--winner");
    winnerExist = false;
  }

  if (currentPlayer !== 0) {
    currentPlayer = 0;
    players[0].classList.add("player--active");
    players[1].classList.remove("player--active");
  }
}

function startBOT() {
  interval = setInterval(() => {
    rollBtn.click();
  }, 2000);
}

function checkWinner() {
  if (_scores[currentPlayer] >= MAX_SCORE) {
    players[currentPlayer].classList.add("player--winner");
    rollBtn.disabled = true;
    holdBtn.disabled = true;
    winnerExist = true;
    isPlaying = false;
    message.innerText = `Winner ${
      currentPlayer === 0 ? firstPlayerName : secondPlayerName
    }`;
  }
}

function nextPlayer() {
  currentScore = 0;
  currentScores[currentPlayer].innerHTML = currentScore;
  const isBot = currentPlayer === botIndex;

  if (!winnerExist) {
    players[currentPlayer].classList.remove("player--active");
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    players[currentPlayer].classList.add("player--active");
  }
  clearInterval(interval);
  if (!isBot) {
    startBOT();
  }
}

playerInput_0.addEventListener("keyup", (e) => {
  const firstPlayerName = e.target.value;
  const secondPlayerName = playerInput_1.value;
  if (secondPlayerName !== "" && firstPlayerName !== "")
    startBtn.classList.add("show");
  else startBtn.classList.remove("show");
});

playerInput_1.addEventListener("keyup", (e) => {
  const secondPlayerName = e.target.value;
  const firstPlayerName = playerInput_0.value;
  if (secondPlayerName !== "" && firstPlayerName !== "")
    startBtn.classList.add("show");
  else startBtn.classList.remove("show");
});
