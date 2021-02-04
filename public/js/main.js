
const chatForm = document.getElementById('chat-form')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
const socket =io();
socket.emit('JoinRoom',{username,room})
const chatMessages =document.querySelector('.chat-messages')
socket.on('message',(message)=>{
    MessageOut(message);

chatMessages.scrollTop=chatMessages.scrollHeight;
})
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputRoomUsers(users);
})
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = e.target.elements.msg.value;
 socket.emit('chatMsg',message);
 e.target.elements.msg.value='';
 e.target.elements.msg.focus()
})

function MessageOut(message){
    const div =document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.user}<span> ${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>
    `
  document.querySelector('.chat-messages').appendChild(div)  
}

function outputRoomName(room){
roomName.textContent=room;

}
 function outputRoomUsers(users){
 userList.innerHTML=`${
     users.map(user=>`<li>${user.username}</li>`).join('')
 }`
}