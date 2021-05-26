import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listaprecio',
  templateUrl: './listaprecio.component.html',
  styleUrls: ['./listaprecio.component.css']
})
export class ListaprecioComponent implements OnInit {

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
  comercializadora: any[] = [];
  datoscom: any;
  tipo = [
    { codigo: 'MPO', nombre: 'MARGEN SOBRE EL PERCIO EN TERMINAL' },
    { codigo: 'MCO', nombre: 'MARGEN SOBRE EL MARGEN DE COMERCIALIZACIÓN' }
  ];

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
      this.id = params.id;
      console.log(this.id);
      if (this.id !== 'new') {
        this.btnName = 'Editar';
      } else {
        this.btnName = 'Agregar';
      }
    });

  }

  ngOnInit(): void {
    this.getDataItem();
    this.getComercializadora();
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
      this.cf.getItemData('listaprecio', this.id).subscribe(data => {
        // this.getComOrigen(data.payload.data().comercializadoraId);
        console.log(data.payload.data());
        this.f.patchValue({
          nombre: data.payload.data().nombre,
          codigo: data.payload.data().codigo,
          estatus: data.payload.data().estatus,
          comercializadoraId: data.payload.data().comercializadoraId,
          comercializadoraNombre: data.payload.data().comercializadoraNombre,
          tipo: data.payload.data().tipo,
        });
        this.setChange(data.payload.data().estatus);
        // this.loading = false;
      });
    }
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

  get nombreNotValid(): any {
    return this.f.get('nombre')?.invalid && this.f.get('nombre')?.touched;
  }

  get codigoNotValid(): any {
    return this.f.get('codigo')?.invalid && this.f.get('codigo')?.touched;
  }

  get estatusNotValid(): any {
    return this.f.get('estatus')?.invalid && this.f.get('estatus')?.touched;
  }

  get fechaNotValid(): any {
    return this.f.get('fecha')?.invalid && this.f.get('fecha')?.touched;
  }

  get comercializadoraIdNotValid(): any {
    return this.f.get('comercializadoraId')?.invalid && this.f.get('comercializadoraId')?.touched;
  }

  // get porcentajeNotValid(): any {
  //   return this.f.get('porcentaje')?.invalid && this.f.get('porcentaje')?.touched;
  // }

  // get valorNotValid(): any {
  //   return this.f.get('valor')?.invalid && this.f.get('valor')?.touched;
  // }

  get tipoNotValid(): any {
    return this.f.get('tipo')?.invalid && this.f.get('tipo')?.touched;
  }

  makeForm(): void {
    this.f = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      codigo: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      estatus: [false, [Validators.required]],
      comercializadoraId: ['', [Validators.required]],
      comercializadoraNombre: [''],
      tipo: ['', [Validators.required]],
    });

  }

  // getComOrigen(id: string): void {
  //   console.log(id);
  //   this.cf.getItemsParm('comercializadora', 'codigo', id).subscribe(data => {
  //     this.datoscom = data.payload.data();
  //     console.log(data.payload.data());
  //   });
  // }

  getCom(item: any): void {
    this.datoscom = item;
    console.log(this.datoscom);
  }

  close(): void {
    console.log('Salir de Tipo Cliente');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'LISTA PRECIO' } });
  }

  save(): void {

    if (this.f.valid) {
      const value = this.f.value;
      if (this.datoscom) {
        value.comercializadoraNombre = this.datoscom.nombre;
      }
      this.registro = true;

      Swal.fire({
        icon: 'question',
        text: `Requiere configurar terminal?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: `Guardar`,
        cancelButtonText: `Configurar`,
      }).then(resp => {
        if (resp.value) {
          console.log('Guardar');
          if (this.id !== 'new') {
            value.fechaActualizacion = new Date();
            console.log(value);
            this.cf.editItem('listaprecio', this.id, value).then(() => {
              console.log('Item editado con exito');
              this.toastr.success('Item editado con exito', 'Item Editado', {
                positionClass: 'toast-bottom-right'
              });
              this.registro = false;
              this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'LISTA PRECIO' } });
            }).catch(error => {
              this.loading = false;
              console.log(error);
            });
          } else {
            value.fechaCreacion = new Date();
            this.cf.agregarItem(value, 'listaprecio').then(() => {
              console.log('Item registrado con exito');
              this.toastr.success('Item registrado con exito', 'Item Registrado', {
                positionClass: 'toast-bottom-right'
              });
              this.registro = false;
              this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'LISTA PRECIO' } });
            }).catch(error => {
              this.loading = false;
              console.log(error);
            });
          }
        } else {
          console.log('Configurar');
          value.fechaCreacion = new Date();
          console.log(value);
          if (this.id !== 'new') {
            this.cf.editItem('listaprecio', this.id, value).then(() => {
              console.log('Item editado con exito');
              this.toastr.success('Item editado con exito', 'Item Editado', {
                positionClass: 'toast-bottom-right'
              });
              this.registro = false;
            }).catch(error => {
              this.loading = false;
              console.log(error);
            });
          } else {
            this.cf.agregarItem(value, 'listaprecio').then(r => {
              console.log('Item registrado con exito');
              this.toastr.success('Item registrado con exito', 'Item Registrado', {
                positionClass: 'toast-bottom-right'
              });
              this.registro = false;
            }).catch(error => {
              this.loading = false;
              console.log(error);
            });
          }
          this.router.navigate(['/dashboard/listaprecioterminalproducto'], {
            queryParams: {
              listaprecioId: this.id,
              listaprecioCodigo: value.codigo,
              listaprecioNombre: value.nombre,
              comercializadoraId: value.comercializadoraId,
              comercializadoraNombre: value.comercializadoraNombre,
              tipo: value.tipo,
              estatus: value.estatus
            }
          });
        }
      });

      console.log(value);
    }
  }

}
