import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { CategoriesComponent } from './components/categories/categories.component';


@NgModule({
  declarations: [AdminComponent, CategoriesComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
