import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { ConfigService, JwtService } from './';
import { map } from 'rxjs';
import { Group } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private jwtService = inject(JwtService);

  public groups: WritableSignal<Group[]> = signal([]);

  getGroups() {
    return this.http
      .get(`${this.configService.getApiUrl()}/groups/`, {
        headers: {
          Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
        },
      })
      .pipe(
        map((response: any) => {
          //console.log("Grupos Service: ", response.results);
          this.groups.set(response.results);
          return response.results;
        })
      );
  }
}
