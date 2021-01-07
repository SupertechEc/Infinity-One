import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [LandingComponent, LoginComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
  ]
})
export class HomeModule { }
