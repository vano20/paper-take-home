import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../../../types/user.model';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }
  user$!: Observable<User>;
  isLoading$!: Observable<boolean>;

  userId: string | null = null;
  isLoading = false;
  errorMessage = ''

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.user$ = this.userService.user$;
    this.isLoading$ = this.userService.isLoading$;

    this.loadUserDetail();
  }

  loadUserDetail(): void {
    if (this.userId) {
      this.userService.getUserById(parseInt(this.userId, 10));
    }
  }

  goBack(): void {
    window.history.back();
  }
}