const socket = io("http://localhost:8000");

//Getting the html elements in the js form
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// audio which will play on incoming messages
var audio = new Audio("ting.mp3");

// function which will append the info into the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

//Asking user his/her name
const name = prompt("Enter Your name to join");
socket.emit("new-user-joined", name);

// letting others users know who joined
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

//receiving the message
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// message displays when somebody leaves the chat
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});

// when submit is clicked this shows the message you have send on the right side of the screen
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
