// node server which will handle socket io connections

const io = require("socket.io")(8000);
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("New user", name);
    users[socket.id] = name;
    console.log(users);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      name: users[socket.id],
      message: message,
    });
  });
  socket.on("disconnect", (message) => {
    delete users[socket.id];
  });
});
