import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CategoriesComponent } from './components/categories/categories.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
