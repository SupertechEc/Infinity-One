import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { ComponentesComponent } from './components/componentes/componentes.component';
import { ComponenteComponent } from './components/componente/componente.component';
import { ListComponent } from './components/list/list.component';
import { GroupComponent } from './components/group/group.component';
import { OptionsComponent } from './components/options/options.component';
import { DetailsComponent } from './components/details/details.component';
import { TipoclienteComponent } from './components/tipocliente/tipocliente.component';
import { FactorcorrecionComponent } from './components/factorcorrecion/factorcorrecion.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'catálogo',
    component: CatalogoComponent,
  },
  {
    path: 'catalogo/:id',
    component: CatalogoComponent,
  },
  {
    path: 'componentes',
    component: ComponenteComponent,
  },
  {
    path: 'lista-componentes',
    component: ComponentesComponent,
  },
  {
    path: 'edit-componentes/:id',
    component: ComponenteComponent,
  },
  {
    path: 'grupos',
    component: GroupComponent,
  },
  {
    path: 'lista-grupos',
    component: ListComponent,
  },
  {
    path: 'edit-grupos/:id',
    component: GroupComponent,
  },
  {
    path: 'opciones/:id',
    component: OptionsComponent,
  },
  {
    path: 'detalle-opciones',
    component: DetailsComponent,
  },
  {
    path: 'tipocliente',
    component: TipoclienteComponent,
  },
  {
    path: 'tipocliente/:id',
    component: TipoclienteComponent,
  },
  {
    path: 'factorcorreccion',
    component: FactorcorrecionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
