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
import { MenuComponent } from './components/menu/menu.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
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
import { DialogProductoComponent } from './components/dialog-producto/dialog-producto.component';
import { ComercializadoraproductoComponent } from './components/comercializadoraproducto/comercializadoraproducto.component';
import { DialogListaprecioComponent } from './components/dialog-listaprecio/dialog-listaprecio.component';
import { DetailsPreciosComponent } from './components/details-precios/details-precios.component';
import { PrecioComponent } from './components/precio/precio.component';
import { GarantiaComponent } from './components/garantia/garantia.component';
import { NumeracionComponent } from './components/numeracion/numeracion.component';
import { AdministracionnotapedidoComponent } from './components/administracionnotapedido/administracionnotapedido.component';
import { DataTablesModule } from 'angular-datatables';
import { DialogFacturasComponent } from './components/dialog-facturas/dialog-facturas.component';
import { TestComponent } from './components/test/test.component';
import { RubrosComponent } from './components/rubros/rubros.component';
import { ClienteRubrosComponent } from './components/cliente-rubros/cliente-rubros.component';
import { CuotasClienteComponent } from './components/cuotas-cliente/cuotas-cliente.component';
import { MainComponent } from './components/main/main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
    FactorcorrecionComponent,
    MenuComponent,
    UsuarioComponent,
    SubmenuComponent,
    AccionComponent,
    TerminalComponent,
    AreamercadeoComponent,
    DireccioninenComponent,
    MedidaComponent,
    ProductoComponent,
    FormapagoComponent,
    AbastecedoraComponent,
    ComercializadoraComponent,
    NotapedidoComponent,
    ClienteComponent,
    GravamenComponent,
    ListaprecioComponent,
    ListaprecioterminalproductoComponent,
    ClienteproductoComponent,
    DialogProductoComponent,
    ComercializadoraproductoComponent,
    DialogListaprecioComponent,
    DetailsPreciosComponent,
    PrecioComponent,
    GarantiaComponent,
    NumeracionComponent,
    AdministracionnotapedidoComponent,
    DialogFacturasComponent,
    TestComponent,
    RubrosComponent,
    ClienteRubrosComponent,
    CuotasClienteComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DataTablesModule,
    FontAwesomeModule
  ]
})
export class DashboardModule { }
