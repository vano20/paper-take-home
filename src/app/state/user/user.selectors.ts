import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';
import { convertToHttps } from '../../shared/utils/urls';

export const Users = createFeatureSelector<UserState>('user');

export const users = createSelector(Users, (state) => state.users?.map(user => ({ ...user, url: convertToHttps(user.website) })) ?? []);
export const loading = createSelector(Users, (state) => state.loading);
export const error = createSelector(Users, (state) => state.error);
export const total = createSelector(Users, (state) => state.total);
export const selectFilter = createSelector(Users, (state) => state.filter);

export const filteredUser = createSelector(Users, (state) => state.users?.filter((user) => user.name.toLowerCase().includes(state.filter.toLowerCase())) ?? [])