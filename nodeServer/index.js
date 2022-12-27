// socket server which will handle socket io connections

const io = require("socket.io")(8000);
const users = [];
const messages = [];

io.on("connection", (socket) => {
  socket.on("joinRoom", (userName, room) => {
    // let index = users.indexOf
    // delete users[]
    const user = userJoin(socket.id, userName, room);
    // console.log(user.room);
    socket.join(user.room);
    socket.emit(
      "initChat",
      messages.filter((m) => m.room === user.room)
    );
    console.log(users);
  });
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    removeUser(socket.id, room);
  });
  socket.on("chatMessage", (msg, room) => {
    const user = getCurrentUser(socket.id);
    const currentTime = new Date().toLocaleString();
    io.to(room).emit("message", user.username, msg, currentTime);
    messages.push({
      sender: user.username,
      room: room,
      date: currentTime,
      message: msg,
    });
  });
  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

// user component

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}
//get current user
function getCurrentUser(id) {
  users.reverse();
  console.log(users);
  return users.find((user) => user.id === id);
}

//get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

// remove user

function removeUser(id, room) {
  const index = users.findIndex((user) => user.id == id && user.room == room);
  if (index != -1) {
    users.splice(index, 1);
    console.log(users);
  }
}
