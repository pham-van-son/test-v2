import { Routes } from '@angular/router';
import { MainComponent } from './features/main/main.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
    },
    {
        canActivate: [authGuard],
        path: 'user-management',
        loadComponent: () => import('./features/main/component/user-management/user-management.component').then((m) => m.UserManagementComponent),
    },
    {
        canActivate: [authGuard],
        path: 'dashboard',
        loadComponent: () => import('./features/main/component/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    },
    {
        path: '**',
        redirectTo: '',
    }
];
