
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//Get Username and Room from Query String
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

//Join Chat room
socket.emit('joinRoom',{ username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
});

//Get message from server and output
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

//Scroll down anytime a message is received
  chatMessages.scrollTop = chatMessages.scrollHeight;

});

//User submits message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  //Get message text
  const msg = e.target.elements.msg.value;
  
  //Emit message to server
  socket.emit('chatMessage', msg);
  
  //Clear message input box
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = 
    `<p class="meta"> ${message.username} <span>${message.time}</span> </p>
		<p class="text"> ${message.text} </p>`;
	document.querySelector('.chat-messages').appendChild(div);
}

//Add roomname to dom
function outputRoomName(room) {
  roomName.innerText = room;
}
