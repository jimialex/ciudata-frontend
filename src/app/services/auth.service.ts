import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService, JwtService } from '.';
import {
  // BehaviorSubject,
  Observable,
  catchError,
  // distinctUntilChanged,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import { User } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtService = inject(JwtService);
  http = inject(HttpClient);
  config = inject(ConfigService);
  router = inject(Router);

  public currentUserSignal: WritableSignal<User | null> = signal(null);

  public isAuthenticated = !!this.currentUserSignal();

  login(
    credentials: Partial<{ user: string | null; password: string | null }>
  ) {
    return this.http
      .post(this.config.getApiUrl() + '/auth/login/', credentials)
      .pipe(
        tap((response: any) => {
          this.jwtService.setAccessToken(response.session.access_token);
          this.jwtService.setRefreshToken(response.session.refresh_token);
          this.currentUserSignal.set(response.profile);
          this.router.navigate(['/']);
        }),
        map((response: any) => {
          return response.profile;
        })
      );
  }

  logon(): void {
    this.purgeAuth();
    this.router.navigate(['/login']);
  }

  purgeAuth(): void {
    this.jwtService.clear();
    this.currentUserSignal.set(null)
  }

verifyToken(): Observable<boolean> {
    const token = this.jwtService.getAccessToken();
    if (token) {
      return this.http
        .post(
          `${this.config.getApiUrl()}/auth/verify-token/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .pipe(
          take(1),
          map((response: any) => {
            this.jwtService.setAccessToken(response.session.access_token);
            this.jwtService.setRefreshToken(response.session.refresh_token);
            this.currentUserSignal.set(response.profile);
            return true;
          }),
          catchError(() => {
            this.jwtService.clear();
            return of(false);
          })
        );
    }
    return of(false);
  }
}
