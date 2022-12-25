// import getMessageHTML from "./components/message.js";
const socket = io("http://localhost:8000");

const form = document.getElementById("send-form");
const messageInput = document.getElementById("message-input");
const messageContainer = document.querySelector(".container");
const roomName = document.getElementById("room-name");

const userName = prompt("Enter name");
const room = prompt("Enter room");

socket.emit("joinRoom", userName, room);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.message_input.value;

  // Emit message to server
  socket.emit("chatMessage", msg);
});
socket.on("message", (msg) => {
  append("user", msg);
});

socket.on("roomName", (room) => {
  outputRoomName(room);
});

//Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function append(name, message) {
  const messageHTML = `<div class="flex hover:bg-gray-100 w-full py-3 pl-3"><div><img src="/images/user-img.png" class="w-10" /></div><div class="ml-3"><span class="font-semibold">${name}</span><p>${message}</p></div></div>`;
  // const messageHTML = getMessageHTML(name, message);
  const messageElement = document.createElement("div");
  messageElement.innerHTML = messageHTML;
  messageElement.classList.add("message");
  messageContainer.append(messageElement);
}
