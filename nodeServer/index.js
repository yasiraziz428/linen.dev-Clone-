// socket server which will handle socket io connections

const { json } = require("express");

const io = require("socket.io")(8000);
const users = [];

io.on("connection", (socket) => {
  socket.on("joinRoom", async (userName, room) => {
    const user = userJoin(socket.id, userName, room);

    const messages = await getMessagesOfRoom(room);

    socket.join(user.room);
    socket.emit("initChat", messages);
  });
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    removeUser(socket.id, room);
  });

  //receiving message from client
  socket.on("chatMessage", (msg, room) => {
    const user = getCurrentUser(socket.id);
    const currentTime = new Date().toLocaleString();
    io.to(room).emit("message", user.username, msg, currentTime);
    postMessage({
      sender: user.username,
      room: room,
      time: currentTime,
      message: msg,
    }).then((data) => {
      console.log(data);
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

async function postMessage(data = {}) {
  // Default options are marked with *
  const response = await fetch("http://localhost:8080/api/messages", {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}

async function getMessagesOfRoom(room) {
  const messages_response = await fetch(
    `http://localhost:8080/api/messages/${room}`
  );
  const json_result = await messages_response.json();
  console.log("API Data", json_result);
  return json_result;
}
