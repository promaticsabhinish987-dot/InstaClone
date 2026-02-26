import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../services/http-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
  standalone:true
})
export class CreatePost implements OnInit{
  postForm!:any
constructor(private http:HttpService,private fb:FormBuilder){}
ngOnInit(){
this.postForm=this.fb.group({
content:['',[Validators.required,Validators.maxLength(300)]],
title:['',[Validators.required,Validators.maxLength(100)]],
postImage:['',Validators.required]
})
}

createPost(){
  if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }
    this.http.createPost(this.postForm.value).subscribe((data:any)=>{
      console.log(data)
      this.postForm.setValue({
        title:"",
        content:"",
        postImage:""
      })
    })
}

  get f() {
    return this.postForm.controls;
  }

}
