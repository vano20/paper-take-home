import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { User } from '../../../types/user.model';
import { TableMeta } from '../../../shared/components/table/table.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>({} as User);
  private errorMessageSubject = new BehaviorSubject<string>('');
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  user$ = this.userSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();

  setUserDetail(user: User): void {
    this.userSubject.next(user);
  }

  setErrorMessage(message: string): void {
    this.errorMessageSubject.next(message);
  }

  setLoadingState(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }

  getUsersNgrx(metas: TableMeta): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.apiUrl, {
      params: {
        _page: metas.page,
        _per_page: metas.perPage
      },
      observe: 'response'
    });
  }

  getSelectedUsersNgrx(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
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