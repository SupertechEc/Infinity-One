import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listaprecioterminalproducto',
  templateUrl: './listaprecioterminalproducto.component.html',
  styleUrls: ['./listaprecioterminalproducto.component.css']
})
export class ListaprecioterminalproductoComponent implements OnInit {

  f = new FormGroup({});
  // tipo: any[] = [];
  loading = false;
  registro = false;
  id = '';
  btnName = '';
  codCliente: any[] = [];
  activo = false;
  inactivo = false;
  indeterminate = false;
  color = '';
  stylecolor = '';
  labelPosition = 'after';
  terminal: any[] = [];
  producto: any[] = [];
  medida: any[] = [];
  listaPrecioId = '';
  comercializadora: any[] = [];
  listaPrecio: any[] = [];
  lptp: any[] = [];
  tipo = '';
  estatus = false;
  listaPrecioCodigo = '';
  listaPrecioNombre = '';
  comercializadoraId = '';
  comercializadoraNombre = '';
  selection = 0;
  flag = 0;
  flag2 = 0;
  disabled = true;

  constructor(
    private fb: FormBuilder,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private afs: AngularFireStorage,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute
  ) {
    this.makeForm();
    this.aRoute.queryParams.subscribe(params => {
      this.listaPrecioId = params.listaprecioId;
      this.listaPrecioCodigo = params.listaprecioCodigo;
      this.listaPrecioNombre = params.listaprecioNombre;
      this.comercializadoraId = params.comercializadoraId;
      this.comercializadoraNombre = params.comercializadoraNombre;
      this.tipo = params.tipo;
      if (params.estatus === 'true') {
        this.estatus = true;
      } else {
        this.estatus = false;
      }
      console.log(params);
      this.getLptp(params);
    });
  }

  ngOnInit(): void {
    // this.getComercializadora();
    this.getListaPrecio();
    // this.getTerminal();
    this.getMedida();
    // this.getProducto();
  }

