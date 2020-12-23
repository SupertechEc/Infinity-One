import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { MaterialModule } from './../material/material.module';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, HeaderAdminComponent, SidebarComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HeaderAdminComponent
  ],
})
export class SharedModule { }
