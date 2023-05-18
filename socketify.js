const socketIO = require("socket.io");
const http = require("http");
let onlineUsers = [];
function implementSocket(app) {
  const server = http.createServer(app);
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("onlineusers", onlineUsers);
    socket.on("join", (data) => {
      let user = onlineUsers.find((u) => u.name === data.name);
      if (!user) {
        data.id = socket.id;
        onlineUsers.push(data);
        socket.broadcast.emit("newuser", data);
      }
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected :");
      let user = onlineUsers.find((u) => u.id === socket.id);
      onlineUsers = [...onlineUsers.filter((u) => u.id !== socket.id)];
      socket.broadcast.emit("leave", user);
    });
  });

  let PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log("server listening on port " + PORT);
  });
}

module.exports = { implementSocket };
