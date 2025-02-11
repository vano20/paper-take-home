import { createAction, props } from '@ngrx/store';
import { User } from '../../types/user.model';
import { TableMeta } from '../../shared/components/table/table.model';

export const loadUsers = createAction('[User] Load Users', props<{ metas: TableMeta }>());
export const loadSelectedUser = createAction('[User] Load Selected User', props<{ id: number }>());
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[], total: number }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: any }>());
export const setFilter = createAction('[User] Set Users Filter', props<{ filter: string }>());
export const setSelectedUser = createAction('[User] Set Users Filter', props<{ selectedUser: User }>());

export const resetUser = createAction('[User] Reset User');
export const resetError = createAction('[User] Reset Error');