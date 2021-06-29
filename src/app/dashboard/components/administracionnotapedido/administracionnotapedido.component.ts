import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { ServiceDataService } from '../../../core/services/service-data.service';
import { map } from 'rxjs/operators';
import { now } from 'jquery';

@Component({
  selector: 'app-administracionnotapedido',
  templateUrl: './administracionnotapedido.component.html',
  styleUrls: ['./administracionnotapedido.component.css']
})
export class AdministracionnotapedidoComponent implements AfterViewInit {

  abastecedora: any[] = [];
  comercializadora: any[] = [];
  terminal: any[] = [];
  item: any[] = [];
  notaPedido: any[] = [];
  numero: any[] = [];
  np: any[] = [];
  abas: any;
  come: any;
  term: any;
  tife: any;
  k = 0;
  user: any;
  num: any;
  grid = false;
  pp = false;
  fv: Date | undefined;
  precio: any;
  subPrecio: any;
  price: any[] = [];
  facturaDetalle: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource();
  displayColumns = ['cliente', 'factura', 'numero', 'producto', 'volSolicitado', 'volAutorizado',
    'fechaVenta', 'fechaDespacho', 'adelantar', 'autorizar', 'anular'];
  f: FormGroup = this.fb.group({
    abastecedoraId: ['', [Validators.required]],
    comercializadoraId: ['', [Validators.required]],
    terminalId: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    porProcesar: [''],
    datosNotaPedido: this.fb.array([])
  });

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private aRoute: ActivatedRoute,
    private cf: ConectionFirebaseService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private local: LocalstorageService,
    private sd: ServiceDataService,
  ) {
    this.getNotaPedido();
    this.getAbastecedora();
    this.getComercializadora();
    this.getTerminal();
    this.getNumero();
    // this.addDate();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addDate(fe: string, n: number): Date {
    console.log(fe);
    const f = new Date(fe);
    f.setDate(f.getDate() + n);
    return f;
  }

  getAbastecedora(): void {
    this.cf.getItems('abastecedora', 'nombre').subscribe(data => {
      this.abastecedora = [];
      data.forEach((element: any) => {
        this.abastecedora.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.abastecedora);
    });
  }

  getComercializadora(): void {
    this.cf.getItems('comercializadora', 'nombre').subscribe(data => {
      this.comercializadora = [];
      data.forEach((element: any) => {
        this.comercializadora.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.comercializadora);
    });
  }

  getTerminal(): void {
    this.cf.getItems('terminal', 'nombre').subscribe(data => {
      this.terminal = [];
      data.forEach((element: any) => {
        this.terminal.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.terminal);
    });
  }

  getNotaPedido(): void {
    this.notaPedido = [];
    this.cf.getItems('notadepedido', 'codigo').subscribe(data => {
      if (this.k === 0) {
        this.k++;
        data.forEach((element: any) => {
          this.notaPedido.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.notaPedido);
        // this.notaPedido.forEach((r: any) => {
        //   this.addRow(r);
        // });
      }
    });
  }

  getNumero(): void {
    this.numero = [];
    this.cf.getItems('numero', 'secuencial').subscribe(n => {
      n.forEach((element: any) => {
        this.numero.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.numero = this.numero.filter(d => d.estatus === false);
      this.numero.sort((a, b) => {
        return a.secuencial - b.secuencial;
      });
      this.num = this.numero[0];
      console.log(this.num);
    });
  }

  get dataFormArray(): FormArray {
    return this.f.get('datosNotaPedido') as FormArray;
  }

  addRow(item: any): void {
    // console.log(item);
    const fv = this.datePipe.transform(item.fechaVenta.toDate(), 'yyyy/MM/dd');
    const fd = this.datePipe.transform(item.fechaDespacho.toDate(), 'yyyy/MM/dd');
    const ade = false;
    const aut = false;
    const anu = false;
    const row = this.fb.group({
      notaPedidoId: [item.id],
      abastecedoraId: [item.abastecedoraId],
      comercializadoraId: [item.comercializadoraId],
      cliente: [item.clienteId],
      bancoId: [item.bancoId],
      clienteId: [item.clienteId],
      factura: [item.numeroFactura],
      numero: [item.codigo],
      comentario: [item.comentario],
      terminalId: [item.terminalId],
      productoCodigo: [item.productoId],
      medidaId: [item.medidaId],
      volSolicitado: [item.volNatural],
      volAutorizado: [item.volNatural, [Validators.required]],
      fechaVenta: [fv],
      fechaDespacho: [fd],
      adelantar: [ade, [Validators.required]],
      autorizar: [aut, [Validators.required]],
      anular: [anu, [Validators.required]]
    });
    this.dataFormArray.push(row);
    this.dataSource.data = this.dataFormArray.controls;
  }

  getActualIndex(index: number): number {
    return index + this.paginator.pageSize * this.paginator.pageIndex;
  }

  get abastecedoraIdNotValid(): any {
    return this.f.get('abastecedoraId')?.invalid && this.f.get('abastecedoraId')?.touched;
  }

  get comercializadoraIdNotValid(): any {
    return this.f.get('comercializadoraId')?.invalid && this.f.get('comercializadoraId')?.touched;
  }

  get terminalIdNotValid(): any {
    return this.f.get('comercializadoraId')?.invalid && this.f.get('comercializadoraId')?.touched;
  }

  filterAbas(item: any): void {
    console.log(item);
    this.k = 0;
    this.notaPedido = [];
    this.abas = item.codigo;
    console.log(this.abas);
    this.cf.getItems('notadepedido', 'codigo').subscribe(data => {
      if (this.k === 0) {
        this.k++;
        data.forEach((element: any) => {
          this.notaPedido.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.notaPedido);
        this.dataFormArray.clear();
        this.dataSource.data = this.dataFormArray.controls;
        this.notaPedido = this.notaPedido.filter(d => d.abastecedoraId === this.abas);
        // this.notaPedido.forEach((r: any) => {
        //   this.addRow(r);
        // });
      }
    });
  }

  filterCome(item: any): void {
    console.log(item);
    this.come = item.codigo;
    this.k = 0;
    this.notaPedido = [];
    console.log(this.abas);
    console.log(this.come);
    this.cf.getItems('notadepedido', 'codigo').subscribe(data => {
      if (this.k === 0) {
        this.k++;
        data.forEach((element: any) => {
          this.notaPedido.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.notaPedido);
        this.dataFormArray.clear();
        this.dataSource.data = this.dataFormArray.controls;
        if (this.abas) {
          this.notaPedido = this.notaPedido.filter(d => d.abastecedoraId === this.abas);
          this.notaPedido = this.notaPedido.filter(d => d.comercializadoraId === this.come);
        } else {
          this.notaPedido = this.notaPedido.filter(d => d.comercializadoraId === this.come);
        }
        console.log(this.notaPedido);
        // this.notaPedido.forEach((r: any) => {
        //   this.addRow(r);
        // });
      }
    });
  }

  filterTerm(item: any): void {
    console.log(item);
    this.term = item.codigo;
    console.log(this.abas);
    console.log(this.come);
    console.log(this.term);
    this.k = 0;
    this.notaPedido = [];
    this.cf.getItems('notadepedido', 'codigo').subscribe(data => {
      if (this.k === 0) {
        this.k++;
        data.forEach((element: any) => {
          this.notaPedido.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.notaPedido);
        this.dataFormArray.clear();
        this.dataSource.data = this.dataFormArray.controls;
        if (this.abas && this.come) {
          this.notaPedido = this.notaPedido.filter(d => d.abastecedoraId === this.abas);
          this.notaPedido = this.notaPedido.filter(d => d.comercializadoraId === this.come);
          this.notaPedido = this.notaPedido.filter(d => d.terminalId === this.term);
        } else if (this.abas && !this.come) {
          this.notaPedido = this.notaPedido.filter(d => d.abastecedoraId === this.abas);
          this.notaPedido = this.notaPedido.filter(d => d.terminalId === this.term);
        } else if (!this.abas && this.come) {
          this.notaPedido = this.notaPedido.filter(d => d.comercializadoraId === this.come);
          this.notaPedido = this.notaPedido.filter(d => d.terminalId === this.term);
        } else {
          this.notaPedido = this.notaPedido.filter(d => d.terminalId === this.term);
        }
        console.log(this.notaPedido);
        // this.notaPedido.forEach((r: any) => {
        //   this.addRow(r);
        // });
      }
    });
  }

  changeFilter(num: number): void {
    this.tife = num;
    console.log(this.tife);
  }

  getFecha(event: MatDatepickerInputEvent<Date>): void {
    const valores = this.f.value;
    if (this.tife) {
      const fecha = this.datePipe.transform(event.value, 'yyyy/MM/dd');
      console.log(fecha);
      this.k = 0;
      this.notaPedido = [];
      this.cf.getItems('notadepedido', 'codigo').subscribe(data => {
        if (this.k === 0) {
          this.k++;
          this.grid = true;
          data.forEach((element: any) => {
            this.notaPedido.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            });
          });
          console.log(this.notaPedido);
          this.dataFormArray.clear();
          this.dataSource.data = this.dataFormArray.controls;
          if (this.tife === 1) {
            this.notaPedido = this.notaPedido.filter(d =>
              this.datePipe.transform(d.fechaVenta.toDate(), 'yyyy/MM/dd') === fecha
            );
          } else {
            this.notaPedido = this.notaPedido.filter(d =>
              this.datePipe.transform(d.fechaDespacho.toDate(), 'yyyy/MM/dd') === fecha
            );
          }
          this.notaPedido.forEach((r: any) => {
            this.addRow(r);
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Seleccione el tipo de fecha primero.',
      });
    }
  }

  filterSave(): void {
    const valores = this.f.value;
    console.log(valores);
    this.k = 0;
    this.notaPedido = [];
    const fecha = this.datePipe.transform(valores.fecha, 'yyyy/MM/dd');
    this.cf.getItems('notadepedido', 'codigo').subscribe(data => {
      if (this.k === 0) {
        this.k++;
        data.forEach((element: any) => {
          this.notaPedido.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.notaPedido);
        this.dataFormArray.clear();
        this.dataSource.data = this.dataFormArray.controls;
        this.notaPedido = this.notaPedido.filter(d => d.abastecedoraId === valores.abastecedoraId);
        this.notaPedido = this.notaPedido.filter(d => d.comercializadoraId === valores.comercializadoraId);
        this.notaPedido = this.notaPedido.filter(d => d.terminalId === valores.terminalId);
        if (this.tife === 1) {
          this.notaPedido = this.notaPedido.filter(d =>
            this.datePipe.transform(d.fechaVenta.toDate(), 'yyyy/MM/dd') === fecha
          );
        } else {
          this.notaPedido = this.notaPedido.filter(d =>
            this.datePipe.transform(d.fechaDespacho.toDate(), 'yyyy/MM/dd') === fecha
          );
        }
        if (this.pp) {
          this.notaPedido = this.notaPedido.filter(d => d.numeroFactura === '0');
        }
        console.log(this.notaPedido);
        this.notaPedido.forEach((r: any) => {
          this.addRow(r);
        });
      }
    });
  }

  porProcesar(event: MatCheckboxChange): void {
    console.log(event.checked);
    if (event.checked) {
      this.pp = true;
      console.log(this.notaPedido);
      this.filterSave();
    } else {
      this.pp = false;
      this.filterSave();
    }
  }

  autorizar(event: MatCheckboxChange, item: any): void {
    console.log(event.checked);
    if (event.checked) {
      console.log(item.value.factura);
      if (item.value.factura !== '0') {
        Swal.fire({
          icon: 'error',
          text: 'La nota de pedido tiene una factura autorizada',
        });
      }
    }
  }

  anular(event: MatCheckboxChange, item: any): void {
    console.log(event.checked);
    if (event.checked) {
      console.log(item.value.factura);
      if (item.value.factura === '0') {
        Swal.fire({
          icon: 'error',
          text: 'No tiene factura asignada',
        });
      }
      // this.notaPedido = this.notaPedido.filter(d => d.terminalId === this.term);
    }
  }

  openVol(item: any): void {
    console.log(item.controls.volAutorizado.value);
  }

  back(): void {
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'NOTA DE PEDIDO' } });
  }

  save(): void {
    console.log(this.f.value);
    this.user = this.local.get('user');
    console.log(this.user.email);
    let au = 0;
    // this.sd.getDataPrecio('precio', 'codigo').subscribe((r: any) => {
    //   // console.log(r);
    //   this.precio = r;
    //   console.log(this.precio);
    // });

    console.log(this.precio);

    this.f.value.datosNotaPedido.forEach((e: any) => {
      this.getNumero();
      console.log(this.num);
      console.log(e);
      console.log(this.notaPedido);
      // console.log(this.numero);
      this.np = this.notaPedido;

      if (e.factura === '0') {
        if (e.autorizar) {
          au++;
          this.np = this.notaPedido.filter(d => d.id === e.notaPedidoId);
          console.log(this.notaPedido);

          // Estructura de Factura
          const factura = {
            factura: {
              facturaPK: {
                codigoAbastecedora: e.abastecedoraId,
                codigoComercializadora: e.comercializadoraId,
                numeroNotaPedido: e.numero,
                numero: this.num.codigo,
              },
              fechaVenta: e.fechaVenta,
              fechaVencimiento: this.addDate(e.fechaDespacho, this.np[0].tipoDiasPlazoCliente),
              fechaAcreditacion: this.addDate(e.fechaDespacho, this.np[0].tipoDiasPlazoCliente),
              fechaDespacho: e.fechaDespacho,
              activa: true,
              valorTotal: 0,
              ivaTotal: '',
              observacion: e.comentario,
              pagada: false,
              oeenpetro: '',
              codigoCliente: e.clienteId,
              codigoTerminal: e.terminalId,
              codigoBanco: e.bancoId,
              adelantar: e.adelantar,
              usuarioActual: this.user.email,
              nombreComercializadora: this.np[0].nombreComercializadora,
              rucComercializadora: this.np[0].rucComercializadora,
              direccionMatrizComercializadora: this.np[0].direccionComercializadora,
              nombreCliente: this.np[0].nombreCliente,
              rucCliente: this.np[0].rucCliente,
              valorSinImpuestos: '',
              correoCliente: this.np[0].emailCliente,
              direccionCliente: this.np[0].direccionCliente,
              telefonoCliente: this.np[0].telefonoCliente,
              numeroAutorizacion: '',
              fechaAutorizacion: '',
              clienteFormaPago: this.np[0].formaPagoCliente,
              plazoCliente: this.np[0].tipoDiasPlazoCliente,
              claveAcceso: this.np[0].claveSTCCliente,
              campoAdicionalCampo1: '',
              campoAdicionalCampo2: '',
              campoAdicionalCampo3: '',
              campoAdicionalCampo4: '',
              campoAdicionalCampo5: '',
              campoAdicionalCampo6: '',
              estado: 'Nueva',
              errorDocumento: '',
              hospedado: 0,
              ambienteSRI: 1,
              tipoEmision: 1,
              codigoDocumento: '01',
              esAgenteRetencion: false, // TOMAR DESDE COMERCIALIZADORA
              esContribuyenteEspecial: false, // TOMAR DESDE COMERCIALIZADORA
              obligadoContabilidad: '',
              tipoComprador: '04',
              moneda: 'DOLAR',
              fechaCreacion: new Date(),
              fechaActualizacion: new Date(),
            },
            detalle: [],
          };

          const facturaDetalle = {
            codigoAbastecedora: e.abastecedoraId,
            codigoComercializadora: e.comercializadoraId,
            rucComercializadora: this.np[0].rucComercializadora,
            numeroNotaPedido: e.numero,
            numero: '',
            codigoProducto: e.productoCodigo,
            codigoMedida: e.medidaId,
            volumenNaturalRequerido: e.volSolicitado,
            volumenNaturalAutorizado: e.volAutorizado,
            codigoPrecio: 0,
            precioProducto: 0,
            subTotal: 0,
            usuarioActual: this.user.email,
            usuario: 'dgm'
          };

          const notaPedido = {
            numeroFactura: ''
          };

          const numChange = {
            estatus: true
          };

          // const filterDetalle = {
          //   codigoComercializadora: e.comercializadoraId,
          //   codigoTerminal: e.terminalId,
          //   codigoProducto: e.productoCodigo,
          //   codigoMedida: e.medidaId,
          //   codigoListaPrecio: 'A0000000001',
          //   fechaVenta: e.fechaVenta,
          // };

          // console.log(filterDetalle);
          console.log(new Date(e.fechaVenta));

          this.precio = this.sd.getData('precio', 'codigo');
          this.precio.subscribe((d: any) => {
            this.price = d;
            d = d.filter((v: any) => v.listaPrecioCodigo === 'A0000000001');
            d = d.filter((v: any) => v.comercializadoraCodigo === e.comercializadoraId);
            // d = d.filter((v: any) => v.medidaCodigo = items.codigoMedida);
            d = d.filter((v: any) => v.medidaAbreviacion === 'GLS');
            d = d.filter((v: any) => v.activo === true);
            // d = d.filter((v: any) => v.productoCodigo === e.productoCodigo);
            d = d.filter((v: any) => this.datePipe.transform(v.fechaInicio.toDate(), 'yyyy/MM/dd') === e.fechaVenta);
            d.sort((a: any, b: any) => {
              return a.secuencial - b.secuencial;
            });
            console.log(d[0]);
            facturaDetalle.codigoPrecio = d[0].codigo;
            facturaDetalle.precioProducto = d[0].precioProducto;
            factura.factura.fechaActualizacion = new Date();

            notaPedido.numeroFactura = factura.factura.facturaPK.numero;

            if (e.fechaDespacho === e.fechaVenta && e.adelantar) {
              au++;
              console.log('Opción 1');
              factura.factura.fechaCreacion = new Date();
              // this.actionFactura(factura, e, notaPedido, this.num, numChange, facturaDetalle, d);
              // return;
            } else if (e.fechaDespacho !== e.fechaVenta && e.adelantar) {
              au++;
              console.log('Opción 2');
              factura.factura.fechaCreacion = new Date();
              // this.actionFactura(factura, e, notaPedido, this.num, numChange, facturaDetalle, d);
              // return;
            } else if (e.fechaDespacho !== e.fechaVenta && !e.adelantar) {
              au++;
              console.log('Opción 3');
              factura.factura.fechaCreacion = new Date();
              // this.actionFactura(factura, e, notaPedido, this.num, numChange, facturaDetalle, d);
              // return;
            }

            console.log(factura);
            console.log(facturaDetalle);

          });

        } else {
          console.log(au);
          if (au === 0) {
            Swal.fire({
              icon: 'error',
              text: 'Debe seleccionar una Nota de Pedido',
            });
          }
        }
      }
    });
    // this.filterSave();
  }

  actionFactura(factura: any, e: any, notaPedido: any, num: any, numChange: any, facturaDetalle: any, d: any): void {
    factura.fechaCreacion = new Date();
    const arr: any[] = [];


    this.cf.agregarItem(factura, 'facturas').then(c => {
      this.cf.editItem('notadepedido', e.notaPedidoId, notaPedido);
      this.cf.editItem('numero', num.id, numChange);
      this.cf.agregarSubItem('facturas', c.id, 'detalleFactura', facturaDetalle).then(sc => {
        console.log('Item registrado con exito');
        this.toastr.success('Item registrado con exito Op3', 'Item Registrado', {
          positionClass: 'toast-bottom-right'
        });
      });
      this.subPrecio = this.sd.getDataSub('precio', d[0].id, 'detalleprecio');
      this.subPrecio.subscribe((r: any) => {
        r = r.filter((v: any) => v.codigoGravamen !== '0001');
        r = r.filter((v: any) => v.codigoGravamen !== '0009');
        console.log(r);
        r.forEach((elm: any, key: number) => {

          // Estructura detalle
          const facDet = {
            detallefacturaPK: {
              codigoAbastecedora: facturaDetalle.codigoAbastecedora,
              codigoComercializadora: facturaDetalle.codigoComercializadora,
              numeroNotaPedido: facturaDetalle.numeroNotaPedido,
              numero: facturaDetalle.numero,
              codigoProducto: '',
            },
            volumennaturalrequerido: 100000,
            volumennaturalautorizado: 100000,
            precioproducto: 1000000,
            subTotal: (facturaDetalle.volumenNaturalAutorizado * elm.valor),
            usuarioActual: this.user.email,
            rucComercializadora: factura.rucComercializadora,
            nombreproducto: 'GASOLINA EXTRA',
            codigoImpuesto: elm.codigoGravamen,
            nombreImpuesto: elm.nombreGravamen,
            seImprime: '',
            valorDefecto: 0,
            codigomedida: {
              codigo: '01',
              nombre: 'Galones',
              abreviacion: 'Gls',
              activo: true,
              usuarioactual: this.user.email
            },
            producto: {
              codigo: '0101',
              nombre: 'Gasolina extra',
              codigostc: '202001',
              codigoarch: 'pu1',
              usuarioactual: 'fernandoTapia',
              codigoareamercadeo: {
                codigo: '01',
                nombre: 'PRODUCTOS LIMPIOS 3',
                activo: true,
                usuarioactual: this.user.email
              }
            },
          };

          // Ingresa el detalla en el array
          arr.push({
            ...facDet
          });

          // console.log(facDet);
          // console.log(key);
          let h = 0;

          this.sd.getDataParm('gravamen', 'codigo', elm.codigoGravamen).subscribe((g: any) => {
            console.log(g);
            facDet.seImprime = g[0].imprime;
            facDet.valorDefecto = g[0].valorDefecto;
            console.log(key);
            console.log(facDet);
            h++;
            console.log(h);
            if (key < r.length) {
              this.cf.agregarSubItem('facturas', c.id, 'detalleFactura', facDet).then(sc => {
                // console.log('Item registrado con exito');
                // this.toastr.success('Item registrado con exito Op3', 'Item Registrado', {
                //   positionClass: 'toast-bottom-right'
                // });
              });
            }
          });

        });

        // Agrega los detalles a la factura
        factura.detalle = arr;
        console.log(factura);
        return;
      });

    });
  }

  anularBtn(): void {
    console.log(this.f.value);
    this.f.value.datosNotaPedido.forEach((e: any) => {
      if (e.anular) {
        console.log('Anular campo 1');
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Debe seleccionar una Nota de Pedido',
        });
      }
    });

  }

}
