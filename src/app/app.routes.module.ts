import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'users', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
];
