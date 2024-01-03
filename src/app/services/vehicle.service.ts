import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { ConfigService, JwtService } from '.';
import { Observable, map, tap } from 'rxjs';
import { Vehicle } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private jwtService = inject(JwtService);

  public vehicleSignal: WritableSignal<Vehicle[]> = signal([]);

  getVehicles() {
    return this.http
      .get(`${this.configService.getApiUrl()}/vehicles/`, {
        headers: {
          Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
        },
      })
      .pipe(
        map((response: any) => {
          this.vehicleSignal.set(response.results);
          return response.results;
        })
      );
  }

  getVehicle(slug: string): Observable<Partial<Vehicle>> {
    return this.http.get(`${this.configService.getApiUrl()}/vehicle/${slug}`, {
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

  postVehicle(vehicleService: Partial<Vehicle>) {
    return this.http
      .post(
        `${this.configService.getApiUrl()}/vehicles/`,
        {
          ...vehicleService,
        },
        {
          headers: {
            Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
          },
        }
      )
      .pipe(
        tap(() => {
          this.vehicleSignal.update((state: any) => [...state, vehicleService]);
        })
      );
  }
}
