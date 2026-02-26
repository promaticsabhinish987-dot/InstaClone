import { Component } from '@angular/core';
import { HttpService } from '../../services/http-service';
import { TimeAgoPipe } from '../../shared/time-ago-pipe';
import { OnInit,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [TimeAgoPipe,CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit{
  postList:any=[];
  isLoading: boolean = true;
  isPopupOpen: boolean=false;
  postId:string=""
  comments:any=[]
  postForm!: any; // definite assignment
constructor(private http:HttpService, private fb:FormBuilder,private cdr:ChangeDetectorRef){}


ngOnInit() {
  this.postForm = this.fb.group({
    postId: ['', Validators.required],
    content: ['', Validators.required]
  });

  this.getAllPost();
}




getAllPost(){
  this.isLoading=true;
  this.http.getAllPost().subscribe((data:any)=>{
    console.log(data.data)
    this.postList=data.data;
    this.isLoading=false;
    this.cdr.detectChanges()
  });
  
}


fetchCommentOfAPost(){
  //  this.comments=[]
  this.http.getAllCommentOfAPost(this.postId).subscribe((data:any)=>{
   this.comments=data
   console.log(data)
       this.cdr.detectChanges()
  })
}

// popup logic

  openPopup(postId:string) {
    this.postId=postId

    this.isPopupOpen = true;
        this.fetchCommentOfAPost()
  }

  closePopup() {
    this.isPopupOpen = false;
  }


  createCommment(){
    this.postForm.patchValue({
  postId:this.postId
});
    if (this.postForm.invalid) return;
    console.log(this.postForm.value);
    this.http.createCommment(this.postForm.value).subscribe((data=>{
      console.log(data)
      this.getAllPost()
      this.fetchCommentOfAPost()
      this.postForm.setValue({
        postId:"",
        content:""
      })
    }))
  }


  deleteComment(commentId:string){
    this.http.deleteComment(commentId).subscribe((data:any)=>{
      console.log(data)
      this.getAllPost()
      this.fetchCommentOfAPost()
    })
  }


  toggleLike(postId:string){
    this.http.toggleLike(postId).subscribe((data:any)=>{
      console.log(data)
      this.cdr.detectChanges();

this.getAllPost()
    })
  }



}
