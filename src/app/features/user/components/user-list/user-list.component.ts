import { ActivatedRoute, Router } from '@angular/router';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableHeader, TableMeta } from '../../../../shared/components/table/table.model';
import { User } from '../../../../types/user.model';
import { UserService } from '../../service/user.service';
import { convertToHttps } from '../../../../shared/utils/urls';

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
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = ''
  errorMessage = '';
  isLoading = false;
  columnTemplates: { [key: string]: TemplateRef<any> } = {};

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
    this.activeRoute.queryParams.subscribe(({ search }) => {
      this.searchTerm = search || '';
    });
    this.loadUsers();
  }

  loadUsers(metas: TableMeta = { page: 1, perPage: 10 }): void {
    this.isLoading = true;
    this.userService.getUsers(metas).subscribe({
      next: data => {
        this.users = data.map(user => ({
          ...user,
          url: convertToHttps(user.website)
        }));
        this.isLoading = false;

        this.filterUsers();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      },
    })
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.router.navigate([], {
      queryParams: { search: term },
      queryParamsHandling: 'merge',
    });

    this.filterUsers();
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(({ name }: User) => !this.searchTerm || name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  redirectToDetail(userId: number): void {
    this.router.navigate([userId], { relativeTo: this.activeRoute });
  }
}
