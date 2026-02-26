import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class MessageService {

  private socket!: Socket;

  connect() {
    console.log("request socket connection")
    this.socket = io('http://localhost:4000', {
      withCredentials: true
    });
  }

  sendMessage(receiverId: string, text: string) {
    console.log("sending message")
    this.socket.emit('sendMessage', { receiverId, text });
  }

  // onReceiveMessage(): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.on('receiveMessage', (msg) => observer.next(msg));
  //   });
  // }

  onReceiveMessage(): Observable<any> {
  return new Observable(observer => {

    const handler = (msg: any) => observer.next(msg);

    this.socket.on('receiveMessage', handler);

    return () => {
      this.socket.off('receiveMessage', handler);
    };

  });
}

  

  onError(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('errorMessage', (err) => observer.next(err));
    });
  }

  typing(receiverId: string) {
    this.socket.emit('typing', { receiverId });
  }

  onTyping(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('typing', (data) => observer.next(data));
    });
  }
}
