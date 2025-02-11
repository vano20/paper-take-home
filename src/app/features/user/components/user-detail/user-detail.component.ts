import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserService } from '../../service/user.service';
import { User } from '../../../../types/user.model';
import { UserState } from '../../../../state/user/user.reducer';
import { error, loading, selectUser } from '../../../../state/user/user.selectors';
import { loadSelectedUser, resetError } from '../../../../state/user/user.actions';

@Component({
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private store: Store<UserState>,
  ) {
    this.user$ = this.store.select(selectUser);
    this.isLoading$ = this.store.select(loading);
    this.errorMessage$ = this.store.select(error);
  }
  user$!: Observable<User | null>;
  isLoading$!: Observable<boolean>;
  errorMessage$!: Observable<string | null>;

  userId: string | null = null;

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.loadUserDetail();
  }

  ngOnDestroy() {
    this.store.dispatch(resetError());
  }

  loadUserDetail(): void {
    if (this.userId) {
      this.store.dispatch(loadSelectedUser({ id: parseInt(this.userId, 10) }))
    }
  }

  goBack(): void {
    window.history.back();
  }
}