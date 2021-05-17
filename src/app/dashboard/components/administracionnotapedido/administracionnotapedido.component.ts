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
  ) {
    this.getNotaPedido();
    this.getAbastecedora();
    this.getComercializadora();
    this.getTerminal();
    this.getNumero();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
    this.f.value.datosNotaPedido.forEach((e: any) => {
      this.getNumero();
      console.log(this.num);
      console.log(e);
      console.log(this.notaPedido);
      // console.log(this.numero);
      this.np = this.notaPedido;

      if (e.factura === '0') {
        if (e.autorizar) {
          this.np = this.notaPedido.filter(d => d.id === e.notaPedidoId);
          console.log(this.notaPedido);
          const factura = {
            codigoAbastecedora: e.abastecedoraId,
            codigoComercializadora: e.comercializadoraId,
            nombreComercializadora: this.np[0].nombreComercializadora,
            rucComercializadora: this.np[0].rucComercializadora,
            direccionMatrizComercializadora: this.np[0].direccionComercializadora,
            numeroNotaPedido: e.numero,
            numero: this.num.codigo,
            fechaVenta: e.fechaVenta,
            fechaVencimiento: '',
            fechaAcreditacion: '',
            fechaDespacho: e.fechaDespacho,
            activa: true,
            valorTotal: '',
            ivaTotal: '',
            observacion: e.comentario,
            pagada: false,
            oeenpetro: '',
            codigoCliente: e.clienteId,
            nombreCliente: this.np[0].nombreCliente,
            rucCliente: this.np[0].rucCliente,
            clienteFormaPago: this.np[0].formaPagoCliente,
            plazoCliente: this.np[0].tipoDiasPlazoCliente,
            claveAcceso: this.np[0].claveSTCCliente,
            codigoTerminal: e.terminalId,
            codigoBanco: e.bancoId,
            adelantar: e.adelantar,
            usuarioActual: this.user.email,
            correoCliente: this.np[0].emailCliente,
            direccionCliente: this.np[0].direccionCliente,
            telefonoCliente: this.np[0].telefonoCliente,
            valorSinImpuestos: '',
            numeroAutorizacion: '',
            fechaAutorizacion: '',
            campoAdicionalCampo1: '',
            campoAdicionalCampo2: '',
            campoAdicionalCampo3: '',
            campoAdicionalCampo4: '',
            campoAdicionalCampo5: '',
            campoAdicionalCampo6: '',
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
          };

          const notaPedido = {
            numeroFactura: ''
          };

          const numChange = {
            estatus: true
          };

          console.log(factura);
          console.log(facturaDetalle);
          notaPedido.numeroFactura = factura.numero;
          if (e.fechaDespacho === e.fechaVenta && e.adelantar) {
            au++;
            console.log('Opción 1');
            this.cf.agregarItem(factura, 'factura').then(c => {
              this.cf.editItem('notadepedido', e.notaPedidoId, notaPedido);
              this.cf.editItem('numero', this.num.id, numChange);
              this.cf.agregarSubItem('factura', c.id, 'detalleFactura', facturaDetalle).then(sc => {
                console.log('Item registrado con exito');
                this.toastr.success('Item registrado con exito Op1', 'Item Registrado', {
                  positionClass: 'toast-bottom-right'
                });
              });
            });
          } else if (e.fechaDespacho !== e.fechaVenta && e.adelantar) {
            au++;
            console.log('Opción 2');
            this.cf.agregarItem(factura, 'factura').then(c => {
              this.cf.editItem('notadepedido', e.notaPedidoId, notaPedido);
              this.cf.editItem('numero', this.num.id, numChange);
              this.cf.agregarSubItem('factura', c.id, 'detalleFactura', facturaDetalle).then(sc => {
                console.log('Item registrado con exito');
                this.toastr.success('Item registrado con exito Op2', 'Item Registrado', {
                  positionClass: 'toast-bottom-right'
                });
              });
            });
          } else if (e.fechaDespacho !== e.fechaVenta && !e.adelantar) {
            au++;
            console.log('Opción 3');
            this.cf.agregarItem(factura, 'factura').then(c => {
              this.cf.editItem('notadepedido', e.notaPedidoId, notaPedido);
              this.cf.editItem('numero', this.num.id, numChange);
              this.cf.agregarSubItem('factura', c.id, 'detalleFactura', facturaDetalle).then(sc => {
                console.log('Item registrado con exito');
                this.toastr.success('Item registrado con exito Op3', 'Item Registrado', {
                  positionClass: 'toast-bottom-right'
                });
              });
            });
          }
        } else {
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
