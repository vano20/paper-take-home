import { createReducer, on } from '@ngrx/store';
import { User } from '../../types/user.model';
import { loadUsers, loadUsersFailure, loadUsersSuccess, resetUser, setFilter } from './user.actions';

export interface UserState {
  users: User[] | null;
  loading: boolean;
  error: string | null;
  total: number;
  filter: string;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  filter: '',
};

export const userReducer = createReducer(
  initialState,
  on(loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(loadUsersSuccess, (state, { users, total }) => ({ ...state, loading: false, users, total })),
  on(loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(setFilter, (state, { filter }) => ({ ...state, filter })),
  on(resetUser, () => initialState)
);