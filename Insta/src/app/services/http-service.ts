import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, windowToggle } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl="http://localhost:4000";
  constructor(private http:HttpClient){}

 registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, user);
  }

  loginUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, user,   { withCredentials: true });
  }
getUserProfile(): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/user/profile`,
    { withCredentials: true }
  );
}

getAllPost():Observable<any>{
  return this.http.get(`${this.apiUrl}/post/postList`,{withCredentials:true})
}

//get all post of a user 

getAllPostOfUser():Observable<any>{
  return this.http.get(`${this.apiUrl}/user/postList`,{withCredentials:true})
}

deletePost(postId:string){
  return this.http.delete(`${this.apiUrl}/post/delete`,
    {
      params:{postId},
      withCredentials:true
    }
  )
}


getAllCommentOfAPost(postId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/comment/getComments`, {
    params: { postId },
    withCredentials: true
  });
}

createCommment(obj:any){
return this.http.post(`${this.apiUrl}/post/comment/create`,obj,{withCredentials:true})
}

deleteComment(commentId:string){
  return this.http.delete(`${this.apiUrl}/post/comment/delete`,
    {
      params:{commentId},
      withCredentials:true})
}

createPost(obj:any){
  return this.http.post(`${this.apiUrl}/post/create`,obj,{withCredentials:true})
}

logout(){
  return this.http.get(`${this.apiUrl}/user/logout`,{withCredentials:true})
}

getAllUsers(query?:string){
  let params: any = {};

  if (query && query.trim() !== '') {
    params.q = query;
  }

  return this.http.get(
    `${this.apiUrl}/user/userList`,
    {
      params,
      withCredentials: true
    }
  );
}

//get getprofile by user id

getOtheruserProfile(userId:string){
return this.http.get(`${this.apiUrl}/user/userProfile`,{
  params:{userId},
  withCredentials:true
})
}


//update profile

updateProfile(obj:any){
return this.http.post(`${this.apiUrl}/user/profile/update`,obj,{withCredentials:true})
}

toggleFollow(userId:string){
return this.http.post(`${this.apiUrl}/follow`,"",{
  params:{userId},
  withCredentials:true
})
}


toggleLike(postId:string){
return this.http.post(`${this.apiUrl}/post/like`,"",{
  params:{postId},
  withCredentials:true
})
}


getFollowersList(){
  return this.http.get(`${this.apiUrl}/follow/followers`,{withCredentials:true});
}

getFollowingList(){
  return this.http.get(`${this.apiUrl}/follow/following`,{withCredentials:true});
}

getAllMessagesWithUser(receiverId:string){
   return this.http.get(`${this.apiUrl}/message/history`,{
    params:{receiverId},
    withCredentials:true
  });
}

}
