import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ElementosService } from '../../../core/services/elementos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { InfinityApiService } from 'src/app/core/services/infinity-api.service';

@Component({
  selector: 'app-notapedido',
  templateUrl: './notapedido.component.html',
  styleUrls: ['./notapedido.component.css']
})
export class NotapedidoComponent implements OnInit {

  f = new FormGroup({});
  tipo: any[] = [];
  loading = false;
  registro = false;
  // msgImage = 'Imagen no seleccionada';
  // image$!: Observable<any> | null;
  // imageUrl!: string | null;
  // imgUrl = '';
  id = '';
  btnName = '';
  codCliente: any[] = [];
  activo = false;
  inactivo = false;
  indeterminate = false;
  color = '';
  stylecolor = '';
  labelPosition = 'after';
  tn = '';
  np = '';
  coltn: any[] = [];
  abastecedoras: any[] = [];
  comercializadoras: any[] = [];
  clientes: any[] = [];
  bancos: any[] = [];
  terminales: any[] = [];
  autotanques: any[] = [];
  conductores: any[] = [];
  productos: any[] = [];
  medidas: any[] = [];
  clipro: any[] = [];
  numnp: any[] = [];
  ondp: any[] = [];
  abastecedora: any;
  comercializadora: any;
  cliente: any;
  banco: any;
  terminal: any;
  producto: any;
  medida: any;

  numeroNotaPedido = '';
  nnp = 54000000;
  numeroNP = '';
  numeroFG = '';
  fechaventa = new Date();
  user = this.local.get('user');
  params: any;

  constructor(
    private fb: FormBuilder,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private afs: AngularFireStorage,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private es: ElementosService,
    private ia: InfinityApiService
  ) {
    this.makeForm();
    this.aRoute.queryParams.subscribe(params => {
      this.id = params.id;
      this.tn = params.tn;
      this.np = params.np;
      this.params = params;
      console.log(this.tn);
      // this.getTN(this.tn);
      console.log(params);
      if (this.id !== 'new') {
        this.btnName = 'Editar';
      } else {
        this.btnName = 'Agregar';
      }
    });

  }

  ngOnInit(): void {
    // this.upload();
    this.getDataItem();
    this.getBancos();
    this.getMedidas();
    //this.getProductos();
    this.getAbastecedora();
    this.numero();
    // this.getComercializadora();
    // this.getCliente();
    // this.getTerminales();
    // this.getAutoTanques();
    // this.getConductores();
    // this.getProductos();
    // this.getItems();
  }

  getAbastecedora(): void {
    debugger;
    /*this.cf.getItems('abastecedora', 'nombre').subscribe(data => {
      this.abastecedoras = [];
      data.forEach((element: any) => {
        this.abastecedoras.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.abastecedoras);
      this.abastecedora = this.abastecedoras[0];
      this.getComercializadora(this.abastecedora);
    });*/

    this.ia.getTableInfinity('abastecedora').subscribe((data) => {
      this.abastecedoras = [];
      this.abastecedoras = data.retorno;
      this.abastecedora = this.abastecedoras[0];
    });
    // this.getComercializadora(this.abastecedora);
  }

  getComercializadora(item: any): void {
    debugger;
    console.log('Abastecedora', item.codigo);
    /*this.cf.getItems('comercializadora', 'nombre').subscribe(data => {
      this.comercializadoras = [];
      data.forEach((element: any) => {
        this.comercializadoras.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.comercializadoras);
      this.comercializadoras = this.comercializadoras.filter(r => r.estatus === true);
      this.comercializadoras = this.comercializadoras.filter(r => r.codigoabastecedora === item.codigo);
      this.comercializadora = this.comercializadoras[0];
      this.getCliente(this.comercializadora);
    });*/
    this.ia.getTableInfinity('comercializadora').subscribe((data) => {
      this.comercializadoras = [];
      this.comercializadoras = data.retorno;
      this.comercializadoras = this.comercializadoras.filter(r => r.activo === true);
      this.comercializadoras = this.comercializadoras.filter(r => r.codigoabastecedora.codigo === item.codigo);
      this.comercializadora = this.comercializadoras[0];
    });
    // this.getCliente(this.comercializadora);
  }

