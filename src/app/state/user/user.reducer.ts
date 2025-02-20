import { createReducer, on } from '@ngrx/store';
import { User } from '../../types/user.model';
import { loadPosts, loadPostsFailure, loadPostsSuccess, loadSelectedUser, loadUsers, loadUsersFailure, loadUsersSuccess, resetError, resetUser, setFilter, setSelectedUser } from './user.actions';
import { Post } from '../../types/post.model';

export interface UserState {
  users: User[] | null;
  loading: boolean;
  error: string | null;
  total: number;
  filter: string;
  selectedUser: User | null;
  posts: Post[] | null;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  filter: '',
  selectedUser: null,
  posts: [],
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
  on(resetUser, () => initialState),
  on(loadPosts, (state) => ({ ...state, loading: true })),
  on(loadPostsSuccess, (state, { posts }) => {
    const users = state.users?.map(user => ({
      ...user,
      posts: posts.filter((post) => post.userId === user.id) ?? [],
    })) ?? [];
    
    return { ...state, loading: false, users, };
  }),
  on(loadPostsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);