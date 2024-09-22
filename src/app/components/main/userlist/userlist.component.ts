import { Component, Output, ViewChild,EventEmitter } from '@angular/core';
import { ApiService } from '../../../services/apiService/api.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss'
})
export class UserlistComponent {

  userId=localStorage.getItem('userId');

  activeUsers: any[] = [];

  selectUser:String | undefined;

  constructor(private api:ApiService){}

  ngOnInit(): void {
   // this.getActiveUserList();
    this.getAllUsers();
  }

  getActiveUserList(){
    this.api.getActiveUsers().subscribe({
      next: (data: any) => {
        this.activeUsers = data;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    })
  }

  getAllUsers(){
    this.api.getAllUser(this.userId).subscribe({
      next: (data: any) => {
        this.activeUsers = data;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    })
  }
 

  @Output() userSelected = new EventEmitter<string>();
  onUserSelect(user:string):void{
    this.selectUser=user;
    console.log("selectd user "+ this.selectUser);
    this.userSelected.emit(user); // Emit the selected user
  }

}
