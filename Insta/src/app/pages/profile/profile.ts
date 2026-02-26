import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http-service';
import { TimeAgoPipe } from '../../shared/time-ago-pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  imports: [TimeAgoPipe]
})
export class Profile implements OnInit {
  defaultPostImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdemRA_yMHey1Dsd-YMTidc9suCmdewkzGCQ&s';

  about: any = null;
  postList: any[] = [];
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private cdr: ChangeDetectorRef  // 👈 Add this
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId')!;
      this.loadUser(this.userId);
    });
  }

  loadUser(id: string) {
    this.about = null;
    this.postList = [];

    this.http.getOtheruserProfile(id).subscribe((data: any) => {
      this.about = data.data;
      this.postList = [...data.postList];  // 👈 Spread to create new reference
      this.cdr.detectChanges();            // 👈 Force UI update
    });
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultPostImage;
  }
}