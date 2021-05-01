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
  selector: 'app-numeracion',
  templateUrl: './numeracion.component.html',
  styleUrls: ['./numeracion.component.css']
})
export class NumeracionComponent implements OnInit {

  f = new FormGroup({});
  tipo: any[] = [];
  loading = false;
  registro = false;
  id = '';
  btnName = '';
  comercializadora: any[] = [];
  activo = false;
  inactivo = false;
  indeterminate = false;
  color = '';
  stylecolor = '';
  labelPosition = 'after';
  tds = [
    { codigo: 'FAC', nombre: 'FACTURA' },
    { codigo: 'NPE', nombre: 'NOTA DE PEDIDO' },
    { codigo: 'NDB', nombre: 'NOTA DE DÉBITO' },
    { codigo: 'NCR', nombre: 'NOTA DE CRÉDITO' },
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
    // this.aRoute.queryParams.subscribe(params => {
    //   this.id = params.id;
    //   console.log(this.id);
    //   if (this.id !== 'new') {
    //     this.btnName = 'Editar';
    //   } else {
    //     this.btnName = 'Agregar';
    //   }
    // });
    this.btnName = 'Agregar';

  }

  ngOnInit(): void {
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

  get comercializadoraIdNotValid(): any {
    return this.f.get('comercializadoraId')?.invalid && this.f.get('comercializadoraId')?.touched;
  }

  get tipoDocumentoNotValid(): any {
    return this.f.get('tipoDocumento')?.invalid && this.f.get('tipoDocumento')?.touched;
  }

  get estatusNotValid(): any {
    return this.f.get('estatus')?.invalid && this.f.get('estatus')?.touched;
  }

  get ultimoNumeroNotValid(): any {
    return this.f.get('ultimoNumero')?.invalid && this.f.get('ultimoNumero')?.touched;
  }

  makeForm(): void {
    this.f = this.fb.group({
      comercializadoraId: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      estatus: [false, [Validators.required]],
      ultimoNumero: [0, [Validators.required]],
    });

  }

  close(): void {
    console.log('Salir de Numeración');
    this.router.navigate(['/dashboard']);
  }

  save(): void {

    if (this.f.valid) {
      const value = this.f.value;

      console.log(value);

      this.registro = true;

      value.fechaCreacion = new Date();
      this.cf.agregarItem(value, 'numeracion').then(() => {
        console.log('Item ingresado con exito');
        this.toastr.success('Item ingresado con exito', 'Item Ingresado', {
          positionClass: 'toast-bottom-right'
        });
        this.registro = false;
        // this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'TERMINAL' } });
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });

      console.log(value);
    }
  }

}
