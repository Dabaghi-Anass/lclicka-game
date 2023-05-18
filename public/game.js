let container = document.querySelector(".files");
let section = document.querySelector(".player");
let files = [];
const socket = io();
let user = JSON.parse(localStorage.getItem("user"));
async function getUserFile(name) {
  let btn = document.createElement("a");
  btn.classList.add("btn");
  btn.textContent = "download script";
  btn.download = "data-collecter";
  btn.href = `/getfile/${name}`;
  document.body.appendChild(btn);
}
if (!user) {
  let name = prompt("enter your name");
  let gender = prompt("are you female? y :true , n : false");
  let g;
  if (gender === "y") g = "female";
  user = {
    name,
    gender: g,
  };
  localStorage.setItem(
    "user",
    JSON.stringify({
      name,
      gender: g,
    })
  );
}
if (!user.hasFile) {
  getUserFile(user.name);
  user.hasFile = true;
  localStorage.setItem("user", JSON.stringify(user));
}
section.innerHTML = `
        <img src="assets/${user.gender === "female" ? "female" : "male"}.png">
        <span>${user.name}</span>
`;
let programms = [];
async function getData() {
  try {
    const response = await fetch(`/${user.name}`);
    if (response.ok) {
      const data = await response.json();
      programms = [...data];
    } else {
      console.error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

getData().then(() => {
  container.innerHTML = programms
    .filter((p) => !p.startsWith("C:"))
    .map((p) => `<div class="file">${p}</div>`)
    .join("");
  files = document.querySelectorAll(".file");
});
function clearSelection() {
  files.forEach((f) => f.classList.remove("selected"));
}
function startGame() {
  clearSelection();
  let r = Math.floor(Math.random() * files.length);
  if (!files[r]) r = Math.floor(Math.random() * (files.length - 1));
  files[r].classList.add("selected");
}
let sbtn = document.getElementById("start");
sbtn.addEventListener("click", startGame);
socket.emit("join", user);
