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
import { InfinityApiService } from 'src/app/core/services/infinity-api.service';

@Component({
  selector: 'app-listaprecio',
  templateUrl: './listaprecio.component.html',
  styleUrls: ['./listaprecio.component.css']
})
export class ListaprecioComponent implements OnInit {

  f = new FormGroup({});
  g = new FormGroup({});
  // tipo: any[] = [];
  loading = false;
  registro = false;
  id = '';
  cod = '';
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
  user = this.local.get('user');
  params: any;
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
    private aRoute: ActivatedRoute,
    private ia: InfinityApiService
  ) {
    this.makeForm();
    this.aRoute.queryParams.subscribe(params => {
      this.id = params.id;
      this.params = params;
      //this.cod = params.cod;
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
      console.log(this.id);
      console.log(this.params);

      const parametros = {
        codigocomercializadora: this.params.codigocomercializadora,
        codigo: this.params.codigo
      } 

      this.ia.getItemInfinity('listaprecio', parametros) .subscribe(
        d => {
          console.log(d.retorno);
          this.f.setValue({
            nombre: d.retorno[0].nombre, 
            codigo: d.retorno[0].listaprecioPK.codigo,
            activo: d.retorno[0].activo,
            codigocomercializadora: d.retorno[0].listaprecioPK.codigocomercializadora,
            tipo: d.retorno[0].tipo,
          });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

  getComercializadora(): void {
    this.ia.getTableInfinity('comercializadora').subscribe(
      d => {
        console.log(d.retorno);
        this.comercializadora = d.retorno;
      },
      err => console.log('HTTP Error', err),
    );
  }

  get nombreNotValid(): any {
    return this.f.get('nombre')?.invalid && this.f.get('nombre')?.touched;
  }

  get codigoNotValid(): any {
    return this.f.get('codigo')?.invalid && this.f.get('codigo')?.touched;
  }

  get estatusNotValid(): any {
    return this.f.get('activo')?.invalid && this.f.get('activo')?.touched;
  }

  get fechaNotValid(): any {
    return this.f.get('fecha')?.invalid && this.f.get('fecha')?.touched;
  }

  get comercializadoraIdNotValid(): any {
    return this.f.get('codigocomercializadora')?.invalid && this.f.get('codigocomercializadora')?.touched;
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
      activo: [false, [Validators.required]],
      codigocomercializadora: ['', [Validators.required]],
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
    debugger;
    if (this.f.valid) {
      const value = this.f.value;
      value.usuarioactual = this.user.email;
      this.registro = true;
      const listaprecio = {
        listaprecioPK: {
          codigocomercializadora: value.codigocomercializadora,
          codigo: value.codigo
        },
        nombre: value.nombre,
        activo: value.activo,
        tipo: value.tipo,
        usuarioactual: value.usuarioactual
      }

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
            this.editItems(listaprecio, this.id, 'listaprecio', 'postgres');
          } else {
            this.addItems('listaprecio', listaprecio, 'postgres');
          }
        } else {
          console.log('Configurar');
          console.log(value);
          if (this.id !== 'new') {
            this.editItems(listaprecio, this.id, 'listaprecio', 'postgres');
          } else {
            this.addItems('listaprecio', listaprecio, 'postgres');
          }
          this.router.navigate(['/dashboard/listaprecioterminalproducto'], {
            queryParams: {
              listaprecioId: this.id,
              listaprecioCodigo: value.codigo,
              listaprecioNombre: value.nombre,
              codigocomercializadora: value.codigocomercializadora,
              comercializadoraNombre: value.comercializadoraNombre,
              tipo: value.tipo,
              activo: value.activo
            }
          });
        }
      });

      console.log(value);
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'LISTA PRECIO' } });
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    } else {
      items.usuarioactual = this.user.email;
      this.ia.addDataTable(table, items, 2).subscribe(
        d => {
          console.log(d);
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'LISTA PRECIO' } });
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'LISTA PRECIO' } });
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
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'LISTA PRECIO' } });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

}
