import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CompareComponent } from './pages/compare/compare.component';
import { LoginComponent } from './pages/login/login.component';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
