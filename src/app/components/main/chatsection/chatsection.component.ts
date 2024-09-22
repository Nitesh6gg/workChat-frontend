import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/webSocketService/web-socket.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/apiService/api.service';

@Component({
  selector: 'app-chatsection',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatsection.component.html',
  styleUrl: './chatsection.component.scss'
})
export class ChatsectionComponent implements OnInit, OnDestroy {

  private socketUrl: string = `ws://localhost:9900/chat`; // WebSocket server URL

  // Array to store old messages fetched from the backend
  oldMessages: { sender: string, content: string, timestamp: string }[] = [];
  
  // Array to store live chat messages
  public messages: { sender: string, content: string, timestamp: string }[] = [];
  public messageInput: string = '';

  @Input() selectedUser: string | null = null;

  username = localStorage.getItem('username');

  constructor(private webSocketService: WebSocketService, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    if (this.username != null) {
      // Connect to WebSocket and subscribe to incoming messages
      this.webSocketService.connect(this.socketUrl, this.username).subscribe({
        next: (event: MessageEvent) => this.onMessage(event), // Handle incoming messages
        error: (error: any) => console.error('WebSocket error:', error), // Handle WebSocket errors
        complete: () => console.warn('WebSocket closed') // Handle WebSocket closure
      });
    } else {
      this.router.navigate(['/login']); // Redirect to login if user is not logged in
    }

    // Fetch old chat history from the backend API
    this.getChatHistory();
  }

  // Handle incoming WebSocket messages
  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    if (data.type === 'MESSAGE') {
      // Add the WebSocket message to the messages array
      this.messages.push({
        sender: data.sender,
        content: data.content,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) // Capture timestamp
      });
    }
  }

  // Send a message through WebSocket
  sendMessage(): void {
    if (this.messageInput.trim() && this.selectedUser) {
      const messagePayload = {
        type: 'MESSAGE',
        recipient: this.selectedUser, // Dynamic recipient
        content: this.messageInput,
        sender: this.username // Use the actual username
      };
      
      // Send the message via WebSocket
      this.webSocketService.sendMessage(messagePayload);
      
      // Add the sent message to the messages array
      this.messages.push({
        sender: String(this.username),
        content: this.messageInput,
        timestamp: new Date().toLocaleTimeString()
      });

      // Clear input after sending
      this.messageInput = '';
      
      // Play send sound
      this.playSendSound();
    } else {
      console.warn('Cannot send message without a recipient or content');
    }
  }

  // Play a sound after sending a message
  playSendSound(): void {
    const audio = new Audio('src/assets/msgSend.mp3');
    audio.play().catch(error => console.error('Error playing sound:', error));
  }

  // Format time for display
  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Close the WebSocket connection when the component is destroyed
  ngOnDestroy(): void {
    this.webSocketService.close();
  }

  // Fetch old chat history from the backend
  getChatHistory(): void {
    if (this.username && this.selectedUser) {
      this.apiService.getChatHistory(this.username, this.selectedUser).subscribe({
        next: (response: any[]) => {
          // Assuming response is an array of messages
          this.oldMessages = response.map((msg: any) => ({
            sender: msg.senderId,   // Assuming the response has 'sender'
            content: msg.content, // Assuming the response has 'content'
            timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) // Format timestamp
          }));
          
          // Merge old messages with new WebSocket messages
          this.messages = [...this.oldMessages, ...this.messages];
        },
        error: (error: any) => {
          console.error('Error fetching chat history', error);
        }
      });
    }
  }
}