  getCliente(item: any): void {
    debugger;
    console.log('CodComercializadora', item.codigo);
    this.numeroNP = item.prefijonpe;
    /*this.cf.getItems('cliente', 'nombre').subscribe(data => {
      this.clientes = [];
      data.forEach((element: any) => {
        this.clientes.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.clientes);
      this.clientes = this.clientes.filter(r => r.estatus === true);
      this.clientes = this.clientes.filter(r => r.codigocomercializadora === item.codigo);
      this.cliente = this.clientes[0];
      this.getProductos(this.cliente);
    });*/
    this.ia.getTableInfinity('cliente').subscribe((data) => {
      this.clientes = [];
      this.clientes = data.retorno;
      console.log('CLientesD', this.clientes);
      this.clientes = this.clientes.filter(r => r.estado === true);
      this.clientes = this.clientes.filter(r => r.codigocomercializadora === item.codigo);
      this.cliente = this.clientes[0];
      // this.getProductos(this.cliente);
    });
  }

  getProductos(item: any): void {
    debugger;
    // item: any
    this.getTerminales(item);
    console.log('Cliente', item.codigo);
    this.ia.getClienteProducto('clienteproducto', item.codigo).subscribe((data) => {
      this.clipro  = [];
      this.productos = [];
      this.clipro  = data.retorno;
      if (this.clipro.length >= 1){
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.clipro.length; i++) {
          this.productos.push(this.clipro[i].producto);
        }
      }else {
        this.productos = [];
      }
    });
  }

  getTerminales(item: any): void {
    debugger;
    // console.log(item.terminalPorDefecto);
    console.log('CodigoTerminal', item.codigoterminaldefecto.codigo);
    /*this.cf.getItems('terminal', 'codigo').subscribe(data => {
      this.terminales = [];
      data.forEach((element: any) => {
        this.terminales.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.terminales = this.terminales.filter(r => r.estatus === true);
      this.terminales = this.terminales.filter(r => r.codigo === item.terminalPorDefecto);
      this.terminal = this.terminales[0];
      console.log(this.terminales);
    });*/
    this.ia.getTableInfinity('terminal').subscribe((data) => {
      this.terminales = data.retorno;
      this.terminales = this.terminales.filter(r => r.activo === true);
      this.terminales = this.terminales.filter(r => r.codigo === item.codigoterminaldefecto.codigo);
      this.terminal = this.terminales[0];
      console.log('Terminal', this.terminales);
    });
  }

  getMedidas(): void {
    /*this.cf.getItems('medida', 'nombre').subscribe(data => {
      this.medidas = [];
      data.forEach((element: any) => {
        this.medidas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.medidas = this.medidas.filter(r => r.estatus === true);
      console.log(this.medidas);
    });*/
    this.ia.getTableInfinity('medida').subscribe((data) => {
      this.medidas = data.retorno;
      this.medidas = this.medidas.filter(r => r.activo === true);
    });
  }

  getBancos(): void {
    /*this.cf.getItems('banco', 'nombre').subscribe(data => {
      this.bancos = [];
      data.forEach((element: any) => {
        this.bancos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.bancos = this.bancos.filter(r => r.estatus === true);
      console.log(this.bancos);
    });*/
    this.ia.getTableInfinity('banco').subscribe((data) => {
      this.bancos = data.retorno;
      this.bancos = this.bancos.filter(r => r.activo === true);
    });
  }

  getBanco(banco: any): void {
    this.banco = banco;
  }

  getProducto(producto: any): void {
    this.producto = producto;
  }

  getMedida(medida: any): void {
    this.medida = medida;
  }

  setChange(cambio: boolean): any {
    if (cambio == null) {
      return;
    }
    if (cambio) {
      this.activo = true;
      this.inactivo = false;
      this.color = 'primary';
      this.indeterminate = false;
      this.stylecolor = '#66bb6a';
    } else {
      this.activo = false;
      this.inactivo = true;
      this.color = 'warn';
      this.indeterminate = true;
      this.stylecolor = '#ef5350';
    }
  }

  getDataItem(): void {
    if (this.id !== 'new') {
      console.log(this.id);
      this.cf.getItemData('notapedido', this.id).subscribe(data => {
        console.log(data.payload.data());
        const fv = data.payload.data().fechaventa;
        const fd = data.payload.data().fechadespacho;
        console.log(new Date(fv));
        console.log(new Date(fd));
        this.nnp = data.payload.data().codigo;
        this.stylecolor = '#ef5350';
        // this.fechaInicial = data.payload.data().fechaVenta;
        this.f.setValue({
          codigoabastecedora: data.payload.data().codigoabastecedora,
          codigocomercializadora: data.payload.data().codigocomercializadora,
          codigocliente: data.payload.data().codigocliente,
          // fechaventa: new Date(data.payload.data().fechaventa),
          fechaventa: this.fechaventa,
          fechadespacho: new Date(data.payload.data().fechadespacho),
          codigobanco: data.payload.data().codigobanco,
          // codigoterminal: data.payload.data().codigoterminal,
          observacion: data.payload.data().observacion,
          codigoproducto: data.payload.data().codigoproducto,
          codigomedida: data.payload.data().codigomedida,
          volumennaturalrequerido: data.payload.data().volumennaturalrequerido,
        });
      });
    }
  }

  otraNotaPedido(): void {
    this.stylecolor = '#424242';
    console.log(this.nnp);
    this.cf.getItemsParmNumber('notapedido', 'codigo', this.nnp).subscribe(np => {
      this.ondp = [];
      np.forEach((element: any) => {
        this.ondp.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      // this.ondp = this.bancos.filter(r => r.estatus === true);
      console.log(this.ondp);
      this.f.setValue({
        codigoabastecedora: this.ondp[0].codigoabastecedora,
        codigocomercializadora: this.ondp[0].codigocomercializadora,
        codigocliente: this.ondp[0].codigocliente,
        fechaventa: this.ondp[0].fechaventa,
        fechadespacho: this.ondp[0].fechadespacho,
        codigobanco: this.ondp[0].codigobanco,
        observacion: this.ondp[0].observacion,
        codigoproducto: '',
        codigomedida: '',
        volumennaturalrequerido: '',
      });
      this.nnp = 54000000;
    });
  }

  get productoIdNotValid(): any {
    return this.f.get('codigoproducto')?.invalid && this.f.get('codigoproducto')?.touched;
  }

  get medidaIdNotValid(): any {
    return this.f.get('codigomedida')?.invalid && this.f.get('codigomedida')?.touched;
  }

  get volNaturalNotValid(): any {
    return this.f.get('volumennaturalrequerido')?.invalid && this.f.get('volumennaturalrequerido')?.touched;
  }

  get volSesentaGradosNotValid(): any {
    return this.f.get('volSesentaGrados')?.invalid && this.f.get('volSesentaGrados')?.touched;
  }

  // ----------------------------- Datos Generales ------------------------

  get nombreNotValid(): any {
    return this.f.get('nombre')?.invalid && this.f.get('nombre')?.touched;
  }

  get codigoNotValid(): any {
    return this.f.get('codigo')?.invalid && this.f.get('codigo')?.touched;
  }

  get ventaNotValid(): any {
    return this.f.get('venta')?.invalid && this.f.get('venta')?.touched;
  }

  get abastecedoraIdNotValid(): any {
    return this.f.get('codigoabastecedora')?.invalid && this.f.get('codigoabastecedora')?.touched;
  }

  get comercializadoraIdNotValid(): any {
    return this.f.get('codigocomercializadora')?.invalid && this.f.get('codigocomercializadora')?.touched;
  }

  get clienteIdNotValid(): any {
    return this.f.get('codigocliente')?.invalid && this.f.get('codigocliente')?.touched;
  }

  get fechaVentaNotValid(): any {
    return this.f.get('fechaventa')?.invalid && this.f.get('fechaventa')?.touched;
  }

  get fechaDespachoNotValid(): any {
    return this.f.get('fechadespacho')?.invalid && this.f.get('fechadespacho')?.touched;
  }

  get bancoIdNotValid(): any {
    return this.f.get('codigobanco')?.invalid && this.f.get('codigobanco')?.touched;
  }

  get terminalIdNotValid(): any {
    return this.f.get('codigoterminal')?.invalid && this.f.get('codigoterminal')?.touched;
  }

  // get autoTanqueIdNotValid(): any {
  //   return this.f.get('autoTanqueId')?.invalid && this.f.get('autoTanqueId')?.touched;
  // }

  // get conductorIdNotValid(): any {
  //   return this.f.get('conductorId')?.invalid && this.f.get('conductorId')?.touched;
  // }

  get comentarioNotValid(): any {
    return this.f.get('observacion')?.invalid && this.f.get('observacion')?.touched;
  }


  makeForm(): void {
    this.f = this.fb.group({
      codigoabastecedora: ['', [Validators.required]],
      codigocomercializadora: ['', [Validators.required]],
      codigocliente: ['', [Validators.required]],
      fechaventa: [new Date()],
      fechadespacho: ['', [Validators.required]],
      codigobanco: ['', [Validators.required]],
      // codigoterminal: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
      codigoproducto: ['', [Validators.required]],
      codigomedida: ['', [Validators.required]],
      volumennaturalrequerido: ['', [Validators.required]],
    });
  }

  close(): void {
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'NOTA DE PEDIDO' } });
  }

  numero(): any {
    this.cf.getItems('notapedido', 'codigo').subscribe(data => {
      // this.numeroNotaPedido = data.payload.data().codigo;
      this.numnp = [];
      data.forEach((element: any) => {
        this.numnp.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.numnp);
      if (this.numnp.length !== 0) {
        this.numnp.sort((a, b) => {
          return b.codigo - a.codigo;
        });
        console.log(this.numnp[0].codigo);
      }
    },
      err => {
        console.log(err);
      });
  }
   

  save(): void {
    debugger;
    if (this.f.valid) {
      const value = this.f.value;
      console.log(value);
      // let a: any = {};
      // a = this.coltn;
      // value.nombre = 'NOTA PEDIDO' + a.numero;
      // console.log(this.abastecedora);
      // console.log(this.comercializadora);
      // console.log(this.cliente);
      // console.log(this.banco);
      // console.log(this.terminal);
      // console.log(this.producto);
      // console.log(this.medida);

      // value.nombreAbastecedora = this.abastecedora.nombre;
      // value.nombreComercializadora = this.comercializadora.nombre;
      //value.usuarioactual = this.user.email;
      value.activa = true;
      value.adelantar = null;
      value.tramaenviadagoe = '';
      value.tramarecibidagoe = '';
      value.tramarenviadaaoe = '';
      value.tramarecibidaaoe = '';
      value.codigoautotanque = '';
      value.cedulaconductor = '';
      value.numerofacturasri = '0';
      value.respuestageneracionoeepp = '';
      value.respuestaanulacionoeepp = '';
      value.numero = '';
      const valores = {
        notapedido: {
          notapedidoPK: {
            codigoabastecedora: value.codigoabastecedora,
            codigocomercializadora: value.codigocomercializadora,
            numero: value.numero,
          },
          fechaventa: value.fechaventa,
          fechadespacho: value.fechadespacho,
          activa: value.activa,
          codigoautotanque: value.codigoautotanque,
          cedulaconductor: value.cedulaconductor,
          numerofacturasri: value.numerofacturasri,
          respuestageneracionoeepp: value.respuestageneracionoeepp,
          observacion: value.observacion,
          adelantar: value.adelantar,
          respuestaanulacionoeepp: value.respuestaanulacionoeepp,
          tramaenviadagoe: value.tramaenviadagoe,
          tramarecibidagoe: value.tramarecibidagoe,
          tramarenviadaaoe: value.tramarenviadaaoe,
          tramarecibidaaoe: value.tramarecibidaaoe,
          usuarioactual: this.user.email,
          prefijo: this.numeroNP,
          abastecedora: {
            codigo: value.codigoabastecedora,
          },
          codigobanco: {
              codigo: value.codigobanco,
          },
          codigocliente: {
              codigo: value.codigocliente,
          },
          comercializadora: {
              codigo: value.codigocomercializadora,
          },
          codigoterminal: {
              codigo: this.terminales[0].codigo,
          }

        },
        detalle: {
            detallenotapedidoPK: {
              codigoabastecedora: value.codigoabastecedora,
              codigocomercializadora: value.codigocomercializadora,
              numero: value.numero,
              codigoproducto: value.codigoproducto,
              codigomedida: value.codigomedida,
          },
          volumennaturalrequerido: value.volumennaturalrequerido,
          volumennaturalautorizado: value.volumennaturalrequerido,
          usuarioactual: this.user.email,
          medida: {
            codigo: value.codigomedida
          },
          producto: {
            codigo: value.codigoproducto
          }
        }
      };
      console.log(value);
      this.registro = true;
      if (this.id !== 'new') {
        // this.editItems('áreamercadeo', this.id, value, 'firebase');
        this.editItems(value, this.id, 'notapedido', 'postgres');
      } else {
        // nuevo
        // value.codigoterminal = this.terminales[0].codigo;
        // value.fechaventa = new Date();
        // value.fechaCreacion = new Date();
        // console.log(value);
        console.log((value.fechadespacho - value.fechaventa) / 86400000);
        if (value.fechadespacho < value.fechaventa) {
          Swal.fire({
            icon: 'error',
            text: 'La fecha de Despacho no puede ser menor a la fecha de Venta',
          });
        } else if (((value.fechadespacho - value.fechaventa) / 86400000) > 7) {
          Swal.fire({
            icon: 'error',
            text: 'La fecha de Despacho no puede ser mayor a 7 días de la fecha de Venta',
          });
        } else {
          /*this.numero();
          if (this.numnp.length !== 0) {
            this.numeroNP = this.numnp[0].codigo + 1;
            value.prefijo = this.numeroNP;
          } else {
            value.prefijo = this.numeroNP;
          }*/
          console.log(value);
          this.addItems('notapedido', valores, 'postgres');
          //this.numeroNP = this.numeroNotaPedido;
          this.f.setValue({
            codigoabastecedora: value.codigoabastecedora,
            codigocomercializadora: value.codigocomercializadora,
            codigocliente: value.codigocliente,
            fechaventa: value.fechaventa,
            fechadespacho: '',
            codigobanco: '',
            observacion: '',
            codigoproducto: '',
            codigomedida: '',
            volumennaturalrequerido: '',
          });
        }
      }
    }
  }

  addItems(table: string, items: any, tipo: string): void {
    if (tipo === 'firebase') {
      items.fechaCreacion = new Date();
      this.cf.agregarItem(items, table).then(() => {
        console.log('Item registrado con exito');
        this.toastr.success('Item registrado con exito', 'Item Registrado', {
          positionClass: 'toast-bottom-right'
        });
        this.registro = false;
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'NOTA DE PEDIDO' } });
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    } else {
      // items.usuarioactual = this.user.email;
      this.ia.addDataTable(table, items, 2).subscribe(
        d => {
          this.numeroFG = d.developerMessage;
          console.log('NPE', this.numeroFG);
          console.log(d);
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          //this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'NOTA DE PEDIDO' } });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

  editItems(items: any, codigo: string, table: string, tipo: string): void {
    if (tipo === 'firebase') {
      items.fechaActualizacion = new Date();
      this.cf.editItem(table, codigo, items).then(() => {
        console.log('Item editado con exito');
        this.toastr.success('Item editado con exito', 'Item Editado', {
          positionClass: 'toast-bottom-right'
        });
        this.registro = false;
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'NOTA DE PEDIDO' } });
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    } else {
      items.usuarioactual = this.user.email;
      this.ia.editDataTable(table, items).subscribe(
        d => {
          console.log(d);
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'NOTA DE PEDIDO' } });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }


}
