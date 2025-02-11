import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../features/user/service/user.service';
import { loadUsers, loadUsersFailure, loadUsersSuccess } from './user.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) { }

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      mergeMap((action) =>
        this.userService.getUsersNgrx(action.metas).pipe(
          map((response) => {
            const users = response.body || [];
            const total = Number(response.headers.get('X-Total-Count')) || 0;

            return loadUsersSuccess({ users, total });
          }),
          catchError((error) => of(loadUsersFailure({ error: error.message ?? 'Something went wrong, Please contact administrator' })))
        )
      )
    )
  );
}