import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comercializadora',
  templateUrl: './comercializadora.component.html',
  styleUrls: ['./comercializadora.component.css']
})
export class ComercializadoraComponent implements OnInit {

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
  codCliente: any[] = [];
  activo = false;
  inactivo = false;
  indeterminate = false;
  color = '';
  stylecolor = '';
  labelPosition = 'after';
  abas: any[] = [];
  formapagos: any[] = [];
  areamercadeo: any[] = [];
  direccioninen: any[] = [];
  cfp = false;
  fecha: Date = new Date();
  ces = [
    { estado: 'SI' },
    { estado: 'NO' }
  ];

  eces = [
    { codigo: 'S', nombre: 'SI' },
    { codigo: 'N', nombre: 'NO' }
  ];

  tdpcs = [
    { codigo: 'L', nombre: 'Laborable' },
    { codigo: 'C', nombre: 'Calendario' }
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
    this.getAbas();
    this.getFormaPago();
    this.getAreaMercadeo();
    this.getDireccionInen();
    // this.getItems();
  }

  getAbas(): void {
    this.cf.getItems('abastecedora', 'nombre').subscribe(data => {
      this.abas = [];
      data.forEach((element: any) => {
        this.abas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.abas);
    });
  }

  getAreaMercadeo(): void {
    this.cf.getItems('áreamercadeo', 'nombre').subscribe(data => {
      this.areamercadeo = [];
      data.forEach((element: any) => {
        this.areamercadeo.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.areamercadeo);
    });
  }

  getFormaPago(): void {
    this.cf.getItems('formapago', 'nombre').subscribe(data => {
      this.formapagos = [];
      data.forEach((element: any) => {
        this.formapagos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.formapagos);
    });
  }

  getDireccionInen(): void {
    this.cf.getItems('direccióninen', 'nombre').subscribe(data => {
      this.direccioninen = [];
      data.forEach((element: any) => {
        this.direccioninen.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.direccioninen);
    });
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

  camposFormaPago(fp: any): void {
    if (fp.nombre === 'DEBITO') {
      this.cfp = true;
    } else {
      this.cfp = false;
    }
  }


  getDataItem(): void {
    if (this.id !== 'new') {
      // this.loading = true;
      this.cf.getItemData('comercializadora', this.id).subscribe(data => {
        console.log(data.payload.data());
        this.fecha = new Date(data.payload.data().fechaVencimiento.seconds);
        console.log(this.fecha);
        // this.imgUrl = data.payload.data().imagenUrl;
        this.f.reset({
          codigo: data.payload.data().codigo,
          codigoARCH: data.payload.data().codigoARCH,
          codigoSTC: data.payload.data().codigoSTC,
          claveSTC: data.payload.data().claveSTC,
          ruc: data.payload.data().ruc,
          nombre: data.payload.data().nombre,
          estatus: data.payload.data().estatus,
          contEspecial: data.payload.data().contEspecial,
          // correo1: data.payload.data().correo1,
          // telefono1: data.payload.data().telefono1,
          direccion: data.payload.data().direccion,
          identificacionRL: data.payload.data().identificacionRL,
          nombreRL: data.payload.data().nombreRL,
          nombreCorto: data.payload.data().nombreCorto,
          formaPago: data.payload.data().formaPago,
          areaMercadeo: data.payload.data().areaMercadeo,
          direccionInen: data.payload.data().direccionInen,
          abastecedoraId: data.payload.data().abastecedoraId,
          // segmentoOperacion: data.payload.data().segmentoOperacion,
          tipoDiasPlazo: data.payload.data().tipoDiasPlazo,
          diasPlazoCredito: data.payload.data().diasPlazoCredito,
          cuentaDebitar: data.payload.data().cuentaDebitar,
          codigoBancoDebitar: data.payload.data().codigoBancoDebitar,
          tasaInteresCreditoDias: data.payload.data().tasaInteresCreditoDias,
          fechaVencimiento: this.fecha,
          // datosContactos: data.payload.data().datosContactos
        });
        this.setChange(data.payload.data().estatus);
        const dc = data.payload.data().datosContactos;
        console.log(dc);
        dc.forEach((valor: any) => this.datosContactos.push(this.dataDatoContacto(valor)));
        // this.loading = false;
      });
    }
  }

  agregarDatosContactos(): void {
    this.datosContactos.push(this.crearDatoContacto());
  }

  private crearDatoContacto(): any {
    return this.fb.group({
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
    });
  }

  private dataDatoContacto(valor: any): any {
    return this.fb.group({
      correo: [valor.correo],
      telefono: [valor.telefono],
    });
  }

  eliminarDatoContacto(i: number): void {
    this.datosContactos.removeAt(i);
  }

  get datosContactos(): any {
    return this.f.get('datosContactos') as FormArray;
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

  get nombreCortoNotValid(): any {
    return this.f.get('nombreCorto')?.invalid && this.f.get('nombreCorto')?.touched;
  }

  get formaPagoNotValid(): any {
    return this.f.get('formaPago')?.invalid && this.f.get('formaPago')?.touched;
  }

  get areaMercadeoNotValid(): any {
    return this.f.get('areaMercadeo')?.invalid && this.f.get('areaMercadeo')?.touched;
  }

  get direccionInenNotValid(): any {
    return this.f.get('direccionInen')?.invalid && this.f.get('direccionInen')?.touched;
  }

  get fechaVencimientoNotValid(): any {
    return this.f.get('fechaVencimiento')?.invalid && this.f.get('fechaVencimiento')?.touched;
  }

  get abastecedoraIdNotValid(): any {
    return this.f.get('abastecedoraId')?.invalid && this.f.get('abastecedoraId')?.touched;
  }

  get segmentoOperacionNotValid(): any {
    return this.f.get('segmentoOperacion')?.invalid && this.f.get('segmentoOperacion')?.touched;
  }

  get tipoDiasPlazoNotValid(): any {
    return this.f.get('tipoDiasPlazo')?.invalid && this.f.get('tipoDiasPlazo')?.touched;
  }

  get diasPlazoCreditoNotValid(): any {
    return this.f.get('diasPlazoCredito')?.invalid && this.f.get('diasPlazoCredito')?.touched;
  }

  get cuentaDebitarNotValid(): any {
    return this.f.get('cuentaDebitar')?.invalid && this.f.get('cuentaDebitar')?.touched;
  }

  get codigoBancoDebitarNotValid(): any {
    return this.f.get('codigoBancoDebitar')?.invalid && this.f.get('codigoBancoDebitar')?.touched;
  }

  get tasaInteresCreditoDiasNotValid(): any {
    return this.f.get('tasaInteresCreditoDias')?.invalid && this.f.get('tasaInteresCreditoDias')?.touched;
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
        Validators.minLength(6)
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
      estatus: [''],
      contEspecial: ['', [Validators.required]],
      // correo1: ['', [Validators.required]],
      // telefono1: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      identificacionRL: ['', [Validators.required]],
      nombreRL: ['', [Validators.required]],
      nombreCorto: ['', [Validators.required]],
      formaPago: ['', [Validators.required]],
      areaMercadeo: ['', [Validators.required]],
      direccionInen: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
      abastecedoraId: ['', [Validators.required]],
      // segmentoOperacion: ['', [Validators.required]],
      tipoDiasPlazo: [''],
      diasPlazoCredito: [''],
      cuentaDebitar: [''],
      codigoBancoDebitar: [''],
      tasaInteresCreditoDias: [''],
      datosContactos: this.fb.array([]),
    });

  }

  close(): void {
    console.log('Salir de COMERCIALIZADORA');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'COMERCIALIZADORA' } });
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
        this.cf.editItem('comercializadora', this.id, value).then(() => {
          console.log('Item editado con exito');
          this.toastr.success('Item editado con exito', 'Item Editado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'COMERCIALIZADORA' } });
        }).catch(error => {
          this.loading = false;
          console.log(error);
        });
      } else {
        value.fechaCreacion = new Date();
        this.cf.agregarItem(value, 'comercializadora').then(() => {
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'COMERCIALIZADORA' } });
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
    const fileName = 'TERMINAL-' + this.f.get('nombre')?.value + '' + numram;
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
