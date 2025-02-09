import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from '../../shared/components/table/table.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { EmptyValuePipe } from '../../shared/pipe/empty-value.pipe';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: ':id', component: UserDetailComponent }
];

@NgModule({
  declarations: [UserListComponent, UserDetailComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), TableModule, EmptyValuePipe],
})
export class UserModule { }