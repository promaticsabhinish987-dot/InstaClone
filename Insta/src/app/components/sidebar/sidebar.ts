import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private http:HttpService){}

  @Input() isOpen: boolean = false;
  @Output()  close = new EventEmitter<void>();
  closeSidebar(){
    this.close.emit()
  }
  logout(){
this.http.logout().subscribe((data:any)=>{
  console.log(data)
})
  }
}
