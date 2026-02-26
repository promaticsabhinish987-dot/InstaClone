import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MessageService } from './../../services/message-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http-service';
import { TimeAgoPipe } from '../../shared/time-ago-pipe';

@Component({
  selector: 'app-message',
  templateUrl: './message.html',
  styleUrls: ['./message.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,TimeAgoPipe]
})
export class Message implements OnInit {

  // 🔹 Active messages only (UI rendering)
  messages: any[] = [];

  // 🔹 All conversations grouped by userId
  conversations: { [key: string]: any[] } = {};

  newMessage: string = '';
  chatUserId: string = '';
  currentUserId: string = '';

  defaultPostImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdemRA_yMHey1Dsd-YMTidc9suCmdewkzGCQ&s';

  typingUser: string = '';

  followingList: any[] = [];
  selectedUser: any = null;
  currentUserProfile: any = null;

  constructor(
    private http: HttpService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.getUserProfile();

    this.getFollowingList();
    this.getFollowersList();

    this.messageService.connect();

    // 🔹 Categorize incoming messages
    this.messageService.onReceiveMessage().subscribe((msg: any) => {

      const otherUser =
        msg.sender === this.currentUserId
          ? msg.receiver
          : msg.sender;

      if (!this.conversations[otherUser]) {
        this.conversations[otherUser] = [];
      }

      this.conversations[otherUser].push(msg);

      // Update UI only if that chat is open
      if (this.chatUserId === otherUser) {
        this.messages = this.conversations[otherUser];
      }

      this.cdr.detectChanges();
    });

    this.messageService.onTyping().subscribe((data: any) => {

      if (data.from === this.chatUserId) {
        this.typingUser = data.from;

        setTimeout(() => {
          this.typingUser = '';
          this.cdr.detectChanges();
        }, 1000);
      }

      this.cdr.detectChanges();
    });

    this.messageService.onError().subscribe((err: any) => {
      alert(err);
    });
  }

  // 🔹 Send message
  send() {
    console.log(this.messages)
    if (!this.newMessage.trim() || !this.chatUserId) return;

    this.messageService.sendMessage(this.chatUserId, this.newMessage);

    this.newMessage = '';
    this.cdr.detectChanges();
  }

  onTyping() {
    if (!this.chatUserId) return;
    this.messageService.typing(this.chatUserId);
  }

  // 🔹 Select user
  selectUser(user: any) {

    this.selectedUser = user;
    this.chatUserId = user._id;

    this.getAllMessagesWithUser(user._id)
    // Load conversation
    this.messages = this.conversations[this.chatUserId] || [];

    this.cdr.detectChanges();
  }

  // 🔹 Following list
  getFollowingList() {
    this.http.getFollowingList().subscribe((data: any) => {
      this.followingList = data.data;
      this.cdr.detectChanges();
    });
  }

  // 🔹 Merge followers uniquely
  getFollowersList() {
    this.http.getFollowersList().subscribe((data: any) => {

      const combined = [...this.followingList, ...data.data];

      this.followingList = [
        ...new Map(combined.map(user => [user._id, user])).values()
      ];

      this.cdr.detectChanges();
    });
  }

  // 🔹 Current user profile
  getUserProfile() {
    this.http.getUserProfile().subscribe((data: any) => {
      this.currentUserProfile = data?.data;
      this.currentUserId = data?.data?._id;

      this.cdr.detectChanges();
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.defaultPostImage;
  }
  trackByMessage(index: number, msg: any) {
  return msg._id || index;
}

getAllMessagesWithUser(receiverId:string){
  this.http.getAllMessagesWithUser(receiverId).subscribe((data:any)=>{
    console.log(data)
    this.messages=data.data.reverse()
    this.cdr.detectChanges();
  })
}
}