import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { InfinityApiService } from '../../../core/services/infinity-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-areamercadeo',
  templateUrl: './areamercadeo.component.html',
  styleUrls: ['./areamercadeo.component.css']
})
export class AreamercadeoComponent implements OnInit {

  f = new FormGroup({});
  tipo: any[] = [];
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
  user = this.local.get('user');
  params: any;

  constructor(
    private fb: FormBuilder,
    private cf: ConectionFirebaseService,
    private ia: InfinityApiService,
    private local: LocalstorageService,
    private afs: AngularFireStorage,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute
  ) {
    this.makeForm();
    this.aRoute.queryParams.subscribe(params => {
      this.id = params.id;
      this.params = params;
      console.log(this.id);
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
    // this.getItems();
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
        codigo: this.params.codigo
      }

      this.ia.getItemInfinity('areamercadeo', parametros).subscribe(
        d => {
          console.log(d.retorno);
          this.f.setValue({
            codigo: d.retorno[0].codigo,
            nombre: d.retorno[0].nombre,
            activo: d.retorno[0].activo,
          });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

  get nombreNotValid(): any {
    return this.f.get('nombre')?.invalid && this.f.get('nombre')?.touched;
  }

  get codigoNotValid(): any {
    return this.f.get('codigo')?.invalid && this.f.get('codigo')?.touched;
  }

  get activoNotValid(): any {
    return this.f.get('activo')?.invalid && this.f.get('activo')?.touched;
  }

  makeForm(): void {
    this.f = this.fb.group({
      codigo: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      activo: ['', [Validators.required]],
    });

  }

  close(): void {
    console.log('Salir de ÁREA MERCADEO');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ÁREA MERCADEO' } });
  }

  save(): void {

    if (this.f.valid) {
      const value = this.f.value;
      console.log(value);
      this.registro = true;
      if (this.id !== 'new') {
        // this.editItems('áreamercadeo', this.id, value, 'firebase');
        this.editItems(value, this.id, 'areamercadeo', 'postgres');
      } else {
        // this.addItems('áreamercadeo', value, 'firebase');
        this.addItems('areamercadeo', value, 'postgres');
      }
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ÁREA MERCADEO' } });
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    } else {
      items.usuarioactual = this.user.email;
      this.ia.addDataTable(table, items, 1).subscribe(
        d => {
          console.log(d);
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ÁREA MERCADEO' } });
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ÁREA MERCADEO' } });
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
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ÁREA MERCADEO' } });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

}
