import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return window.localStorage.getItem('refresh_token');
  }

  setAccessToken(token: string): void {
    window.localStorage.setItem('access_token', token);
  }

  setRefreshToken(token: string): void {
    window.localStorage.setItem('refresh_token', token);
  }

  clear(): void {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('refresh_token');
  }
}
