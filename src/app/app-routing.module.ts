import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticathedGuard, isNotAuthenticathedGuard } from './auth/guards';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticathedGuard],
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [ isAuthenticathedGuard ],
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
