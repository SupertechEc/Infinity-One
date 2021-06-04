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
import { UsuarioComponent } from './components/usuario/usuario.component';
import { MenuComponent } from './components/menu/menu.component';
import { SubmenuComponent } from './components/submenu/submenu.component';
import { AccionComponent } from './components/accion/accion.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { AreamercadeoComponent } from './components/areamercadeo/areamercadeo.component';
import { DireccioninenComponent } from './components/direccioninen/direccioninen.component';
import { MedidaComponent } from './components/medida/medida.component';
import { ProductoComponent } from './components/producto/producto.component';
import { FormapagoComponent } from './components/formapago/formapago.component';
import { AbastecedoraComponent } from './components/abastecedora/abastecedora.component';
import { ComercializadoraComponent } from './components/comercializadora/comercializadora.component';
import { NotapedidoComponent } from './components/notapedido/notapedido.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { GravamenComponent } from './components/gravamen/gravamen.component';
import { ListaprecioComponent } from './components/listaprecio/listaprecio.component';
import { ListaprecioterminalproductoComponent } from './components/listaprecioterminalproducto/listaprecioterminalproducto.component';
import { ClienteproductoComponent } from './components/clienteproducto/clienteproducto.component';
import { ComercializadoraproductoComponent } from './components/comercializadoraproducto/comercializadoraproducto.component';
import { DetailsPreciosComponent } from './components/details-precios/details-precios.component';
import { PrecioComponent } from './components/precio/precio.component';
import { GarantiaComponent } from './components/garantia/garantia.component';
import { NumeracionComponent } from './components/numeracion/numeracion.component';
import { AdministracionnotapedidoComponent } from './components/administracionnotapedido/administracionnotapedido.component';
import { TestComponent } from './components/test/test.component';

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
    path: 'opciones',
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
    path: 'factorcorrección',
    component: FactorcorrecionComponent,
  },
  {
    path: 'usuarios',
    component: UsuarioComponent,
  },
  {
    path: 'menús',
    component: MenuComponent,
  },
  {
    path: 'submenús',
    component: SubmenuComponent,
  },
  {
    path: 'acciones',
    component: AccionComponent,
  },
  {
    path: 'terminal',
    component: TerminalComponent,
  },
  {
    path: 'áreamercadeo',
    component: AreamercadeoComponent,
  },
  {
    path: 'direccióninen',
    component: DireccioninenComponent,
  },
  {
    path: 'medida',
    component: MedidaComponent,
  },
  {
    path: 'producto',
    component: ProductoComponent,
  },
  {
    path: 'formapago',
    component: FormapagoComponent,
  },
  {
    path: 'abastecedora',
    component: AbastecedoraComponent,
  },
  {
    path: 'comercializadora',
    component: ComercializadoraComponent,
  },
  {
    path: 'notadepedido',
    component: NotapedidoComponent,
  },
  {
    path: 'cliente',
    component: ClienteComponent,
  },
  {
    path: 'gravamen',
    component: GravamenComponent,
  },
  {
    path: 'listaprecio',
    component: ListaprecioComponent,
  },
  {
    path: 'listaprecioterminalproducto',
    component: ListaprecioterminalproductoComponent,
  },
  {
    path: 'clienteproducto',
    component: ClienteproductoComponent,
  },
  {
    path: 'comercializadoraproducto',
    component: ComercializadoraproductoComponent,
  },
  {
    path: 'detalle-lista-precios',
    component: DetailsPreciosComponent,
  },
  {
    path: 'precio',
    component: PrecioComponent,
  },
  {
    path: 'garantia',
    component: GarantiaComponent,
  },
  {
    path: 'numeracion',
    component: NumeracionComponent,
  },
  {
    path: 'anp',
    component: AdministracionnotapedidoComponent,
  },
  {
    path: 'test',
    component: TestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
