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
  selector: 'app-gravamen',
  templateUrl: './gravamen.component.html',
  styleUrls: ['./gravamen.component.css']
})
export class GravamenComponent implements OnInit {

  f = new FormGroup({});
  tipo: any[] = [];
  user: any;
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
  params: any;
  catImprime = [
    { codigo: 'S' },
    { codigo: 'N' }
  ];

  constructor(
    private fb: FormBuilder,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private afs: AngularFireStorage,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private ia: InfinityApiService,
  ) {
    this.makeForm();
    this.aRoute.queryParams.subscribe(params => {
      this.id = params.id;
      this.params = params;
      console.log(params);
      if (this.id !== 'new') {
        this.btnName = 'Editar';
      } else {
        this.btnName = 'Agregar';
      }
    });

  }

  ngOnInit(): void {
    this.getDataItem();
    this.getCom();
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
      const parametros = {
        codigocomercializadora: this.params.codigocomercializadora,
        codigo: this.params.codigo
      }

      this.ia.getItemInfinity('gravamen', parametros).subscribe(
        d => {
          console.log(d.retorno);
          this.f.setValue({
            nombre: d.retorno[0].nombre,
            codigo: d.retorno[0].gravamenPK.codigo,
            comercializadoraId: d.retorno[0].gravamenPK.codigocomercializadora,
            estatus: d.retorno[0].activo,
            imprime: d.retorno[0].seimprime,
            formula: d.retorno[0].formulavalor,
            valorDefecto: d.retorno[0].valordefecto
          });
        },
        err => console.log('HTTP Error', err),
      );
    }

  }

  getCom(): void {
    this.cf.getItems('comercializadora', 'nombre').subscribe(data => {
      console.log('ale', data);
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

  get comercializadoraIdNotValid(): any {
    return this.f.get('comercializadoraId')?.invalid && this.f.get('comercializadoraId')?.touched;
  }

  get imprimeNotValid(): any {
    return this.f.get('imprime')?.invalid && this.f.get('imprime')?.touched;
  }

  get formulaNotValid(): any {
    return this.f.get('formula')?.invalid && this.f.get('formula')?.touched;
  }

  get valorDefectoNotValid(): any {
    return this.f.get('valorDefecto')?.invalid && this.f.get('valorDefecto')?.touched;
  }

  get secuencialNotValid(): any {
    return this.f.get('secuencial')?.invalid && this.f.get('secuencial')?.touched;
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
      estatus: ['', [Validators.required]],
      comercializadoraId: ['', [Validators.required]],
      imprime: ['', [Validators.required]],
      formula: ['', [Validators.required]],
      valorDefecto: ['', [Validators.required]],
      // secuencial: ['', [Validators.required]],
    });

  }

  close(): void {
    console.log('Salir de Tipo Cliente');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'GRAVAMEN' } });
  }

  save(): void {
    this.user = this.local.get('user');
    console.log(this.user);

    if (this.f.valid) {
      const value = this.f.value;
      value.usuarioactual = this.user.email;
      console.log(value);

      this.registro = true;
      const gravamen = {
        gravamenPK: {
          codigocomercializadora: value.comercializadoraId,
          codigo: value.codigo
        },
        nombre: value.nombre,
        activo: value.estatus,
        seimprime: value.imprime,
        formulavalor: value.formula,
        valordefecto: value.valorDefecto,
        usuarioactual: value.usuarioactual
      }

      if (this.id !== 'new') {
        this.editItems(gravamen, this.id, 'gravamen', 'postgres');
      } else {
        this.addItems('gravamen', gravamen, 'postgres');
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'GRAVAMEN' } });
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    } else {
      this.ia.addDataTable(table, items, 2).subscribe(
        d => {
          console.log(d);
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'GRAVAMEN' } });
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'GRAVAMEN' } });
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
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'GRAVAMEN' } });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

}
