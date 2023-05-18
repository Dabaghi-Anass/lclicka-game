const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { showMain, showGame } = require("./routes.js");
const { implementSocket } = require("./socketify.js");
function write(array) {
  fs.writeFileSync("users.json", JSON.stringify(array));
}

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
async function changeFileLine(
  filePath,
  lineNumber,
  ln2,
  newLineContent,
  nlc2,
  cb
) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      return;
    }
    const lines = data.split("\n");
    if (lineNumber < 0 || lineNumber >= lines.length) {
      console.error("Invalid line number");
      return;
    }
    lines[lineNumber] = newLineContent;
    lines[ln2] = nlc2;
    const modifiedContent = lines.join("\n");
    fs.writeFile(filePath, modifiedContent, "utf8", (err) => {
      if (err) {
        console.error(`Error writing file: ${err.message}`);
        return;
      }
      cb();
    });
  });
}

function read() {
  let users = require("./users.json");
  return users;
}
app.get("/", (req, res) => showMain(req, res));
app.get("/game", (req, res) => showGame(req, res));
app.get("/:user", (req, res) => {
  try {
    let users = read();
    let user = users.find((us) => us.name === req.params.user);
    if (user) res.send(user.programms);
    else {
      users.push({
        name: req.params.user,
        programms: ["no programme registred"],
      });
      write(users);
      res.status(404).send([]);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/getfile/:user", async (req, res) => {
  await changeFileLine(
    "./runme.js",
    0,
    1,
    `let name = '${req.params.user}'`,
    `let port = ${process.env.PORT || 10000}`,
    () => {
      const zipPath = path.join(__dirname, "files.zip");
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip");

      output.on("close", () => {
        console.log("Archive created:", archive.pointer(), "total bytes");

        res.sendFile(zipPath, () => {
          console.log("Sent files to:", req.params.user);

          // Cleanup: Delete the temporary ZIP file
          fs.unlinkSync(zipPath);
        });
      });

      archive.on("error", (err) => {
        throw err;
      });

      archive.pipe(output);
      archive.file(path.join(__dirname, "runme.js"), { name: "runme.js" });
      archive.file(path.join(__dirname, "runme.bat"), { name: "runme.bat" });
      archive.finalize();
    }
  );
});

app.post("/:user", (req, res) => {
  let { params, body } = req;
  let users = read();
  let user = users.find((us) => us.name === params.user);
  if (user) {
    user.programms = [...body.data];
    write(users);
    return;
  }
  let newuser = {
    name: params.user,
    programms: [...body.data],
  };
  users.push(newuser);
  write(users);
  console.log("added new user");
});

implementSocket(app);
