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
  selector: 'app-areamercadeo',
  templateUrl: './areamercadeo.component.html',
  styleUrls: ['./areamercadeo.component.css']
})
export class AreamercadeoComponent implements OnInit {

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
  indeterminate = false;
  color = '';
  stylecolor = '';
  labelPosition = 'after';

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
    // this.upload();
    this.getDataItem();
    // this.getItems();
  }

  // getItems(): void {
  //   // this.cf.getItems('submenús', 'secuencial').subscribe(data => {
  //   //   this.submenus = [];
  //   //   data.forEach((element: any) => {
  //   //     this.submenus.push({
  //   //       id: element.payload.doc.id,
  //   //       ...element.payload.doc.data()
  //   //     });
  //   //   });
  //   //   console.log(this.submenus);
  //   // });
  //   this.codArea = [
  //     { codigo: '01', nombre: 'PRODUCTOS LIMPIOS'},
  //     { codigo: '02', nombre: 'SOLVENT. Y SPRAY OIL'},
  //     { codigo: '03', nombre: 'ASFALTOS'},
  //     { codigo: '04', nombre: 'AERO COMBUSTIBLES'},
  //     { codigo: '05', nombre: 'GAS (L.P.G.)'},
  //     { codigo: '06', nombre: 'PESQUEROS-NAVIEROS'},
  //     { codigo: '09', nombre: 'AZUFRE'}
  //   ];
  // }

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
      // this.loading = true;
      this.cf.getItemData('áreamercadeo', this.id).subscribe(data => {
        console.log(data.payload.data());
        // this.imgUrl = data.payload.data().imagenUrl;
        this.f.setValue({
          nombre: data.payload.data().nombre,
          codigo: data.payload.data().codigo,
          // secuencial: data.payload.data().secuencial,
          estatus: data.payload.data().estatus,
          // accion: data.payload.data().accion
        });
        // this.loading = false;
      });
    }
  }

  get nombreNotValid(): any {
    return this.f.get('nombre')?.invalid && this.f.get('nombre')?.touched;
  }

  get codigoNotValid(): any {
    return this.f.get('codigo')?.invalid && this.f.get('codigo')?.touched;
  }

  // get secuencialNotValid(): any {
  //   return this.f.get('secuencial')?.invalid && this.f.get('secuencial')?.touched;
  // }

  get estatusNotValid(): any {
    return this.f.get('estatus')?.invalid && this.f.get('estatus')?.touched;
  }

  // get accionNotValid(): any {
  //   return this.f.get('accion')?.invalid && this.f.get('accion')?.touched;
  // }

  // get weightNotValid(): any {
  //   return this.f.get('weight')?.invalid && this.f.get('weight')?.touched;
  // }

  makeForm(): void {
    this.f = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      codigo: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      // secuencial: ['', [
      //   Validators.required,
      //   Validators.min(0)
      // ]],
      estatus: ['', [Validators.required]],
      // accion: [false, [Validators.required]],
      // height: ['', [
      //   Validators.required,
      //   Validators.min(0)
      // ]],
      // weight: ['', [
      //   Validators.required,
      //   Validators.min(0)
      // ]],
    });

  }

  close(): void {
    console.log('Salir de ÁREA MERCADEO');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ÁREA MERCADEO' } });
  }

  save(): void {

    if (this.f.valid) {
      const value = this.f.value;
      // console.log(this.imageUrl);

      // if (this.imageUrl === undefined) {

      //   if (this.id !== null) {
      //     value.imagenUrl = this.imgUrl;
      //   } else {
      //     value.imagenUrl = '';
      //   }

      // } else {
      //   value.imagenUrl = this.imageUrl;
      // }

      console.log(value);

      this.registro = true;

      if (this.id !== 'new') {
        value.fechaActualizacion = new Date();
        this.cf.editItem('áreamercadeo', this.id, value).then(() => {
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
        value.fechaCreacion = new Date();
        this.cf.agregarItem(value, 'áreamercadeo').then(() => {
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
      }

      console.log(value);
      // return Object.values(this.f.controls).forEach(control => {
      //   control.markAsTouched();
      // });
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
