import { Injectable } from '@angular/core';
import { enviroment } from '../../assets/config/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  getApiUrl(): string {
    return enviroment.apiUrl;
  }
}
