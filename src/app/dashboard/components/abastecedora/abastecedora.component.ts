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
  indeterminate = false;
  color = '';
  stylecolor = '';
  labelPosition = 'after';
  ces = [
    { estado: 'SI' },
    { estado: 'NO' }
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
      // this.loading = true;
      this.cf.getItemData('abastecedora', this.id).subscribe(data => {
        console.log(data.payload.data());
        // this.imgUrl = data.payload.data().imagenUrl;
        this.f.setValue({
          codigo: data.payload.data().codigo,
          codigoARCH: data.payload.data().codigoARCH,
          codigoSTC: data.payload.data().codigoSTC,
          claveSTC: data.payload.data().claveSTC,
          ruc: data.payload.data().ruc,
          nombre: data.payload.data().nombre,
          estatus: data.payload.data().estatus,
          contEspecial: data.payload.data().contEspecial,
          correo1: data.payload.data().correo1,
          telefono1: data.payload.data().telefono1,
          direccion: data.payload.data().direccion,
          identificacionRL: data.payload.data().identificacionRL,
          nombreRL: data.payload.data().nombreRL
        });
        this.setChange(data.payload.data().estatus);
        // this.loading = false;
      });
    }
  }

  get codigoNotValid(): any {
    return this.f.get('codigo')?.invalid && this.f.get('codigo')?.touched;
  }

  get codigoARCHNotValid(): any {
    return this.f.get('codigoARCH')?.invalid && this.f.get('codigoARCH')?.touched;
  }

  get codigoSTCNotValid(): any {
    return this.f.get('codigoSTC')?.invalid && this.f.get('codigoSTC')?.touched;
  }

  get claveSTCNotValid(): any {
    return this.f.get('claveSTC')?.invalid && this.f.get('claveSTC')?.touched;
  }

  get rucNotValid(): any {
    return this.f.get('ruc')?.invalid && this.f.get('ruc')?.touched;
  }

  get nombreNotValid(): any {
    return this.f.get('nombre')?.invalid && this.f.get('nombre')?.touched;
  }

  get estatusNotValid(): any {
    return this.f.get('estatus')?.invalid && this.f.get('estatus')?.touched;
  }

  get contEspecialNotValid(): any {
    return this.f.get('contEspecial')?.invalid && this.f.get('contEspecial')?.touched;
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
    return this.f.get('identificacionRL')?.invalid && this.f.get('identificacionRL')?.touched;
  }

  get nombreRLNotValid(): any {
    return this.f.get('nombreRL')?.invalid && this.f.get('nombreRL')?.touched;
  }

  makeForm(): void {
    this.f = this.fb.group({
      codigo: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      codigoARCH: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      codigoSTC: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      claveSTC: ['', [
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
      estatus: ['', [Validators.required]],
      contEspecial: ['', [Validators.required]],
      correo1: ['', [Validators.required]],
      telefono1: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      identificacionRL: ['', [Validators.required]],
      nombreRL: ['', [Validators.required]]
    });

  }

  close(): void {
    console.log('Salir de ABASTECEDORA');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ABASTECEDORA' } });
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
        this.cf.editItem('abastecedora', this.id, value).then(() => {
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
        value.fechaCreacion = new Date();
        this.cf.agregarItem(value, 'abastecedora').then(() => {
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
