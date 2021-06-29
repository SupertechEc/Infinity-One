import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layout/components/default/default.component';
import { DashboardComponent } from './layout/components/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainComponent } from './layout/components/main/main.component';
import { EliteDashboardComponent } from './layout/components/elite-dashboard/elite-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
    ]
  },
  {
    path: 'dashboard',
    component: EliteDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
    ]
  },
  // {
  //   path: 'dash',
  //   component: EliteDashboardComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./cuadromando/cuadromando.module').then(m => m.CuadromandoModule),
  //     },
  //   ]
  // },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
