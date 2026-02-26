
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ParseSourceFile } from '@angular/compiler';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone:true
})
export class Register implements OnInit{
constructor(private userService:HttpService,private fb:FormBuilder){}
postForm!:any;
user={
  name:"Rahul Singh",
  email:"rahulsingh@gmail.com",
  password:"12345678"
}

ngOnInit(): void {
  
this.postForm=this.fb.group({
name:["",Validators.required],
email:["",Validators.required],
password:["",[Validators.required,Validators.minLength(8),Validators.maxLength(16)]]
})
}


registerUser(){
  if(this.postForm.invalid) return
this.userService.registerUser(this.postForm.value).subscribe((data:any)=>{
console.log(data)
this.postForm.setValue({
  name:"",
  email:"",
  password:""
})
},()=>{
  this.postForm.setValue({
  name:"",
  email:"",
  password:""
})
})
}

}
