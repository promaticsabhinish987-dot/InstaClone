import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../services/http-service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-discover',
  imports: [FormsModule,RouterModule],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
  standalone:true
})
export class Discover implements OnInit{
constructor(private http:HttpService,private cdr:ChangeDetectorRef){}
userList:any=[FormsModule]
searchText:string=""

defaultPostImage = 'https://bst.icons8.com/wp-content/uploads/2024/05/deco_male_user_icon.webp';

userFilter:any={
limit:10,
search:""
}

ngOnInit(): void {
  this.getAllUsers()
}

getAllUsers(){
  this.http.getAllUsers(this.searchText).subscribe((data:any)=>{
    console.log(data)
    this.userList=data
      this.cdr.detectChanges();  
  })
}
onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = this.defaultPostImage;
}

searchUser(){
  console.log(this.searchText)
  this.getAllUsers() 
}


toggleFollow(userId:string){
console.log(userId)
  this.http.toggleFollow(userId).subscribe((data:any)=>{
    console.log(data)
    this.getAllUsers()
    this.cdr.detectChanges();
  })
}

}
