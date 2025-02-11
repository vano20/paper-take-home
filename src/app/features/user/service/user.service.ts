import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, throwError } from 'rxjs';
import { User } from '../../../types/user.model';
import { TableMeta } from '../../../shared/components/table/table.model';
import { convertToHttps } from '../../../shared/utils/urls';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private userSubject = new BehaviorSubject<User>({} as User);
  private searchSubject = new BehaviorSubject<string>('');
  private errorMessageSubject = new BehaviorSubject<string>('');
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private totalDataCountSubject = new BehaviorSubject<number>(0);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  users$ = this.usersSubject.asObservable();
  user$ = this.userSubject.asObservable();
  search$ = this.searchSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();
  totalDataCount$ = this.totalDataCountSubject.asObservable();

  filteredUsers$ = combineLatest([this.users$, this.search$]).pipe(
    map(([users, searchTerm]) =>
      users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  setUserDetail(user: User): void {
    this.userSubject.next(user);
  }

  setSearchTerm(search: string): void {
    this.searchSubject.next(search);
  }

  setErrorMessage(message: string): void {
    this.errorMessageSubject.next(message);
  }

  setLoadingState(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }

  setTotalData(total: number): void {
    this.totalDataCountSubject.next(total);
  }

  getUsers(metas: TableMeta): void {
    this.setLoadingState(true);

    const config = {
      params: {
        _page: metas.page,
        _per_page: metas.perPage
      },
      observe: 'response' as const
    };

    this.http.get<User[]>(this.apiUrl, config).pipe(
      catchError((error) => {
        console.log('Error fetcing users', error)
        return throwError(() => new Error('Failed to load user, please try again.'));
      })
    ).subscribe({
      next: (response) => {
        const users = response.body as User[] || [];

        this.setTotalData(parseInt(response.headers.get('X-Total-Count') ?? '0'));

        this.setUsers(users.map(user => ({
          ...user,
          url: convertToHttps(user.website)
        })));
        this.setLoadingState(false);
      },
      error: (error) => {
        this.setErrorMessage(error.message ?? 'Something went wrong, Please contact administrator');
        this.setLoadingState(false);
      }
    });;
  }

  getUserById(id: number): void {
    this.setLoadingState(true);

    this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.log('Error fetcing user detail', error)
        if (error.status === 404) {
          return throwError(() => new Error('User not found'));
        }
        return throwError(() => new Error('Failed to load user detail, please try again.'));
      })
    ).subscribe({
      next: (data) => {
        this.setUserDetail(data);
        this.setLoadingState(false);
      },
      error: (err) => {
        this.setErrorMessage(err.message ?? 'Something went wrong, Please contact administrator');
        this.setLoadingState(false);
      }
    });
  }
}