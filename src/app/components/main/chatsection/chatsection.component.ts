import { Component, Input, Output } from '@angular/core';
import { WebSocketService } from '../../../services/webSocketService/web-socket.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatsection',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chatsection.component.html',
  styleUrl: './chatsection.component.scss'
})
export class ChatsectionComponent {

  private socketUrl: string = `ws://localhost:9900/chat`; // Your WebSocket server URL
  
  public messages: { sender: string, content: string, timestamp: string }[] = [];
  public messageInput: string = '';

  @Input() selectedUser: string | null = null;

  constructor(private webSocketService:WebSocketService,private router:Router){}

  username=localStorage.getItem('username');
  
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
  }

  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    if (data.type === 'MESSAGE') {
      // Add the message to the list
      this.messages.push({
        sender: data.sender,
        content: data.content,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) // Capture timestamp of the message
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
      this.webSocketService.sendMessage(messagePayload);
     // Add the sent message to the local messages array
    this.messages.push({sender: String(this.username),content: this.messageInput,timestamp: new Date().toLocaleTimeString()});
      this.messageInput = ''; // Clear input after sending
      this.playSendSound();
    } else {
      console.warn('Cannot send message without a recipient or content');
    }
  }

  
playSendSound(): void {
  const audio = new Audio('src/assets/msgSend.mp3'); 
  audio.play().catch(error => console.error('Error playing sound:', error));
}

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Handle WebSocket closure when the component is destroyed
  ngOnDestroy(): void {
    this.webSocketService.close();
  }

}
