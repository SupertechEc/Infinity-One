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

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

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
  user = this.local.get('user');
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
  //   this.codTer = [
  //     { codigo: '02', nombre: 'TERM. EL BEATERIO' },
  //     { codigo: '04', nombre: 'TERMINAL AMBATO' },
  //     { codigo: '06', nombre: 'TERM. CHAULLABAMBA' },
  //     { codigo: '07', nombre: 'TERMINAL ESMERALDAS' },
  //     { codigo: '08', nombre: 'TERMINAL MANTA' }
  //   ];
  // }

  getDataItem(): void {
    debugger;
    if (this.id !== 'new') {

      console.log(this.id);
      console.log(this.params);

      const parametros = {
        codigo: this.params.codigo
      }

      this.ia.getItemInfinity('terminal', parametros).subscribe(
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

  // get secuencialNotValid(): any {
  //   return this.f.get('secuencial')?.invalid && this.f.get('secuencial')?.touched;
  // }

  get estatusNotValid(): any {
    return this.f.get('activo')?.invalid && this.f.get('activo')?.touched;
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
      activo: ['', [Validators.required]],
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
    console.log('Salir de TERMINAL');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'TERMINAL' } });
  }

  save(): void {
    debugger;
    if (this.f.valid) {
      const value = this.f.value;
      console.log(value);
      this.registro = true;
      if (this.id !== 'new') {
        this.editItems(value, this.id, 'terminal', 'postgres');
      } else {
        this.addItems('terminal', value, 'postgres');
      }
      console.log(value);
    }
  }

  addItems(table: string, items: any, tipo: string): void {
    debugger;
    if (tipo === 'firebase') {
      items.fechaCreacion = new Date();
      this.cf.agregarItem(items, table).then(() => {
        console.log('Item registrado con exito');
        this.toastr.success('Item registrado con exito', 'Item Registrado', {
          positionClass: 'toast-bottom-right'
        });
        this.registro = false;
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'TERMINAL' } });
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
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'TERMINAL' } });
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'TERMINAL' } });
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
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'TERMINAL' } });
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
