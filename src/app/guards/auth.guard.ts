import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, JwtService } from '../services';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const token = inject(JwtService).getAccessToken();

  if (token) {
    authService.verifyToken().subscribe((isValid: boolean) => {
      if (isValid) {
        return true;
      } else {
        inject(Router).navigate(['/login']);
        return false;
      }
    });
    return true;    
  } else {
    inject(Router).navigate(['/login']);
    return false;
  }
};
