import { Routes } from '@angular/router';
import { MainComponent } from './features/main/main.component';
import { UserManagementComponent } from './features/main/component/user-management/user-management.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
    },
    {
        canActivate: [authGuard],
        path: 'user-management',
        component: UserManagementComponent,
    },
    {
        path: '**',
        redirectTo: '',
    }
];
