import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { UserDetailsComponent } from './components/user-details/user-details.component';
import { TableModule } from '../../shared/components/table/table.module';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  { path: '', component: UserListComponent }
];

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), TableModule],
})
export class UserModule { }