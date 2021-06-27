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
  selector: 'app-accion',
  templateUrl: './accion.component.html',
  styleUrls: ['./accion.component.css']
})
export class AccionComponent implements OnInit {

  f = new FormGroup({});
  tipo: any[] = [];
  loading = false;
  registro = false;
  msgImage = 'Imagen no seleccionada';
  image$!: Observable<any> | null;
  imageUrl!: string | null;
  imgUrl = '';
  id = '';
  btnName = '';
  submenus: any[] = [];

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
    this.getItems();
  }

  getItems(): void {
    this.cf.getItems('submenús', 'secuencial').subscribe(data => {
      this.submenus = [];
      data.forEach((element: any) => {
        this.submenus.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.submenus);
    });
  }

  getDataItem(): void {
    if (this.id !== 'new') {
      // this.loading = true;
      this.cf.getItemData('acciones', this.id).subscribe(data => {
        console.log(data.payload.data());
        this.imgUrl = data.payload.data().imagenUrl;
        this.f.setValue({
          nombre: data.payload.data().nombre,
          submenuId: data.payload.data().submenuId,
          secuencial: data.payload.data().secuencial,
          estatus: data.payload.data().estatus,
          accion: data.payload.data().accion
        });
        // this.loading = false;
      });
    }
  }

  get nombreNotValid(): any {
    return this.f.get('nombre')?.invalid && this.f.get('nombre')?.touched;
  }

  get menuIdNotValid(): any {
    return this.f.get('menuId')?.invalid && this.f.get('menuId')?.touched;
  }

  get secuencialNotValid(): any {
    return this.f.get('secuencial')?.invalid && this.f.get('secuencial')?.touched;
  }

  get estatusNotValid(): any {
    return this.f.get('estatus')?.invalid && this.f.get('estatus')?.touched;
  }

  get accionNotValid(): any {
    return this.f.get('accion')?.invalid && this.f.get('accion')?.touched;
  }

  // get weightNotValid(): any {
  //   return this.f.get('weight')?.invalid && this.f.get('weight')?.touched;
  // }

  makeForm(): void {
    this.f = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      submenuId: ['', Validators.required],
      secuencial: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      estatus: ['', [Validators.required]],
      accion: [false, [Validators.required]],
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
    console.log('Salir de ACCIONES');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ACCIONES' } });
  }

  save(): void {

    if (this.f.valid) {
      const value = this.f.value;
      console.log(this.imageUrl);

      if (this.imageUrl === undefined) {

        if (this.id !== null) {
          value.imagenUrl = this.imgUrl;
        } else {
          value.imagenUrl = '';
        }

      } else {
        value.imagenUrl = this.imageUrl;
      }

      console.log(value);

      this.registro = true;

      if (this.id !== 'new') {
        value.fechaActualizacion = new Date();
        this.cf.editItem('acciones', this.id, value).then(() => {
          console.log('Item editado con exito');
          this.toastr.success('Item editado con exito', 'Item Editado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ACCIONES' } });
        }).catch(error => {
          this.loading = false;
          console.log(error);
        });
      } else {
        value.fechaCreacion = new Date();
        this.cf.agregarItem(value, 'acciones').then(() => {
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'ACCIONES' } });
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

  uploadFile(event: any): void {
    this.loading = true;
    const file = event.target.files[0];

    const numram = Math.random() * this.f.get('secuencial')?.value;
    const fileName = 'ACCION-' + this.f.get('nombre')?.value + '' + numram;
    console.log(fileName);

    const fileRef = this.afs.ref(fileName);
    const task = this.afs.upload(fileName, file);

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.image$ = fileRef.getDownloadURL();
          this.image$.subscribe(url => {
            this.imageUrl = url;
            console.log(url);
            this.loading = false;
            this.msgImage = 'La imagen ' + fileName + ' está cargada';
          });
        })
      )
      .subscribe();
  }
}
