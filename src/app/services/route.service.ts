import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { ConfigService, JwtService } from './';
import { map } from 'rxjs';
import { Route } from '../interfaces/route';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private jwtService = inject(JwtService);

  public routesSignals: WritableSignal<Route[]> = signal([]);

  getRoutes(queryParams: { [key: string]: any } = {}) {
    return this.http
      .get(`${this.configService.getApiUrl()}/routes/`, {
        headers: {
          Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
        },
        params: queryParams, // Agrega la propiedad params
      })
      .pipe(
        map((response: any) => {
          this.routesSignals.set(response.results);
          return response.results;
        })
      );
  }

  getRoutesUnassigned() {
    return this.http
      .get(`${this.configService.getApiUrl()}/routes/unassigned/`, {
        headers: {
          Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
        },
      })
      .pipe(
        map((response: any) => {
          this.routesSignals.set(response.results);
          return response.results;
        })
      );
  }

}
