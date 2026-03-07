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
  imagePreview: string | ArrayBuffer | null = null;
constructor(private http:HttpService,private fb:FormBuilder){}
ngOnInit(){
this.postForm=this.fb.group({
content:['',[Validators.required,Validators.maxLength(300)]],
title:['',[Validators.required,Validators.maxLength(100)]],
postImage:[null,Validators.required]
})
}

onFileChange(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate type
  if (!file.type.startsWith('image/')) {
    alert("Only images allowed");
    return;
  }

  // Validate size (2MB example)
  if (file.size > 2 * 1024 * 1024) {
    alert("Max size 2MB");
    return;
  }

  // Patch into reactive form
  this.postForm.patchValue({
    postImage: file
  });

  this.postForm.get('postImage')?.updateValueAndValidity();

  // Generate preview
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result;
  };
  reader.readAsDataURL(file);
}

createPost() {

  if (this.postForm.invalid) {
    this.postForm.markAllAsTouched();
    return;
  }

  const formData = new FormData();

  formData.append('title', this.postForm.get('title')?.value);
  formData.append('content', this.postForm.get('content')?.value);
  formData.append('postImage', this.postForm.get('postImage')?.value);

  this.http.createPost(formData).subscribe((data: any) => {
    console.log(data);

    this.postForm.reset();
    this.imagePreview = null;
  });
}

  get f() {
    return this.postForm.controls;
  }

}
