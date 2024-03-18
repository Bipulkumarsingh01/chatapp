import { autoinject } from 'aurelia-framework';
import * as io from 'socket.io-client';

@autoinject
export class Chat {
  private socket: gitSocketIOClient.Socket;
  private userName: string;
  private roomID: string;

  constructor() {
    this.socket = io(); // Connect to Socket.io server
  }

  // Function to join the chat room
  public joinChat(): void {
    this.userName = (document.getElementById('nameInput') as HTMLInputElement).value.trim();
    this.roomID = (document.getElementById('roomInput') as HTMLInputElement).value.trim();

    if (this.userName && this.roomID) {
      document.getElementById('joinForm').style.display = 'none';
      document.getElementById('chatContainer').style.display = 'block';

      // Emit 'join' event to server
      this.socket.emit('join', { userName: this.userName, roomID: this.roomID });

      // Update UI with username and roomID
      document.getElementById('usernameDisplay').innerText = `UserName: ${this.userName}`;
      document.getElementById('roomIDDisplay').innerText = `Room ID: ${this.roomID}`;

      // Listen for 'userList' event from server
      this.socket.on('userList', (users: any[]) => {
        this.updateUserList(users);
      });

      // Listen for incoming chat messages
      this.socket.on('chat-message', (data: any) => {
        const { sender, message } = data;
        console.log('Received message:', data);
        this.displayMessage(`${sender}: ${message}`);
      });
    }
  }

  // Event listener for form submission
  public formSubmit(e: Event): void {
    e.preventDefault();

    const message = (document.getElementById('input') as HTMLInputElement).value.trim();
    if (message) {
      // Emit 'chat message' event to server with sender and receiver information
      this.socket.emit('chat-message', { sender: this.userName, receiver: this.roomID, message });
      (document.getElementById('input') as HTMLInputElement).value = '';
    }
  }

  // Function to leave the room
  public leaveRoom(): void {
    // Reload the page
    window.location.reload();
  }

  private updateUserList(users: any[]): void {
    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = ''; // Clear previous user list

    users.forEach(user => {
      const userItem = document.createElement('div');
      userItem.classList.add('user-item');
      userItem.classList.add(user.status === 'online' ? 'online' : 'offline');

      const userStatus = document.createElement('span');
      userStatus.classList.add('user-status');
      userStatus.style.backgroundColor = user.status === 'online' ? 'green' : 'red';

      const username = document.createElement('span');
      username.classList.add('username');
      username.textContent = user.name; // Use 'name' instead of 'userName'

      userItem.appendChild(userStatus);
      userItem.appendChild(username);

      userListElement.appendChild(userItem);
    });
  }

  private displayMessage(msg: string): void {
    console.log('Received message:', msg);

    const item = document.createElement('li');
    item.textContent = msg;

    const messageList = document.getElementById('messages');
    if (messageList) {
      messageList.appendChild(item);
    } else {
      console.error('Message list not found');
    }
  }
}
