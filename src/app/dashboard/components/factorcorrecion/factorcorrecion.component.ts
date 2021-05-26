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
  selector: 'app-factorcorrecion',
  templateUrl: './factorcorrecion.component.html',
  styleUrls: ['./factorcorrecion.component.css']
})
export class FactorcorrecionComponent implements OnInit {

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
  terminal: any[] = [];
  producto: any[] = [];

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
    this.getTerminal();
    this.getProducto();
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
      this.cf.getItemData('factorcorrección', this.id).subscribe(data => {
        console.log(data.payload.data());
        this.f.setValue({
          nombre: data.payload.data().nombre,
          codigo: data.payload.data().codigo,
          estatus: data.payload.data().estatus,
          fecha: data.payload.data().fecha,
          terminalId: data.payload.data().terminalId,
          productoId: data.payload.data().productoId,
          factorCorrecion: data.payload.data().factorCorrecion,
        });
        this.setChange(data.payload.data().estatus);
        // this.loading = false;
      });
    }
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

  getProducto(): void {
    this.cf.getItems('producto', 'nombre').subscribe(data => {
      this.producto = [];
      data.forEach((element: any) => {
        this.producto.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.producto);
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

  get terminalIdNotValid(): any {
    return this.f.get('terminalId')?.invalid && this.f.get('terminalId')?.touched;
  }

  get productoIdNotValid(): any {
    return this.f.get('productoId')?.invalid && this.f.get('productoId')?.touched;
  }

  get factorCorrecionNotValid(): any {
    return this.f.get('factorCorrecion')?.invalid && this.f.get('factorCorrecion')?.touched;
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
      fecha: ['', [Validators.required]],
      terminalId: ['', [Validators.required]],
      productoId: ['', [Validators.required]],
      factorCorrecion: ['', [Validators.required]],
    });

  }

  close(): void {
    console.log('Salir de Tipo Cliente');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'FACTOR CORRECCIÓN' } });
  }

  save(): void {

    if (this.f.valid) {
      const value = this.f.value;
      console.log(value);

      this.registro = true;

      if (this.id !== 'new') {
        value.fechaActualizacion = new Date();
        this.cf.editItem('factorcorrección', this.id, value).then(() => {
          console.log('Item editado con exito');
          this.toastr.success('Item editado con exito', 'Item Editado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'FACTOR CORRECCIÓN' } });
        }).catch(error => {
          this.loading = false;
          console.log(error);
        });
      } else {
        value.fechaCreacion = new Date();
        this.cf.agregarItem(value, 'factorcorrección').then(() => {
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'FACTOR CORRECCIÓN' } });
        }).catch(error => {
          this.loading = false;
          console.log(error);
        });
      }

      console.log(value);
    }
  }

}
