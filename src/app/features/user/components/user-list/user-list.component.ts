import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { User } from '../../../../types/user.model';
import { UserState } from '../../../../state/user/user.reducer';
import { TableHeader, TableMeta } from '../../../../shared/components/table/table.model';
import { loading, error, total, filteredUser, selectFilter } from '../../../../state/user/user.selectors';
import { loadPosts, loadUsers, setFilter } from '../../../../state/user/user.actions';

@Component({
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  columnTemplates: { [key: string]: TemplateRef<any> } = {};
  users$!: Observable<User[] | null>;
  isLoading$!: Observable<boolean>;
  search$!: Observable<string>;
  errorMessage$!: Observable<string | null>;
  totalDataCount$!: Observable<number>;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<UserState>,
  ) {
    this.users$ = this.store.select(filteredUser);
    this.isLoading$ = this.store.select(loading);
    this.errorMessage$ = this.store.select(error);
    this.totalDataCount$ = this.store.select(total);
    this.search$ = this.store.select(selectFilter);
  }

  headers: TableHeader[] = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'website',
      label: 'Website',
    },
    {
      key: 'posts',
      label: 'Posts',
    },
    {
      key: 'action',
      label: 'Action',
    },
  ];

  @ViewChild('websiteTemplate', { static: true }) websiteTemplate!: TemplateRef<any>;
  @ViewChild('emailTemplate', { static: true }) emailTemplate!: TemplateRef<any>;
  @ViewChild('postTemplate', { static: true }) postTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.columnTemplates = {
      website: this.websiteTemplate,
      email: this.emailTemplate,
      action: this.actionTemplate,
      posts: this.postTemplate,
    };
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(({ search }) => {
      this.setSearchTerm(search);
    });
    this.loadUsers();
    this.loadPosts();
  }

  loadUsers(metas: TableMeta = { page: 1, perPage: 10 }): void {
    this.store.dispatch(loadUsers({ metas }));
  }

  loadPosts(): void {
    this.store.dispatch(loadPosts());
  }

  setSearchTerm(search: string) {
    this.store.dispatch(setFilter({ filter: search || '' }));
  }

  onSearchChange(term: string): void {
    this.setSearchTerm(term);
    this.router.navigate([], {
      queryParams: { search: term },
      queryParamsHandling: 'merge',
    });

  }

  redirectToDetail(userId: number): void {
    this.router.navigate([userId], { relativeTo: this.activeRoute });
  }
}
