let RADIUS = window.innerHeight / 3;
const socket = io();
let players = [];
let container = document.querySelector(".players");
let playersCount = Array.from(players).length;
let user = JSON.parse(localStorage.getItem("user"));
let onlineUsers = [];
if (!user) {
  let name = prompt("dkhl smytk");
  let girl = prompt("bnt ? : y : yes,n : no");
  let gender = "male";
  if (girl === "y") gender = "female";
  user = { name, gender };
  localStorage.setItem("user", JSON.stringify(user));
}
socket.emit("join", user);
onlineUsers.push(user);
pushUser(user);
adjustPlayersLocations();
function adjustPlayersLocations() {
  players = document.querySelectorAll(".player");
  playersCount = Array.from(players).length;
  for (let index = 0; index < playersCount; index++) {
    let player = players[index];
    if (!player) continue;
    let angle = (360 / playersCount) * index;
    angle = (angle * Math.PI) / 180;
    let x = Math.cos(angle) * RADIUS;
    let y = Math.sin(angle) * RADIUS;
    y += (innerHeight - RADIUS / 2) / 2;
    x += (innerWidth - RADIUS / 3) / 2;
    player.style.top = `${y}px`;
    player.style.left = `${x}px`;
  }
}
function clearSelection(players, n = 1) {
  players[n - 1]?.classList?.remove("highlighted");
  for (let player of players) {
    player.classList.remove("choosen");
  }
}
function startGame() {
  players = document.querySelectorAll(".player");
  playersCount = players.length;
  clearSelection(Array.from(players));
  let r = Math.round(Math.random() * playersCount);
  while (!players[r]) r = Math.round(Math.random() * playersCount);
  console.log(r);
  let chosenPlayer = players[r];
  let k = 0;
  let interval = setInterval(() => {
    if (k === 0) {
      players[0]?.classList?.add("highlighted");
    } else {
      players[k - 1].classList.remove("highlighted");
      players[k]?.classList?.add("highlighted");
    }
    k++;
    if (k > playersCount) {
      k = 0;
    }
  }, 100);
  setTimeout(() => {
    clearInterval(interval);
    clearSelection(Array.from(players), k);
    chosenPlayer.classList.add("choosen");
  }, 3000);
}

function pushUser(user) {
  let pdiv = document.createElement("div");
  let spn = document.createElement("span");
  let pimg = document.createElement("img");
  let el = document.getElementById(`${user.name}`);
  if (el) return;
  pdiv.classList.add("player");
  pdiv.id = `${user.name}`;
  pimg.src = `assets/${user.gender === "female" ? "female" : "male"}.png`;
  spn.textContent = user.name;
  pdiv.appendChild(pimg);
  pdiv.appendChild(spn);
  container.appendChild(pdiv);
}

socket.on("newuser", (data) => {
  let user = onlineUsers.find((u) => u.name === data.name);
  if (!user) {
    onlineUsers.push(data);
    pushUser(data);
    adjustPlayersLocations();
  }
});
socket.on("leave", (user) => {
  if (!user) return;
  onlineUsers = [...onlineUsers.filter((u) => u.name !== user?.name)];
  let usernode = document.getElementById(`${user.name}`);
  usernode?.remove();
  adjustPlayersLocations();
});
function unique(arr) {
  const uniqueNames = {};
  return arr.filter((user) => {
    if (!uniqueNames[user.name]) {
      uniqueNames[user.name] = true;
      return true;
    }
    return false;
  });
}

socket.on("onlineusers", (data) => {
  onlineUsers = [...unique(data)];
  for (let user of onlineUsers) pushUser(user);
  adjustPlayersLocations();
});
const goBtn = document.getElementById("gobtn");
goBtn.addEventListener("click", () => {
  startGame();
});
