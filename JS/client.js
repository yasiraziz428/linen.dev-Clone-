const socket = io("http://localhost:8000");

const form = document.getElementById("send-form");
const messageInput = document.getElementById("message-input");
const messageContainer = document.querySelector(".container");

function append(name, message) {
  const messageHTML = `<div class="flex hover:bg-gray-100 w-full py-3 pl-3"><div><img src="/images/user-img.png" class="w-10" /></div><div class="ml-3"><span class="font-semibold">${name}</span><p>${message}</p></div></div>`;
  const messageElement = document.createElement("div");
  messageElement.innerHTML = messageHTML;
  messageElement.classList.add("message");
  messageContainer.append(messageElement);
}

const userName = prompt("Enter your name to join chat");

socket.emit("new-user-joined", userName);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append("me", message);
  socket.emit("send", message);
  messageInput.value = "";
});

socket.on("receive", (data) => {
  append(data.name, data.message);
});
