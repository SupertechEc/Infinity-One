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

  numeroNotaPedido = 0;
  nnp = 54000000;
  fechaInicial = new Date();

  constructor(
    private fb: FormBuilder,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private afs: AngularFireStorage,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private es: ElementosService
  ) {
    this.makeForm();
    this.aRoute.queryParams.subscribe(params => {
      this.id = params.id;
      this.tn = params.tn;
      this.np = params.np;
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
    this.getAbastecedora();
    this.getBancos();
    this.getMedidas();
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
    this.cf.getItems('abastecedora', 'nombre').subscribe(data => {
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
    });
  }

  getComercializadora(item: any): void {
    console.log(item.codigo);
    this.cf.getItems('comercializadora', 'nombre').subscribe(data => {
      this.comercializadoras = [];
      data.forEach((element: any) => {
        this.comercializadoras.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.comercializadoras);
      this.comercializadoras = this.comercializadoras.filter(r => r.estatus === true);
      this.comercializadoras = this.comercializadoras.filter(r => r.abastecedoraId === item.codigo);
      this.comercializadora = this.comercializadoras[0];
      this.getCliente(this.comercializadora);
    });
  }

  getCliente(item: any): void {
    console.log(item.codigo);
    this.cf.getItems('cliente', 'nombre').subscribe(data => {
      this.clientes = [];
      data.forEach((element: any) => {
        this.clientes.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.clientes);
      this.clientes = this.clientes.filter(r => r.estatus === true);
      this.clientes = this.clientes.filter(r => r.comercializadoraId === item.codigo);
      this.cliente = this.clientes[0];
      this.getProductos(this.cliente);
    });
  }

  getProductos(cliente: any): void {
    console.log(cliente);
    this.getTerminales(cliente);
    this.cf.getItemsParm('clienteproducto', 'clienteId', cliente.id).subscribe(data => {
      this.clipro = [];
      data.forEach((element: any) => {
        this.clipro.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.clipro);
      this.cf.getSubItem('clienteproducto', this.clipro[0].id, 'productos').subscribe(d => {
        this.productos = [];
        d.forEach((element: any) => {
          this.productos.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.productos);
      });
    });
  }

  getTerminales(item: any): void {
    console.log(item.terminalPorDefecto);
    this.cf.getItems('terminal', 'codigo').subscribe(data => {
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
    });
  }

  getMedidas(): void {
    this.cf.getItems('medida', 'nombre').subscribe(data => {
      this.medidas = [];
      data.forEach((element: any) => {
        this.medidas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.medidas = this.medidas.filter(r => r.estatus === true);
      console.log(this.medidas);
    });
  }

  getBancos(): void {
    this.cf.getItems('banco', 'nombre').subscribe(data => {
      this.bancos = [];
      data.forEach((element: any) => {
        this.bancos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.bancos = this.bancos.filter(r => r.estatus === true);
      console.log(this.bancos);
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
      this.cf.getItemData('notadepedido', this.id).subscribe(data => {
        console.log(data.payload.data());
        const fv = data.payload.data().fechaVenta;
        const fd = data.payload.data().fechaDespacho;
        console.log(new Date(fv));
        console.log(new Date(fd));
        this.nnp = data.payload.data().codigo;
        this.stylecolor = '#ef5350';
        // this.fechaInicial = data.payload.data().fechaVenta;
        this.f.setValue({
          abastecedoraId: data.payload.data().abastecedoraId,
          comercializadoraId: data.payload.data().comercializadoraId,
          clienteId: data.payload.data().clienteId,
          fechaVenta: new Date(data.payload.data().fechaVenta),
          fechaDespacho: new Date(data.payload.data().fechaDespacho),
          bancoId: data.payload.data().bancoId,
          // terminalId: data.payload.data().terminalId,
          comentario: data.payload.data().comentario,
          productoId: data.payload.data().productoId,
          medidaId: data.payload.data().medidaId,
          volNatural: data.payload.data().volNatural,
        });
      });
    }
  }

  otraNotaPedido(): void {
    this.stylecolor = '#424242';
    console.log(this.nnp);
    this.cf.getItemsParmNumber('notadepedido', 'codigo', this.nnp).subscribe(np => {
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
        abastecedoraId: this.ondp[0].abastecedoraId,
        comercializadoraId: this.ondp[0].comercializadoraId,
        clienteId: this.ondp[0].clienteId,
        fechaVenta: this.ondp[0].fechaVenta,
        fechaDespacho: this.ondp[0].fechaDespacho,
        bancoId: this.ondp[0].bancoId,
        comentario: this.ondp[0].comentario,
        productoId: '',
        medidaId: '',
        volNatural: '',
      });
      this.nnp = 54000000;
    });
  }

  get productoIdNotValid(): any {
    return this.f.get('productoId')?.invalid && this.f.get('productoId')?.touched;
  }

  get medidaIdNotValid(): any {
    return this.f.get('medidaId')?.invalid && this.f.get('medidaId')?.touched;
  }

  get volNaturalNotValid(): any {
    return this.f.get('volNatural')?.invalid && this.f.get('volNatural')?.touched;
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
    return this.f.get('abastecedoraId')?.invalid && this.f.get('abastecedoraId')?.touched;
  }

  get comercializadoraIdNotValid(): any {
    return this.f.get('comercializadoraId')?.invalid && this.f.get('comercializadoraId')?.touched;
  }

  get clienteIdNotValid(): any {
    return this.f.get('clienteId')?.invalid && this.f.get('clienteId')?.touched;
  }

  get fechaVentaNotValid(): any {
    return this.f.get('fechaVenta')?.invalid && this.f.get('fechaVenta')?.touched;
  }

  get fechaDespachoNotValid(): any {
    return this.f.get('fechaDespacho')?.invalid && this.f.get('fechaDespacho')?.touched;
  }

  get bancoIdNotValid(): any {
    return this.f.get('bancoId')?.invalid && this.f.get('bancoId')?.touched;
  }

  get terminalIdNotValid(): any {
    return this.f.get('terminalId')?.invalid && this.f.get('terminalId')?.touched;
  }

  // get autoTanqueIdNotValid(): any {
  //   return this.f.get('autoTanqueId')?.invalid && this.f.get('autoTanqueId')?.touched;
  // }

  // get conductorIdNotValid(): any {
  //   return this.f.get('conductorId')?.invalid && this.f.get('conductorId')?.touched;
  // }

  get comentarioNotValid(): any {
    return this.f.get('comentario')?.invalid && this.f.get('comentario')?.touched;
  }


  makeForm(): void {
    this.f = this.fb.group({
      abastecedoraId: ['', [Validators.required]],
      comercializadoraId: ['', [Validators.required]],
      clienteId: ['', [Validators.required]],
      fechaVenta: [new Date(), [Validators.required]],
      fechaDespacho: ['', [Validators.required]],
      bancoId: ['', [Validators.required]],
      // terminalId: ['', [Validators.required]],
      comentario: ['', [Validators.required]],
      productoId: ['', [Validators.required]],
      medidaId: ['', [Validators.required]],
      volNatural: ['', [Validators.required]],
    });
  }

  close(): void {
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'NOTA DE PEDIDO' } });
  }

  numero(): any {
    this.cf.getItems('notadepedido', 'codigo').subscribe(data => {
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

    if (this.f.valid) {
      const value = this.f.value;
      // let a: any = {};
      // a = this.coltn;
      // value.nombre = 'NOTA PEDIDO' + a.numero;

      this.registro = true;

      // console.log(this.abastecedora);
      // console.log(this.comercializadora);
      // console.log(this.cliente);
      // console.log(this.banco);
      // console.log(this.terminal);
      // console.log(this.producto);
      // console.log(this.medida);

      value.nombreAbastecedora = this.abastecedora.nombre;
      value.nombreComercializadora = this.comercializadora.nombre;
      value.rucComercializadora = this.comercializadora.ruc;
      value.direccionComercializadora = this.comercializadora.direccion;
      value.nombreCliente = this.cliente.nombre;
      value.rucCliente = this.cliente.ruc;
      value.emailCliente = this.cliente.datosContactos[0].correo;
      value.telefonoCliente = this.cliente.datosContactos[0].telefono;
      value.direccionCliente = this.cliente.direccion;
      value.formaPagoCliente = this.cliente.formaPago;
      value.tipoDiasPlazoCliente = this.cliente.tipoDiasPlazo;
      value.claveSTCCliente = this.cliente.claveSTC;

      if (this.id !== 'new') {
        value.fechaActualizacion = new Date();
        this.cf.editItem('notadepedido', this.id, value).then(() => {
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
        // nuevo
        value.terminalId = this.terminales[0].codigo;
        value.fechaVenta = new Date();
        value.fechaCreacion = new Date();
        value.numeroFactura = '0';
        console.log(value);
        console.log((value.fechaDespacho - value.fechaVenta) / 86400000);
        if (value.fechaDespacho < value.fechaVenta) {
          Swal.fire({
            icon: 'error',
            text: 'La fecha de Despacho no puede ser menor a la fecha de Venta',
          });
        } else if (((value.fechaDespacho - value.fechaVenta) / 86400000) > 7) {
          Swal.fire({
            icon: 'error',
            text: 'La fecha de Despacho no puede ser mayor a 7 días de la fecha de Venta',
          });
        } else {
          this.numero();
          if (this.numnp.length !== 0) {
            this.nnp = this.numnp[0].codigo + 1;
            value.codigo = this.nnp;
          } else {
            value.codigo = this.nnp;
          }
          console.log(value);
          this.cf.agregarItem(value, 'notadepedido').then(() => {
            console.log('Item registrado con exito');
            this.toastr.success('Item registrado con exito', 'Item Registrado', {
              positionClass: 'toast-bottom-right'
            });
            this.registro = false;
            this.stylecolor = '#ef5350';
            // this.saveTN();
            // this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'NOTA DE PEDIDO' } });
          }).catch(error => {
            this.loading = false;
            console.log(error);
          });
          this.f.setValue({
            abastecedoraId: value.abastecedoraId,
            comercializadoraId: value.comercializadoraId,
            clienteId: value.clienteId,
            fechaVenta: value.fechaVenta,
            fechaDespacho: value.fechaDespacho,
            bancoId: value.bancoId,
            comentario: value.comentario,
            productoId: '',
            medidaId: '',
            volNatural: '',
          });
        }
      }
    }
  }

}
