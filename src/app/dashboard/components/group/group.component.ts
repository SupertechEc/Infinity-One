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
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  f = new FormGroup({});
  tipo: any[] = [];
  loading = false;
  registro = false;
  msgImage = 'Imagen no seleccionada';
  image$!: Observable<any> | null;
  imageUrl!: string | null;
  imgUrl = '';
  id: string | null;
  btnName = '';

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
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    if (this.id !== null) {
      this.btnName = 'Editar';
    } else {
      this.btnName = 'Agregar';
    }

  }

  ngOnInit(): void {
    // this.upload();
    this.getDataItem();
  }

  getDataItem(): void {
    if (this.id !== null) {
      // this.loading = true;
      this.cf.getItemData('grupos', this.id).subscribe(data => {
        console.log(data);
        this.imgUrl = data.payload.data().imageUrl;
        this.f.setValue({
          name: data.payload.data().name,
          sequence: data.payload.data().sequence,
          status: data.payload.data().status,
          height: data.payload.data().height,
          weight: data.payload.data().weight,
        });
        // this.loading = false;
      });
    }
  }

  get nameNotValid(): any {
    return this.f.get('name')?.invalid && this.f.get('name')?.touched;
  }

  get sequenceNotValid(): any {
    return this.f.get('sequence')?.invalid && this.f.get('sequence')?.touched;
  }

  get statusNotValid(): any {
    return this.f.get('status')?.invalid && this.f.get('status')?.touched;
  }

  get heightNotValid(): any {
    return this.f.get('height')?.invalid && this.f.get('height')?.touched;
  }

  get weightNotValid(): any {
    return this.f.get('weight')?.invalid && this.f.get('weight')?.touched;
  }

  makeForm(): void {
    this.f = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      sequence: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      status: ['', [Validators.required]],
      height: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      weight: ['', [
        Validators.required,
        Validators.min(0)
      ]],
    });

  }

  close(): void {
    console.log('Salir de Grupos');
    this.router.navigate(['/dashboard/lista-grupos']);
  }

  save(): void {
    if (this.f.valid) {
      const value = this.f.value;
      console.log(this.imageUrl);
      if (this.imgUrl.length > 0) {
        value.imageUrl = this.imgUrl;
      } else {
        if (this.imageUrl === undefined) {
          value.imageUrl = '';
        } else {
          value.imageUrl = this.imageUrl;
        }
      }

      this.registro = true;

      if (this.id !== null) {
        value.fechaActualizacion = new Date();
        this.cf.editItem('grupos', this.id, value).then(() => {
          console.log('Item editado con exito');
          this.toastr.success('Item editado con exito', 'Item Editado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/lista-grupos']);
        }).catch(error => {
          this.loading = false;
          console.log(error);
        });
      } else {
        value.fechaCreacion = new Date();
        this.cf.agregarItem(value, 'grupos').then(() => {
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/lista-grupos']);
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
    console.log(file);

    const fileRef = this.afs.ref(file.name);
    const task = this.afs.upload(file.name, file);

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.image$ = fileRef.getDownloadURL();
          this.image$.subscribe(url => {
            this.imageUrl = url;
            console.log(url);
            this.loading = false;
            this.msgImage = 'La imagen ' + this.f.get('name')?.value + ' está cargada';
          });
        })
      )
      .subscribe();
  }

}
