import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rubros',
  templateUrl: './rubros.component.html',
  styleUrls: ['./rubros.component.css']
})

export class RubrosComponent implements OnInit {
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
      this.cf.getItemData('gravamen', this.id).subscribe(data => {
        console.log(data.payload.data());
        this.f.setValue({
          nombre: data.payload.data().nombre,
          codigo: data.payload.data().codigo,
          estatus: data.payload.data().estatus,
          comercializadoraId: data.payload.data().comercializadoraId,
          imprime: data.payload.data().imprime,
          formula: data.payload.data().formula,
          valorDefecto: data.payload.data().valorDefecto,
          secuencial: data.payload.data().secuencial,
        });
        this.setChange(data.payload.data().estatus);
        // this.loading = false;
      });
    }
  }

  getCom(): void {
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
      secuencial: ['', [Validators.required]],
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

      if (this.id !== 'new') {
        value.fechaActualizacion = new Date();
        this.cf.editItem('gravamen', this.id, value).then(() => {
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
        value.fechaCreacion = new Date();
        this.cf.agregarItem(value, 'gravamen').then(() => {
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
      }

      console.log(value);
    }
  }
}
