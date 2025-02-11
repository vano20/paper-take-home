import { createReducer, on } from '@ngrx/store';
import { User } from '../../types/user.model';
import { loadSelectedUser, loadUsers, loadUsersFailure, loadUsersSuccess, resetError, resetUser, setFilter, setSelectedUser } from './user.actions';

export interface UserState {
  users: User[] | null;
  loading: boolean;
  error: string | null;
  total: number;
  filter: string;
  selectedUser: User | null;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  filter: '',
  selectedUser: null,
};

export const userReducer = createReducer(
  initialState,
  on(loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(loadUsersSuccess, (state, { users, total }) => ({ ...state, users, total, loading: false })),
  on(loadUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(setFilter, (state, { filter }) => ({ ...state, filter })),
  on(loadSelectedUser, (state) => ({ ...state, loading: true, error: null })),
  on(setSelectedUser, (state, { selectedUser }) => ({ ...state, selectedUser, loading: false })),
  on(resetError, (state) => ({ ...state, error: initialState.error })),
  on(resetUser, () => initialState)
);