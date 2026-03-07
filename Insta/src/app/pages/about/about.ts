import { Component ,ChangeDetectorRef} from '@angular/core';
import { HttpService } from '../../services/http-service';
import { TimeAgoPipe } from '../../shared/time-ago-pipe';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  imports: [TimeAgoPipe,ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  defaultPostImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdemRA_yMHey1Dsd-YMTidc9suCmdewkzGCQ&s';
constructor(private http:HttpService,private cdr:ChangeDetectorRef,private fb:FormBuilder){}
about:any=[]
postList:any=[]
  isPopupOpen: boolean=false;
isFollowPopupOpen:boolean=false;
updateForm!:any;
followList:any=[];
imageURL:any

ngOnInit(){
  this.getUserProfile()
  this.getAllPostOfUser()
  this.updateForm=this.fb.group({
  name:[""],
  bio:["",Validators.maxLength(150)],
  avtar:[""]

  })
  this.imageURL=environment.image_URL;

}

getUserProfile(){
  this.http.getUserProfile().subscribe((data:any)=>{

    this.about=data;
    this.cdr.detectChanges()
        console.log(this.about)
  })
}

getFollowersList(){
  
  console.log("getting followers")
  this.http.getFollowersList().subscribe((data:any)=>{

    this.followList=data.data;
        console.log("folowersList",this.followList)
            this.cdr.detectChanges()
  })
}

getFollowingList(){

    this.followList=[]
  this.http.getFollowingList().subscribe((data:any)=>{

    // this.followList=[]
    this.followList=data.data;
        console.log("folowingList",this.followList)
            this.cdr.detectChanges()
  })
}

updateUserProfile(){
  if(this.updateForm.invalid) return
  console.log(this.updateForm.value)
  this.http.updateProfile(this.updateForm.value).subscribe((data:any)=>{
    console.log(data)
    this.updateForm.setValue({
      name:"",
      bio:"",
      avtar:""
    })
    this.getUserProfile()
  })
}

getAllPostOfUser(){
  this.http.getAllPostOfUser().subscribe((data:any)=>{
console.log(data);
this.postList=data.data
    this.cdr.detectChanges()

  });
}

deletePost(postId:string){
  console.log(postId)
  this.http.deletePost(postId).subscribe((data:any)=>{
    console.log(data)
    this.getAllPostOfUser();
  })
}



onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = this.defaultPostImage;
}

 openPopup() {
    // this.postId=postId

    this.isPopupOpen = true;
        // this.fetchCommentOfAPost()
  }

  closePopup() {
    this.isPopupOpen = false;
  }

   openFollowPopupA() {
    // this.postId=postId

    this.isFollowPopupOpen = true;
        // this.fetchCommentOfAPost()
        this.getFollowersList()
  }
    openFollowPopupB() {
    // this.postId=postId

    this.isFollowPopupOpen = true;
        // this.fetchCommentOfAPost()
        this.getFollowingList()
  }

  closeFollowPopup() {
    this.isFollowPopupOpen = false;
  }

}
