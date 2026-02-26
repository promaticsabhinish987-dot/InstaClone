import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
constructor(private http:HttpService,private fb:FormBuilder){}
postForm!:any;
message:string=""

ngOnInit(): void {
  this.postForm=this.fb.group({
    email:["",Validators.required],
    password:["",[Validators.required,Validators.maxLength(16),Validators.minLength(8)]]
  })
}

user={
  email:"rahulsingh@gmail.com",
  password:"12345678"
}


loginUser(){
  this.message=""
  if(this.postForm.invalid) return 
this.http.loginUser(this.postForm.value).subscribe((data:any)=>{
  console.log(data)
  this.message=data.message
  this.postForm.setValue({
    email:"",
    password:""
  })
})
}

}
