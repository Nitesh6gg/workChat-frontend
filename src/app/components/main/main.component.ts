import { Component } from '@angular/core';
import { ChatsectionComponent } from "./chatsection/chatsection.component";
import { UserlistComponent } from "./userlist/userlist.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ChatsectionComponent, UserlistComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  selectedUser: string | null = null;

  onUserSelected(user: string) {
    this.selectedUser = user;
  }
  
}
