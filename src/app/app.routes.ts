import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './services';
import { map } from 'rxjs';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [
      () => !inject(AuthService).isAuthenticated,
    ],
    loadComponent: () =>
      import('./auth/login/login.component').then(
        (comp) => comp.LoginComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/pages.component').then((comp) => comp.PagesComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (comp) => comp.ProfileComponent
          ),
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./pages/user/user.component').then(
            (comp) => comp.UserComponent
          ),
      },
      {
        path: 'vehicle',
        loadComponent: () =>
          import('./pages/vehicle/vehicle.component').then(
            (comp) => comp.VehicleComponent
          ),
      },
      {
        path: 'route',
        loadComponent: () =>
          import('./pages/route/route.component').then(
            (comp) => comp.RouteComponent
          ),
      },
    ],
  },
];
