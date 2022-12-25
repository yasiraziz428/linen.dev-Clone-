// node server which will handle socket io connections

const express = require("express");
const io = require("socket.io")(8000);
const users = [];

const app = express();

io.on("connection", (socket) => {
  socket.on("joinRoom", (userName, room) => {
    const user = userJoin(socket.id, userName, room);
    socket.join(user.room);
    socket.emit("roomName", user.room);
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", msg);
    });
  });
  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

app.listen(3000);

// user component

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}
//get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

// socket.broadcast.to(user.room)

// listen for a message to join specific room
// socket.on("join-room", (room) => {
//   socket.join(room);
// });

// socket.on("new-user-joined", (name) => {
//   // console.log("New user", name);
//   users[socket.id] = name;
//   // console.log(users);
// });
// socket.on("send", (message) => {
//   socket.broadcast.emit("receive", {
//     name: users[socket.id],
//     message: message,
//   });
// });
// socket.on("disconnect", () => {
//   delete users[socket.id];
// });
