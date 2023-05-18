const path = require("path");
const fs = require("fs");
function showMain(req, res) {
  let indexfile = path.join(__dirname, "index.html");
  res.sendFile(indexfile);
}
function showGame(req, res) {
  let indexfile = path.join(__dirname, "game.html");
  res.sendFile(indexfile);
}
module.exports = { showMain, showGame };
