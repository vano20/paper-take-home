import { ActivatedRoute, Router } from '@angular/router';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableHeader, TableMeta } from '../../../../shared/components/table/table.model';
import { User } from '../../../../types/user.model';
import { UserService } from '../../service/user.service';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

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
      key: 'action',
      label: 'Action',
    },
  ];
  columnTemplates: { [key: string]: TemplateRef<any> } = {};
  users$!: Observable<User[]>;
  isLoading$!: Observable<boolean>;
  search$!: Observable<string>;
  errorMessage$!: Observable<string>;
  totalDataCount$!: Observable<number>;

  @ViewChild('websiteTemplate', { static: true }) websiteTemplate!: TemplateRef<any>;
  @ViewChild('emailTemplate', { static: true }) emailTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.columnTemplates = {
      website: this.websiteTemplate,
      email: this.emailTemplate,
      action: this.actionTemplate,
    };
  }

  ngOnInit() {
    this.users$ = this.userService.filteredUsers$;
    this.isLoading$ = this.userService.isLoading$;
    this.search$ = this.userService.search$;
    this.errorMessage$ = this.userService.errorMessage$;
    this.totalDataCount$ = this.userService.totalDataCount$;

    this.activeRoute.queryParams.subscribe(({ search }) => {
      this.userService.setSearchTerm(search || '');
    });
    this.loadUsers();
  }

  loadUsers(metas: TableMeta = { page: 1, perPage: 10 }): void {
    this.userService.getUsers(metas);
  }

  onSearchChange(term: string): void {
    this.userService.setSearchTerm(term);
    this.router.navigate([], {
      queryParams: { search: term },
      queryParamsHandling: 'merge',
    });

  }

  redirectToDetail(userId: number): void {
    this.router.navigate([userId], { relativeTo: this.activeRoute });
  }
}
