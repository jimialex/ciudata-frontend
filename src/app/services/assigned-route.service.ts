import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { ConfigService, JwtService } from '.';
import { Observable, map, tap } from 'rxjs';
import { AssignedRoute } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AssignedRouteService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private jwtService = inject(JwtService);

  public assignedRouteSignal: WritableSignal<AssignedRoute[]> = signal([]);

  getAssignedRoutes() {
    return this.http
      .get(`${this.configService.getApiUrl()}/assigned-routes/`, {
        headers: {
          Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
        },
      })
      .pipe(
        map((response: any) => {
          this.assignedRouteSignal.set(response.results);
          return response.results;
        })
      );
  }

  getAssignedRoute(slug: string): Observable<Partial<AssignedRoute>> {
    return this.http.get(`${this.configService.getApiUrl()}/assigned-routes/${slug}`, {
      headers: {
        Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
      },
    });
    // .pipe(
    //   map((response: Partial<Vehicle>) => {
    //     return response;
    //   })
    // );
  }

  /* `(state: any) => [...state, assignedRouteService]` is an arrow function that is used as an
  argument for the `update` method of the `assignedRouteSignal` signal. */
  postAssignedRoute(assignedRouteService: Partial<AssignedRoute>) {
    return this.http
      .post(
        `${this.configService.getApiUrl()}/assigned-routes/`,
        {
          ...assignedRouteService,
        },
        {
          headers: {
            Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
          },
        }
      )
      .pipe(
        tap(() => {
          this.assignedRouteSignal.update((state: any) => [...state, assignedRouteService]);
        })
      );
  }
}
