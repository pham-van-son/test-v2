import { Routes } from '@angular/router';
import { MainComponent } from './features/main/main.component';
import { UserManagementComponent } from './features/main/component/user-management/user-management.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
    },
    {
        path: 'user-management',
        component: UserManagementComponent,
    },
    {
        path: '**',
        redirectTo: '',
    }
];