  getLptp(params: any): void {
    this.cf.getItemsParm('listaprecioterminalproducto', 'listaPrecioId', params.listaprecioId).subscribe(r => {
      this.lptp = [];
      r.forEach((element: any) => {
        this.lptp.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      if (this.lptp.length > 0) {
        this.btnName = 'Editar';
        this.lptp[0].listaPrecioId = params.listaprecioId;
        this.lptp[0].listaPrecioCodigo = params.listaprecioCodigo;
        this.lptp[0].listaPrecioNombre = params.listaprecioNombre;
        this.lptp[0].comercializadoraId = params.comercializadoraId;
        this.lptp[0].comercializadoraNombre = params.comercializadoraNombre;
        this.lptp[0].tipo = params.tipo;
        this.lptp[0].estatus = this.estatus;
        console.log(this.lptp[0]);
        this.f.patchValue({
          listaPrecioId: this.lptp[0].listaPrecioId,
          listaPrecioCodigo: this.lptp[0].listaPrecioCodigo,
          listaPrecioNombre: this.lptp[0].listaPrecioNombre,
          comercializadoraCodigo: this.lptp[0].comercializadoraCodigo,
          comercializadoraNombre: this.lptp[0].comercializadoraNombre,
          tipoListaPrecio: this.lptp[0].tipo,
          radioButton: this.lptp[0].radioButton,
          estatus: this.lptp[0].estatus
        });
        this.selection = 2;
        this.datosProductos.clear();
        this.getDatosProductosEditar(this.lptp[0]);
      } else {
        this.btnName = 'Agregar';
      }
    });
  }

  makeForm(): void {
    this.f = this.fb.group({
      listaPrecioId: [''],
      listaPrecioCodigo: [''],
      listaPrecioNombre: [''],
      comercializadoraCodigo: [''],
      comercializadoraNombre: [''],
      tipoListaPrecio: [''],
      radioButton: ['', [Validators.required]],
      estatus: [false],
      datosProductos: this.fb.array([]),
    });
  }

  getDatosProductosEditar(arr: any): void {
    arr.datosProductos.forEach((e: any) => {
      if (this.tipo === 'MPO') {
        console.log(e.productoCodigo);
        this.agregardatosProductos(
          e.productoCodigo,
          e.productoNombre,
          e.medidaAbreviacion,
          e.margenporcentaje);
      } else {
        console.log(e);
        this.agregardatosProductos(
          e.productoCodigo,
          e.productoNombre,
          e.medidaAbreviacion,
          e.margenvalorcomercializadora);
      }
    });
  }

  agregardatosProductos(pc: string, pn: string, ma: string, mg: number): void {
    this.datosProductos.push(this.crearDatoProducto(pc, pn, ma, mg));
  }

  private crearDatoProducto(pc: string, pn: string, ma: string, mg: number): any {
    if (this.btnName === 'Agregar') {
      if (this.tipo === 'MPO') {
        return this.fb.group({
          productoCodigo: [pc],
          productoNombre: [pn],
          medidaAbreviacion: [ma],
          margenporcentaje: ['', [Validators.required]]
        });
      } else {
        return this.fb.group({
          productoCodigo: [pc],
          productoNombre: [pn],
          medidaAbreviacion: [ma],
          margenvalorcomercializadora: ['', [Validators.required]]
        });
      }
    } else {
      if (this.tipo === 'MPO') {
        return this.fb.group({
          productoCodigo: [pc],
          productoNombre: [pn],
          medidaAbreviacion: [ma],
          margenporcentaje: [mg, [Validators.required]]
        });
      } else {
        return this.fb.group({
          productoCodigo: [pc],
          productoNombre: [pn],
          medidaAbreviacion: [ma],
          margenvalorcomercializadora: [mg, [Validators.required]]
        });
      }
    }
  }

  eliminarDatoContacto(i: number): void {
    this.datosProductos.removeAt(i);
  }

  get datosProductos(): any {
    return this.f.get('datosProductos') as FormArray;
  }


  getListaPrecio(): void {
    this.cf.getItemsParm('listaprecio', 'codigo', this.listaPrecioCodigo).subscribe(data => {
      this.listaPrecio = [];
      data.forEach((element: any) => {
        this.listaPrecio.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.flag2 = 1;
      console.log(this.listaPrecio);
      this.cf.getItemsParm('comercializadoraproducto', 'comercializadoraCodigo', this.comercializadoraId).subscribe(dat => {
        this.comercializadora = [];
        dat.forEach((element: any) => {
          this.comercializadora.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        this.flag = 1;
        console.log(this.comercializadora);
        if (this.btnName === 'Agregar') {
          this.f.patchValue({
            listaPrecioId: this.listaPrecio[0].id,
            listaPrecioCodigo: this.listaPrecio[0].codigo,
            listaPrecioNombre: this.listaPrecio[0].nombre,
            comercializadoraCodigo: this.comercializadora[0].comercializadoraCodigo,
            comercializadoraNombre: this.comercializadora[0].comercializadoraNombre,
            tipoListaPrecio: this.listaPrecio[0].tipo,
            estatus: this.listaPrecio[0].estatus,
          });
        }
      });
    });
  }

  // getTerminal(): void {
  //   this.cf.getItems('terminal', 'nombre').subscribe(data => {
  //     this.terminal = [];
  //     data.forEach((element: any) => {
  //       this.terminal.push({
  //         id: element.payload.doc.id,
  //         ...element.payload.doc.data()
  //       });
  //     });
  //     console.log(this.terminal);
  //   });
  // }

  getMedida(): void {
    this.cf.getItems('medida', 'nombre').subscribe(data => {
      this.medida = [];
      data.forEach((element: any) => {
        this.medida.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.medida);
    });
  }

  get terminalIdNotValid(): any {
    return this.f.get('terminalId')?.invalid && this.f.get('terminalId')?.touched;
  }

  get productoIdNotValid(): any {
    return this.f.get('productoId')?.invalid && this.f.get('productoId')?.touched;
  }

  get medidaIdNotValid(): any {
    return this.f.get('medidaId')?.invalid && this.f.get('medidaId')?.touched;
  }

  get margenporcentajeNotValid(): any {
    return this.f.get('margenporcentaje')?.invalid && this.f.get('margenporcentaje')?.touched;
  }

  get margenvalorcomercializadoraNotValid(): any {
    return this.f.get('margenvalorcomercializadora')?.invalid && this.f.get('margenvalorcomercializadora')?.touched;
  }

  changeselection(valor: number): void {
    this.producto = [];
    if (valor === 1) {
      this.selection = 1;
    } else {
      this.selection = 2;
      console.log(this.comercializadora[0].id);
      this.datosProductos.clear();
      console.log(this.datosProductos.length);
      if (this.btnName === 'Agregar') {
        this.cf.getSubItem('comercializadoraproducto', this.comercializadora[0].id, 'productos').subscribe(d => {
          d.forEach((element: any) => {
            this.producto.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            });
            const pc = element.payload.doc.data().productoCodigo;
            const pn = element.payload.doc.data().productoNombre;
            const ma = element.payload.doc.data().medidaAbreviacion;
            console.log('pc: ' + pc + ' pn: ' + pn + ' ma: ' + ma);
            this.agregardatosProductos(pc, pn, ma, 0);
          });
          // console.log(this.producto);
        });
      } else {
        this.getDatosProductosEditar(this.lptp[0]);
      }
      this.disabled = false;
    }
  }

  save(): void {
    console.log(this.f.value);
    let value = [];
    if (this.btnName === 'Agregar') {
      this.cf.getItems('terminal', 'nombre').subscribe(data => {
        this.terminal = [];
        data.forEach((element: any) => {
          value = {
            ...this.f.value
          };
          this.terminal.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
          value.fechaCreacion = new Date();
          value.terminalId = element.payload.doc.id;
          value.terminalCodigo = element.payload.doc.data().codigo;
          value.terminalNombre = element.payload.doc.data().nombre;
          console.log(value);
          this.cf.agregarItem(value, 'listaprecioterminalproducto');
        });
      });
      this.toastr.success('Items agregados con exito', 'Items Agregados', {
        positionClass: 'toast-bottom-right'
      });
    } else {
      console.log(this.lptp[0]);
      this.lptp.forEach((e: any) => {
        value = {
          ...this.f.value
        };
        value.fechaActualizacion = new Date();
        value.terminalId = e.terminalId;
        value.terminalCodigo = e.terminalCodigo;
        value.terminalNombre = e.terminalNombre;
        console.log(value);
        this.cf.editItem('listaprecioterminalproducto', e.id, value);
      });
      this.toastr.success('Items editados con exito', 'Items Editados', {
        positionClass: 'toast-bottom-right'
      });
    }
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'LISTA PRECIO' } });
  }

  close(): void {
    console.log(this.listaPrecioId);
    this.router.navigate(['/dashboard/listaprecio'], { queryParams: { id: this.listaPrecioId } });
  }

}
