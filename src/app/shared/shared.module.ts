import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { MaterialModule } from './../material/material.module';
import { FooterAdminComponent } from './components/footer-admin/footer-admin.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, HeaderAdminComponent, SidebarComponent, FooterAdminComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HeaderAdminComponent,
    FooterAdminComponent
  ],
})
export class SharedModule { }
