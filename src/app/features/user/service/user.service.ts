import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../../types/user.model';
import { TableMeta } from '../../../shared/components/table/table.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getUsers(metas: TableMeta): Observable<User[]> {
    const config = {
      params: {
        _page: metas.page,
        _per_page: metas.perPage
      }
    };

    return this.http.get<User[]>(this.apiUrl, config).pipe(
      catchError((error) => {
        console.log('Error fetcing users', error)
        return throwError(() => new Error('Failed to load user, please try again.'))
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}