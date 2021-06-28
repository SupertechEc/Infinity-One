import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuadromandoRoutingModule } from './cuadromando-routing.module';
import { MainComponent } from './components/main/main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    CuadromandoRoutingModule,
    FontAwesomeModule
  ]
})
export class CuadromandoModule { }
