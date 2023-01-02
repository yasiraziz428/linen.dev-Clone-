const socket = io("http://localhost:8000");

const form = document.getElementById("send-form");
const messageInput = document.getElementById("message-input");
const messageContainer = document.querySelector(".container");
const roomName = document.getElementById("room-name");
const skillsDiv = document.getElementById("skills");
const skillBtns = document.querySelectorAll(".skill-btn");
const msgDiv = document.getElementById("message-div");
const skillHeading = document.getElementById("skill-heading");
form.style.display = "none";

const userName = prompt("Enter name");

//join chat when user clicks the chat button
skillBtns.forEach((element) => {
  element.addEventListener("click", () => {
    const currRoom = sessionStorage.getItem("room");
    // leave prev room when user joins new chat
    if (currRoom) {
      socket.emit("leaveRoom", currRoom);
      console.log("left room", currRoom);
    }
    msgDiv.innerHTML = " ";
    skillHeading.innerText = element.innerText;
    const room = element.innerText;
    // assigning room value to room in storage
    sessionStorage.setItem("room", room);
    socket.emit("joinRoom", userName, room);
    console.log("user joins room:", room);
    form.style.display = "block";
  });
});

// listening to form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.message_input.value;
  let btnValue = sessionStorage.getItem("room");
  console.log("user sent msg on room:", btnValue);
  // emit message to server
  socket.emit("chatMessage", msg, btnValue);
});

// handling message sent by server
socket.on("message", (sender, msg, date) => {
  appendMessage(sender, msg, date);
});

// display previous msgs to new users
socket.on("initChat", (msgs) => {
  msgs.forEach((element) => {
    // console.log(element);
    appendMessage(element.sender, element.message, element.time);
  });
});

function appendMessage(name, message, date) {
  const messageHTML = `<div class="flex hover:bg-gray-100 w-full py-3 pl-3"><div><img src="/images/user-img.png" class="w-10" /></div><div class="ml-3"><span class="font-semibold">${name}</span><span class="text-sm ml-2">${date}</span><p>${message}</p></div></div>`;
  // const messageHTML = getMessageHTML(name, message);
  const messageElement = document.createElement("div");
  messageElement.innerHTML = messageHTML;
  messageElement.classList.add("message");
  messageContainer.append(messageElement);
}

function appendRoom(name) {
  const newBtn = document.createElement("button");
  newBtn.classList.add(
    "w-full",
    "text-start",
    "pl-5",
    "mx-auto",
    "h-10",
    "text-base",
    "hover:bg-gray-100"
  );
  newBtn.innerHTML = name;
  skillsDiv.append(newBtn);
}
