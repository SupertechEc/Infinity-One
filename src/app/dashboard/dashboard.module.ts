import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { ComponentesComponent } from './components/componentes/componentes.component';
import { MaterialModule } from '../material/material.module';
import { ComponenteComponent } from './components/componente/componente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './components/list/list.component';
import { GroupComponent } from './components/group/group.component';
import { RouterModule } from '@angular/router';
import { OptionsComponent } from './components/options/options.component';
import { DetailsComponent } from './components/details/details.component';
import { TipoclienteComponent } from './components/tipocliente/tipocliente.component';
import { FactorcorrecionComponent } from './components/factorcorrecion/factorcorrecion.component';


@NgModule({
  declarations: [
    AdminComponent,
    CatalogoComponent,
    ComponentesComponent,
    ComponenteComponent,
    ListComponent,
    GroupComponent,
    OptionsComponent,
    DetailsComponent,
    TipoclienteComponent,
    FactorcorrecionComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class DashboardModule { }
