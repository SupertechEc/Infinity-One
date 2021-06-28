import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { InfinityApiService } from 'src/app/core/services/infinity-api.service';

@Component({
  selector: 'app-administracionnotapedido',
  templateUrl: './administracionnotapedido.component.html',
  styleUrls: ['./administracionnotapedido.component.css'],
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
  comerSeleccionada: any;
  term: any;
  tife: any;
  codComer: any;
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
  displayColumns = [
    'cliente',
    'factura',
    'numero',
    'producto',
    'volSolicitado',
    'volAutorizado',
    'fechaVenta',
    'fechaDespacho',
    'adelantar',
    'autorizar',
    'anular',
  ];
  f: FormGroup = this.fb.group({
    codigoabastecedora: ['', [Validators.required]],
    codigocomercializadora: ['', [Validators.required]],
    codigoterminal: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    porProcesar: [''],
    datosNotaPedido: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private aRoute: ActivatedRoute,
    private ia: InfinityApiService,
    private cf: ConectionFirebaseService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private local: LocalstorageService,
    private sd: ServiceDataService
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
    debugger;
    console.log(fe);
    const f = new Date(fe);
    f.setDate(f.getDate() + n);
    console.log('f', f);
    return f;
  }

  getAbastecedora(): void {
    this.ia.getTableInfinity('abastecedora').subscribe((data) => {
      this.abastecedora = [];
      this.abastecedora = data.retorno;
    });
  }

  getComercializadora(): void {
    debugger;
    this.ia.getTableInfinity('comercializadora').subscribe((data) => {
      debugger;
      this.comercializadora = [];
      this.comercializadora = data.retorno;
    });
  }

  getTerminal(): void {
    this.ia.getTableInfinity('terminal').subscribe((data) => {
      this.terminal = [];
      this.terminal = data.retorno;
    });
  }

  getNotaPedido(): void {
    this.notaPedido = [];
    this.ia.getTableInfinity('notapedido').subscribe((data) => {
      if (this.k === 0) {
        this.k++;
        this.notaPedido = data.retorno;
      }
    });
    /*this.cf.getItems('notapedido', 'codigo').subscribe(data => {
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
    });*/
  }

  getNumero(): void {
    this.numero = [];
    /*this.cf.getItems('numero', 'secuencial').subscribe(n => {
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
    });*/
    this.ia.getTableInfinity('numeracion').subscribe((data) => {
      this.numero = data.retorno;
      this.numero = this.numero.filter((d) => d.activo === false);
      this.numero.sort((a, b) => {
        return a.secuencial - b.secuencial;
      });
      this.num = this.numero[0];
      console.log(this.num);
    });
  }

  get dataFormArray(): FormArray {
    debugger;
    return this.f.get('datosNotaPedido') as FormArray;
  }

  addRow(item: any): void {
    debugger;
    item.productoCodigo = '0101';
    item.volNatural = '2000';
    item.medidaId = '01';
    // console.log(item);
    const fv = this.datePipe.transform(item.fechaventa, 'yyyy/MM/dd');
    const fd = this.datePipe.transform(item.fechadespacho, 'yyyy/MM/dd');
    const ade = false;
    const aut = false;
    const anu = false;
    const row = this.fb.group({
      notaPedidoId: [item.notapedidoPK.numero],
      codigoabastecedora: [item.notapedidoPK.codigoabastecedora],
      codigocomercializadora: [item.notapedidoPK.codigocomercializadora],
      cliente: [item.codigocliente.nombre],
      bancoId: [item.codigobanco],
      clienteId: [item.codigocliente],
      factura: [item.numerofacturasri],
      numero: [item.notapedidoPK.numero],
      //comentario: [item.comentario],
      codigoterminal: [item.codigoterminal],
      productoCodigo: [item.productoCodigo],
      medidaId: [item.medidaId],
      volSolicitado: [item.volNatural],
      volAutorizado: [item.volNatural, [Validators.required]],
      fechaVenta: [fv],
      fechaDespacho: [fd],
      adelantar: [ade, [Validators.required]],
      autorizar: [aut, [Validators.required]],
      anular: [anu, [Validators.required]],
    });
    this.dataFormArray.push(row);
    this.dataSource.data = this.dataFormArray.controls;
  }

  getActualIndex(index: number): number {
    return index + this.paginator.pageSize * this.paginator.pageIndex;
  }

  get abastecedoraIdNotValid(): any {
    return (
      this.f.get('codigoabastecedora')?.invalid &&
      this.f.get('codigoabastecedora')?.touched
    );
  }

  get comercializadoraIdNotValid(): any {
    return (
      this.f.get('codigocomercializadora')?.invalid &&
      this.f.get('codigocomercializadora')?.touched
    );
  }

  get terminalIdNotValid(): any {
    return (
      this.f.get('codigoterminal')?.invalid &&
      this.f.get('codigoterminal')?.touched
    );
  }

  filterAbas(item: any): void {
    debugger;
    console.log(item);
    this.k = 0;
    this.notaPedido = [];
    this.abas = item.codigo;
    console.log(this.abas);
    this.ia
      .getNotasPedidos('notapedido', this.abas, null, null, null, new Date())
      .subscribe((data) => {
        this.notaPedido = data.retorno;
        console.log(this.notaPedido);
      });
    /*this.ia.getTableInfinity('notapedido').subscribe((data) => {
      debugger;
      if (this.k === 0) {
        this.k++;
        this.notaPedido = data.retorno;
        console.log(this.notaPedido);
        this.dataFormArray.clear();
        this.dataSource.data = this.dataFormArray.controls;
        this.notaPedido = this.notaPedido.filter(d => d.codigoabastecedora.codigo === this.abas);
      }
    });*/
  }

  filterCome(item: any): void {
    debugger;
    console.log(item);
    this.comerSeleccionada = item;
    this.come = item.codigo;
    this.k = 0;
    this.notaPedido = [];
    console.log(this.abas);
    console.log(this.come);
    console.log('Comercializadora Seleccionada', this.comerSeleccionada);
    this.ia.getTableInfinity('notapedido').subscribe((data) => {
      if (this.k === 0) {
        this.k++;
        this.notaPedido = data.retorno;
        this.dataFormArray.clear();
        this.dataSource.data = this.dataFormArray.controls;
        if (this.abas) {
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigoabastecedora.codigo === this.abas
          );
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigocomercializadora.codigo === this.come
          );
        } else {
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigocomercializadora.codigo === this.come
          );
        }
        console.log(this.notaPedido);
      }
    });
    /*this.cf.getItems('notapedido', 'codigo').subscribe(data => {
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
          this.notaPedido = this.notaPedido.filter(d => d.codigoabastecedora === this.abas);
          this.notaPedido = this.notaPedido.filter(d => d.codigocomercializadora === this.come);
        } else {
          this.notaPedido = this.notaPedido.filter(d => d.codigocomercializadora === this.come);
        }
        console.log(this.notaPedido);
        // this.notaPedido.forEach((r: any) => {
        //   this.addRow(r);
        // });
      }
    });*/
  }

  filterTerm(item: any): void {
    debugger;
    console.log(item);
    this.term = item.codigo;
    console.log(this.abas);
    console.log(this.come);
    console.log(this.term);
    this.k = 0;
    this.notaPedido = [];
    this.ia.getTableInfinity('notapedido').subscribe((data) => {
      if (this.k === 0) {
        this.k++;
        this.notaPedido = [];
        console.log(this.notaPedido);
        this.dataFormArray.clear();
        this.dataSource.data = this.dataFormArray.controls;
        if (this.abas && this.come) {
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigoabastecedora === this.abas
          );
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigocomercializadora === this.come
          );
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigoterminal === this.term
          );
        } else if (this.abas && !this.come) {
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigoabastecedora === this.abas
          );
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigoterminal === this.term
          );
        } else if (!this.abas && this.come) {
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigocomercializadora === this.come
          );
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigoterminal === this.term
          );
        } else {
          this.notaPedido = this.notaPedido.filter(
            (d) => d.codigoterminal === this.term
          );
        }
        console.log(this.notaPedido);
      }
    });
    /*this.cf.getItems('notapedido', 'codigo').subscribe(data => {
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
          this.notaPedido = this.notaPedido.filter(d => d.codigoabastecedora === this.abas);
          this.notaPedido = this.notaPedido.filter(d => d.codigocomercializadora === this.come);
          this.notaPedido = this.notaPedido.filter(d => d.codigoterminal === this.term);
        } else if (this.abas && !this.come) {
          this.notaPedido = this.notaPedido.filter(d => d.codigoabastecedora === this.abas);
          this.notaPedido = this.notaPedido.filter(d => d.codigoterminal === this.term);
        } else if (!this.abas && this.come) {
          this.notaPedido = this.notaPedido.filter(d => d.codigocomercializadora === this.come);
          this.notaPedido = this.notaPedido.filter(d => d.codigoterminal === this.term);
        } else {
          this.notaPedido = this.notaPedido.filter(d => d.codigoterminal === this.term);
        }
        console.log(this.notaPedido);
        // this.notaPedido.forEach((r: any) => {
        //   this.addRow(r);
        // });
      }
    });*/
  }

  changeFilter(num: number): void {
    this.tife = num;
    console.log(this.tife);
  }

  getFecha(event: MatDatepickerInputEvent<Date>): void {
    debugger;
    const valores = this.f.value;
    if (this.tife) {
      const fecha = this.datePipe.transform(event.value, 'yyyy/MM/dd');
      console.log(fecha);
      this.k = 0;
      this.notaPedido = [];
      this.ia.getTableInfinity('notapedido').subscribe((data) => {
        if (this.k === 0) {
          this.k++;
          this.grid = true;
          this.notaPedido = data.retorno;
          console.log(this.notaPedido);
          this.dataFormArray.clear();
          this.dataSource.data = this.dataFormArray.controls;
          if (this.tife === 1) {
            this.notaPedido = this.notaPedido.filter(
              (d) =>
                this.datePipe.transform(d.fechaVenta.toDate(), 'yyyy/MM/dd') ===
                fecha
            );
          } else {
            this.notaPedido = this.notaPedido.filter(
              (d) =>
                this.datePipe.transform(
                  d.fechaDespacho.toDate(),
                  'yyyy/MM/dd'
                ) === fecha
            );
          }
          this.notaPedido.forEach((r: any) => {
            this.addRow(r);
          });
        }
      });
      /*this.cf.getItems('notapedido', 'codigo').subscribe(data => {
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
      });*/
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Seleccione el tipo de fecha primero.',
      });
    }
  }

  obtenerNotasPedido(
    codAbas: any,
    codComer: any,
    codTerminal: any,
    tipoFecha: any,
    fecha: any
  ): void {
    debugger;
    this.k = 0;
    this.notaPedido = [];
    if (
      codAbas !== undefined &&
      codComer !== undefined &&
      codTerminal !== undefined &&
      tipoFecha !== undefined &&
      fecha !== ''
    ) {
      this.ia
        .getNotasPedidos(
          'notapedido',
          codAbas,
          codComer,
          codTerminal,
          tipoFecha,
          fecha.value
        )
        .subscribe((data) => {
          debugger;
          if (this.k === 0) {
            this.k++;
            this.grid = true;
            this.notaPedido = data.retorno;
            console.log(this.notaPedido);
            this.dataFormArray.clear();
            this.dataSource.data = this.dataFormArray.controls;
            this.notaPedido.forEach((r: any) => {
              this.addRow(r);
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Seleccione todos los campos',
      });
    }
  }

  filterSave(): void {
    debugger;
    const valores = this.f.value;
    console.log(valores);
    this.k = 0;
    this.notaPedido = [];
    const fecha = this.datePipe.transform(valores.fecha, 'yyyy/MM/dd');

    this.ia.getTableInfinity('notapedido').subscribe((data) => {
      if (this.k === 0) {
        this.k++;
        this.notaPedido = data.retorno;
        console.log(this.notaPedido);
        this.dataFormArray.clear();
        this.notaPedido = this.notaPedido.filter(
          (d) => d.codigoabastecedora === valores.codigoabastecedora
        );
        this.notaPedido = this.notaPedido.filter(
          (d) => d.codigocomercializadora === valores.codigocomercializadora
        );
        this.notaPedido = this.notaPedido.filter(
          (d) => d.codigoterminal === valores.codigoterminal
        );
        if (this.tife === 1) {
          this.notaPedido = this.notaPedido.filter(
            (d) =>
              this.datePipe.transform(d.fechaVenta.toDate(), 'yyyy/MM/dd') ===
              fecha
          );
        } else {
          this.notaPedido = this.notaPedido.filter(
            (d) =>
              this.datePipe.transform(
                d.fechaDespacho.toDate(),
                'yyyy/MM/dd'
              ) === fecha
          );
        }
        if (this.pp) {
          this.notaPedido = this.notaPedido.filter(
            (d) => d.numeroFactura === '0'
          );
        }
        console.log(this.notaPedido);
        this.notaPedido.forEach((r: any) => {
          this.addRow(r);
        });
      }
    });
    /*this.cf.getItems('notapedido', 'codigo').subscribe(data => {
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
        this.notaPedido = this.notaPedido.filter(d => d.codigoabastecedora === valores.codigoabastecedora);
        this.notaPedido = this.notaPedido.filter(d => d.codigocomercializadora === valores.codigocomercializadora);
        this.notaPedido = this.notaPedido.filter(d => d.codigoterminal === valores.codigoterminal);
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
    });*/
  }

  porProcesar(event: MatCheckboxChange): void {
    debugger;
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
    debugger;
    console.log(event.checked);
    if (event.checked) {
      console.log(item.value.factura);
      if (item.value.factura.trim() !== '0') {
        Swal.fire({
          icon: 'error',
          text: 'La nota de pedido tiene una factura autorizada',
        });
      }
    }
  }

  anular(event: MatCheckboxChange, item: any): void {
    debugger;
    console.log(event.checked);
    if (event.checked) {
      console.log(item.value.factura);
      if (item.value.factura === '0') {
        Swal.fire({
          icon: 'error',
          text: 'No tiene factura asignada',
        });
      }
      // this.notaPedido = this.notaPedido.filter(d => d.codigoterminal === this.term);
    }
  }

  openVol(item: any): void {
    console.log(item.controls.volAutorizado.value);
  }

  back(): void {
    this.router.navigate(['/dashboard/detalle-opciones'], {
      queryParams: { nombre: 'NOTA DE PEDIDO' },
    });
  }

  save(): void {
    debugger;
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
      debugger;
      // this.getNumero();
      console.log(this.num);
      console.log(e);
      console.log(this.notaPedido);
      // console.log(this.numero);
      this.np = this.notaPedido;

      // if (e.factura === '0') {
      if (e.autorizar) {
        au++;
        // this.np = this.notaPedido.filter(d => d.numero === e.notaPedidoId);

        console.log(this.notaPedido);

        const factura = {
          codigoAbastecedora: e.codigoabastecedora,
          codigoComercializadora: e.codigocomercializadora,
          numeroNotaPedido: e.numero,
          // numero: this.num.codigo,
          numero: '0',
          fechaVenta: e.fechaVenta,
          // revisar consulta tabla fechafestiva tipoDiasPlazoCliente
          fechaVencimiento: this.addDate(e.fechaDespacho, e.clienteId.diasplazocredito),
          // fechaAcreditacion: this.addDate(e.fechaDespacho, this.np[0].tipoDiasPlazoCliente),
          fechaDespacho: e.fechaDespacho,
          activa: true,
          valorTotal: 0,
          ivaTotal: '',
          observacion: e.comentario,
          pagada: false,
          oeenpetro: '',
          codigoCliente: e.clienteId,
          codigoTerminal: e.codigoterminal,
          codigoBanco: e.bancoId,
          adelantar: e.adelantar,
          usuarioActual: this.user.email,
          // nombreComercializadora: this.np[0].nombreComercializadora,
          nombreComercializadora: this.comerSeleccionada.nombre,
          // rucComercializadora: this.np[0].rucComercializadora,
          rucComercializadora: this.comerSeleccionada.ruc,
          // direccionMatrizComercializadora: this.np[0].direccionComercializadora,
          direccionMatrizComercializadora: this.comerSeleccionada.direccion,
          // nombreCliente: this.np[0].nombreCliente,
          nombreCliente: e.clienteId.nombre,
          // rucCliente: this.np[0].rucCliente,
          rucCliente: e.clienteId.ruc,
          valorSinImpuestos: '',
          // correoCliente: this.np[0].emailCliente,
          correoCliente: e.clienteId.correo,
          // direccionCliente: this.np[0].direccionCliente,
          direccionCliente: e.clienteId.direccion,
          // telefonoCliente: this.np[0].telefonoCliente,
          telefonoCliente: e.clienteId.telefono,
          numeroAutorizacion: '',
          fechaAutorizacion: '',
          // clienteFormaPago: this.np[0].formaPagoCliente,
          clienteFormaPago: e.clienteId.codigoformapago.codigo,
          // plazoCliente: this.np[0].tipoDiasPlazoCliente,
          plazoCliente: e.clienteId.tipoplazocredito,
          // claveAcceso: this.np[0].claveSTCCliente,
          claveAcceso: '0',
          campoAdicionalCampo1: '',
          campoAdicionalCampo2: '',
          campoAdicionalCampo3: '',
          campoAdicionalCampo4: '',
          campoAdicionalCampo5: '',
          campoAdicionalCampo6: '',
          estado: 'NUEVA',
          errorDocumento: '',
          hospedado: 0,
          ambienteSRI: this.comerSeleccionada.ambientesri,
          tipoEmision: this.comerSeleccionada.tipoemision,
          codigoDocumento: '01',
          esAgenteRetencion: this.comerSeleccionada.esagenteretencion, // TOMAR DESDE COMERCIALIZADORA
          esContribuyenteEspecial:
            this.comerSeleccionada.escontribuyenteespacial, // TOMAR DESDE COMERCIALIZADORA
          obligadoContabilidad: this.comerSeleccionada.obligadocontabilidad,
          tipoComprador: '04',
          moneda: 'DOLAR',
          // fechaCreacion: new Date(),
          // fechaActualizacion: new Date(),
        };

        const facturaDetalle = {
          codigoAbastecedora: e.codigoabastecedora,
          codigoComercializadora: e.codigocomercializadora,
          // rucComercializadora: this.np[0].rucComercializadora,
          rucComercializadora: this.comerSeleccionada.ruc,
          numeroNotaPedido: e.numero,
          numero: '0',
          codigoProducto: e.productoCodigo,
          codigoMedida: e.medidaId,
          volumenNaturalRequerido: e.volSolicitado,
          volumenNaturalAutorizado: e.volAutorizado,
          codigoPrecio: 0,
          precioProducto: 0,
          subTotal: 0,
          usuarioActual: this.user.email,
          usuario: 'dgm',
        };

        const notaPedido = {
          numeroFactura: '',
        };

        const numChange = {
          estatus: true,
        };

        // const filterDetalle = {
        //   codigoComercializadora: e.codigocomercializadora,
        //   codigoTerminal: e.codigoterminal,
        //   codigoProducto: e.productoCodigo,
        //   codigoMedida: e.medidaId,
        //   codigoListaPrecio: 'A0000000001',
        //   fechaVenta: e.fechaVenta,
        // };

        // console.log(filterDetalle);
        console.log(new Date(e.fechaVenta));

        // this.precio = this.sd.getData('precio', 'codigo');
        this.ia.getListaPrecios('precio', e.codigocomercializadora, e.codigoterminal.codigo, e.productoCodigo,
        e.medidaId, e.clienteId.codigolistaprecio, e.fechaVenta).subscribe((data) => {
          debugger;
          this.precio = data.retorno;
          console.log('Precios', this.precio);
          // this.precio.subscribe((d: any) => {
          /*this.price = data.retorno;
          data.retorno = data.retorno.filter(
            (v: any) => v.precioPK.codigocomercializadora === e.codigocomercializadora
          );
          data.retorno = data.retorno.filter((v: any) => v.precioPK.codigoterminal === e.codigoterminal.codigo);
          data.retorno = data.retorno.filter((v: any) => v.precioPK.codigoproducto === e.productoCodigo);
          data.retorno = data.retorno.filter((v: any) => v.precioPK.codigomedida === e.medidaId);
          data.retorno = data.retorno.filter((v: any) => v.precioPK.codigolistaprecio === e.clienteId.codigolistaprecio);
          // d = d.filter((v: any) => v.medidaAbreviacion === 'GLS');
          data.retorno = data.retorno.filter((v: any) => v.activo === true);
          // d = d.filter((v: any) => v.productoCodigo === e.productoCodigo);
          data.retorno = data.retorno.filter(
            (v: any) =>
              this.datePipe.transform(v.precioPK.fechainicio, 'yyyy/MM/dd') ===
              e.fechaVenta
          );*/
          /*this.precio.sort((a: any, b: any) => {
            return a.secuencial - b.secuencial;
          });*/
          console.log(this.precio[0]);
          facturaDetalle.codigoPrecio = this.precio[0].codigo;
          facturaDetalle.precioProducto = this.precio[0].precioProducto;
          // });
          // factura.fechaActualizacion = new Date();

          // notaPedido.numeroFactura = factura.numero;

          if (e.fechaDespacho === e.fechaVenta && e.adelantar) {
            au++;
            console.log('Opción 1');
            // factura.fechaCreacion = new Date();
            // this.actionFactura(factura, e, notaPedido, this.num, numChange, facturaDetalle, d);
            // return;
          } else if (e.fechaDespacho !== e.fechaVenta && e.adelantar) {
            au++;
            console.log('Opción 2');
            // factura.fechaCreacion = new Date();
            // this.actionFactura(factura, e, notaPedido, this.num, numChange, facturaDetalle, d);
            // return;
          } else if (e.fechaDespacho !== e.fechaVenta && !e.adelantar) {
            au++;
            console.log('Opción 3');
            // factura.fechaCreacion = new Date();
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
      //}
    });
    // this.filterSave();
  }

  actionFactura(factura: any, e: any,  notaPedido: any,  num: any,  numChange: any, facturaDetalle: any, d: any): void {
    factura.fechaCreacion = new Date();
    this.cf.agregarItem(factura, 'facturas').then((c) => {
      this.cf.editItem('notapedido', e.notaPedidoId, notaPedido);
      this.cf.editItem('numero', num.id, numChange);
      this.cf
        .agregarSubItem('facturas', c.id, 'detalleFactura', facturaDetalle)
        .then((sc) => {
          console.log('Item registrado con exito');
          this.toastr.success(
            'Item registrado con exito Op3',
            'Item Registrado',
            {
              positionClass: 'toast-bottom-right',
            }
          );
        });
      this.subPrecio = this.sd.getDataSub('precio', d[0].id, 'detalleprecio');
      this.subPrecio.subscribe((r: any) => {
        r = r.filter((v: any) => v.codigoGravamen !== '0001');
        r = r.filter((v: any) => v.codigoGravamen !== '0009');
        console.log(r);
        r.forEach((elm: any, key: number) => {
          const facDet = {
            codigoAbastecedora: facturaDetalle.codigoAbastecedora,
            codigoComercializadora: facturaDetalle.codigoComercializadora,
            rucComercializadora: factura.rucComercializadora,
            numeroNotaPedido: facturaDetalle.numeroNotaPedido,
            numero: facturaDetalle.numero,
            codigoProducto: '',
            codigoMedida: '',
            volumenNaturalRequerido: 0,
            volumenNaturalAutorizado: 0,
            codigoPrecio: 0,
            precioProducto: 0,
            subTotal: facturaDetalle.volumenNaturalAutorizado * elm.valor,
            usuarioActual: this.user.email,
            codigoImpuesto: elm.codigoGravamen,
            nombreImpuesto: elm.nombreGravamen,
            seImprime: '',
            valorDefecto: 0,
            fechaCreacion: new Date(),
            usuario: 'dgm',
          };
          // console.log(facDet);
          // console.log(key);
          let h = 0;

          this.sd
            .getDataParm('gravamen', 'codigo', elm.codigoGravamen)
            .subscribe((g: any) => {
              console.log(g);
              facDet.seImprime = g[0].imprime;
              facDet.valorDefecto = g[0].valorDefecto;
              console.log(key);
              console.log(facDet);
              h++;
              console.log(h);
              if (key < r.length) {
                this.cf
                  .agregarSubItem('facturas', c.id, 'detalleFactura', facDet)
                  .then((sc) => {
                    // console.log('Item registrado con exito');
                    // this.toastr.success('Item registrado con exito Op3', 'Item Registrado', {
                    //   positionClass: 'toast-bottom-right'
                    // });
                  });
              }
            });
        });
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
