import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  [x: string]: any;
  private socket!: WebSocket;
  private subject: Subject<MessageEvent> | undefined;

  constructor() {}

  //Connect to WebSocket server
  public connect(url: string, username: string): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url, username);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  // Connect to the WebSocket server
  // public connect(url: string, username: string): Observable<MessageEvent> {
  //   this.socket = new WebSocket(url);

  //   return new Observable(observer => {
  //     this.socket.onopen = () => {
  //       console.log('WebSocket connection opened');
  //     };

  //     // Listen for incoming messages
  //     this.socket.onmessage = (event) => {
  //       observer.next(event);
  //     };

  //     this.socket.onerror = (error) => {
  //       observer.error(error);
  //     };

  //     this.socket.onclose = () => {
  //       observer.complete();
  //     };
  //   });
  // }

  // Create a new WebSocket connection and send the login message
  private create(url: string, username: string): Subject<MessageEvent> {
    this.socket = new WebSocket(url);

    const observable = new Observable(observer => {
      this.socket.onmessage = (event) => observer.next(event);
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = (event) => observer.complete();

      // When WebSocket connection opens, send login message
      this.socket.onopen = () => {
        console.log('WebSocket connection opened.');
        // Send a message to register the username
        this.sendMessage({ type: 'LOGIN', username: username });
      };

      return () => this.socket.close();
    });

    const observer = {
      next: (data: Object) => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }


  // Send a message through the WebSocket
  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket connection is not open');
    }
  }


  // Close WebSocket connection
  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
