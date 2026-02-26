import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { About } from './pages/about/about';
import { Posts } from './pages/posts/posts';
import { CreatePost } from './pages/create-post/create-post';
import { Discover } from './pages/discover/discover';
import { Profile } from './pages/profile/profile';
import { Message } from './pages/message/message';

export const routes: Routes = [
  { path: 'login', component: Login },
    {path:'register',component:Register},
  {path:'home',component:Home},
   {path:'',component:Home},
   {path:"about",component:About},
   {path:"posts",component:Posts},
   {path:"createPost",component:CreatePost},
   {path:"discover",component:Discover},
    {path:"profile/:userId",component:Profile},
    {path:"message",component:Message}

];