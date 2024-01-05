import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { ConfigService, JwtService } from './';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private config = inject(ConfigService);
  private http = inject(HttpClient);
  private jwtService = inject(JwtService);

  public users: WritableSignal<User[]> = signal([]);

  getUsers() {
    return this.http
      .get(`${this.config.getApiUrl()}/users`, {
        headers: {
          Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
        },
      })
      .pipe(
        tap((response: any) => {
          this.users.set(response.results);
        })
      );
  }

  postUser(user: Partial<User>) {
    return this.http
      .post(
        `${this.config.getApiUrl()}/auth/register/user/`,
        {
          ...user,
          groups: 2,
          password: '12345678x',
          photo: null,
          phone: '1234567',
        },
        {
          headers: {
            Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
          },
        }
      )
      .pipe(
        tap(() => {
          this.users.update((state: any) => [...state, user]);
        })
      );
  }

  putUser(user: Partial<User>, username: any) {
    let url = `${this.config.getApiUrl()}/users/` + username + `/`;
    return this.http.put(url, { ...user },
      {
        headers: {
          Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
        },
      }
    )
      .pipe(
        tap(() => {
          this.users.update((state: any) => [...state, user]);
        })
      );
  }
}
