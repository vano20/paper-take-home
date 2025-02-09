import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../../../types/user.model';

@Component({
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  userId: string | null = null;
  isLoading = false;
  user: User | null = null;
  errorMessage = ''

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.loadUserDetail();
  }

  loadUserDetail(): void {
    this.isLoading = true;

    if (this.userId) {
      this.userService.getUserById(parseInt(this.userId, 10)).subscribe({
        next: data => {
          this.user = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message ?? '';
          this.isLoading = false;
        },
      })
    }
  }

  goBack(): void {
    window.history.back();
  }
}