import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InfinityApiService } from 'src/app/core/services/infinity-api.service';
import { element } from 'protractor';

@Component({
  selector: 'app-abastecedora',
  templateUrl: './abastecedora.component.html',
  styleUrls: ['./abastecedora.component.css']
})
export class AbastecedoraComponent implements OnInit {

  f = new FormGroup({});
  tipo: any[] = [];
  loading = false;
  registro = false;
  // msgImage = 'Imagen no seleccionada';
  // image$!: Observable<any> | null;
  // imageUrl!: string | null;
  // imgUrl = '';
  id = '';
  btnName = '';
  codCliente: any[] = [];
  activo = false;
  inactivo = false;
  activoC = false;
  inactivoC = false;
  indeterminate = false;
  color = '';
  stylecolor = '';
  labelPosition = 'after';
  ces = [
    { estado: 'Si' },
    { estado: 'No' }
  ];
  user = this.local.get('user');
  items = [];
  params: any;

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

  setChangeEstado(cambio: boolean): any {
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

      this.ia.getItemInfinity('abastecedora', parametros).subscribe(
        d => {
          console.log(d.retorno);
          this.f.setValue({
            codigo: d.retorno[0].codigo,
            codigoarch: d.retorno[0].codigoarch,
            codigostc: d.retorno[0].codigostc,
            clavestc: d.retorno[0].clavestc,
            ruc: d.retorno[0].ruc,
            nombre: d.retorno[0].nombre,
            activo: d.retorno[0].activo,
            escontribuyenteespacial: d.retorno[0].escontribuyenteespacial,
            correo1: d.retorno[0].correo1,
            telefono1: d.retorno[0].telefono1,
            direccion: d.retorno[0].direccion,
            identificacionrepresentantelega: d.retorno[0].identificacionrepresentantelega,
            nombrerepresentantelegal: d.retorno[0].nombrerepresentantelegal
          });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

  get codigoNotValid(): any {
    return this.f.get('codigo')?.invalid && this.f.get('codigo')?.touched;
  }

  get codigoARCHNotValid(): any {
    return this.f.get('codigoarch')?.invalid && this.f.get('codigoarch')?.touched;
  }

  get codigoSTCNotValid(): any {
    return this.f.get('codigostc')?.invalid && this.f.get('codigostc')?.touched;
  }

  get claveSTCNotValid(): any {
    return this.f.get('clavestc')?.invalid && this.f.get('clavestc')?.touched;
  }

  get rucNotValid(): any {
    return this.f.get('ruc')?.invalid && this.f.get('ruc')?.touched;
  }

  get nombreNotValid(): any {
    return this.f.get('nombre')?.invalid && this.f.get('nombre')?.touched;
  }

  get estatusNotValid(): any {
    return this.f.get('activo')?.invalid && this.f.get('activo')?.touched;
  }

  get contEspecialNotValid(): any {
    return this.f.get('escontribuyenteespacial')?.invalid && this.f.get('escontribuyenteespacial')?.touched;
  }

  get correo1NotValid(): any {
    return this.f.get('correo1')?.invalid && this.f.get('correo1')?.touched;
  }

  get telefono1NotValid(): any {
    return this.f.get('telefono1')?.invalid && this.f.get('telefono1')?.touched;
  }

  get direccionNotValid(): any {
    return this.f.get('direccion')?.invalid && this.f.get('direccion')?.touched;
  }

  get identificacionRLNotValid(): any {
    return this.f.get('identificacionrepresentantelega')?.invalid && this.f.get('identificacionrepresentantelega')?.touched;
  }

  get nombreRLNotValid(): any {
    return this.f.get('nombrerepresentantelegal')?.invalid && this.f.get('nombrerepresentantelegal')?.touched;
  }

  makeForm(): void {
    this.f = this.fb.group({
      codigo: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      codigoarch: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      codigostc: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      clavestc: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      ruc: ['', [
        Validators.required,
        Validators.minLength(13)
      ]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      activo: ['', [Validators.required]],
      escontribuyenteespacial: ['', [Validators.required]],
      correo1: ['', [Validators.required]],
      telefono1: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      identificacionrepresentantelega: ['', [Validators.required]],
      nombrerepresentantelegal: ['', [Validators.required]]
    });

  }

  close(): void {
    console.log('Salir de ABASTECEDORA');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ABASTECEDORA' } });
  }

  save(): void {

    if (this.f.valid) {
      const value = this.f.value;
      console.log(value);
      this.registro = true;
      if (this.id !== 'new') {
         // this.editItems('abastecedora', this.id, value, 'firebase');
         this.editItems(value, this.id, 'abastecedora', 'postgres');
      } else {
        // this.addItems('abastecedora', value, 'firebase');
        this.addItems('abastecedora', value, 'postgres');
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ABASTECEDORA' } });
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
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ABASTECEDORA' } });
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ABASTECEDORA' } });
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
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ABASTECEDORA' } });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

  // uploadFile(event: any): void {
  //   this.loading = true;
  //   const file = event.target.files[0];

  //   const numram = Math.random() * this.f.get('secuencial')?.value;
  //   const fileName = 'TERMINAL-' + this.f.get('nombre')?.value + '' + numram;
  //   console.log(fileName);

  //   const fileRef = this.afs.ref(fileName);
  //   const task = this.afs.upload(fileName, file);

  //   task.snapshotChanges()
  //     .pipe(
  //       finalize(() => {
  //         this.image$ = fileRef.getDownloadURL();
  //         this.image$.subscribe(url => {
  //           this.imageUrl = url;
  //           console.log(url);
  //           this.loading = false;
  //           this.msgImage = 'La imagen ' + fileName + ' está cargada';
  //         });
  //       })
  //     )
  //     .subscribe();
  // }

}
