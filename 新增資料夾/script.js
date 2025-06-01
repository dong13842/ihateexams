const firebaseConfig = {
  apiKey: "AIzaSyCVT1P4DNBijjOhMxybcjLZKA1hrPabhqo",
  authDomain: "langmatchgame.firebaseapp.com",
  databaseURL: "https://langmatchgame-default-rtdb.firebaseio.com",
  projectId: "langmatchgame",
  storageBucket: "langmatchgame.appspot.com",
  messagingSenderId: "1010399995616",
  appId: "1:1010399995616:web:a5077c22393756bb225285",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const startBtn = document.getElementById("start-btn");
const bombBtn = document.getElementById("bomb-btn");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");
const playerNameInput = document.getElementById("player-name");

let startTime, playerName, bombs = 0, plays = 0;

const gameSection = document.querySelector(".game");
const inputSection = document.querySelector(".input-name");

startBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("請輸入名字！");
    return;
  }

  bombs = 0;
  plays = 0;
  inputSection.style.display = "none";
  gameSection.style.display = "block";
  startTime = new Date().getTime();
};

bombBtn.onclick = () => {
  const now = new Date().getTime();
  const reactionTime = now - startTime;
  document.getElementById("reaction-time").textContent = `反應速度：${reactionTime} ms`;
  bombs++;
  plays++;

  const messages = [
    "Bye考卷！太爽了！",
    "再來一發！",
    "今天沒壓力啦～",
    "炸掉煩惱，迎接新生",
    "壓力掰掰 👋",
    "你超棒的，Keep going!",
    "就算考試難，也不能炸掉自信！"
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];
  document.getElementById("random-message").textContent = message;

  triggerExplosion();
  saveScore(playerName, bombs);
  loadLeaderboard();

  startTime = new Date().getTime();
};

restartBtn.onclick = () => {
  bombs = 0;
  plays++;
  document.getElementById("reaction-time").textContent = "";
  document.getElementById("random-message").textContent = "";
};

backBtn.onclick = () => {
  bombs = 0;
  plays = 0;
  playerNameInput.value = "";
  inputSection.style.display = "block";
  gameSection.style.display = "none";
  document.getElementById("reaction-time").textContent = "";
  document.getElementById("random-message").textContent = "";
};

function triggerExplosion() {
  const explosionArea = document.getElementById("explosion-area");
  const boom = document.createElement("div");
  boom.textContent = "💥";
  boom.className = "explosion";
  explosionArea.appendChild(boom);
  setTimeout(() => explosionArea.removeChild(boom), 500);
}

function saveScore(name, bombs) {
  database.ref('scores/' + name).set({
    name: name,
    bombs: bombs,
    time: Date.now()
  });
}

function loadLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  database.ref("scores").orderByChild("bombs").limitToLast(5).once("value", (snapshot) => {
    const scores = [];
    snapshot.forEach((child) => {
      scores.push(child.val());
    });
    scores.reverse().forEach(score => {
      const li = document.createElement("li");
      li.textContent = `${score.name}: ${score.bombs} 張考卷`;
      list.appendChild(li);
    });
  });
}

loadLeaderboard();
