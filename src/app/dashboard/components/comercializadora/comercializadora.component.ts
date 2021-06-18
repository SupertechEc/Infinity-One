import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InfinityApiService } from 'src/app/core/services/infinity-api.service';

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
  banco: any[] = [];
  cfp = false;
  fecha: Date = new Date();
  fechaIn: Date = new Date();
  user = this.local.get('user');
  params: any;
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

  contabilidad = [
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
    this.getAbas();
    this.getFormaPago();
    this.getAreaMercadeo();
    this.getDireccionInen();
    this.getBanco();
    // this.getItems();
  }

  getAbas(): void {
    this.ia.getTableInfinity('abastecedora').subscribe(data => {
      this.abas = data.retorno;
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
    this.ia.getTableInfinity('formapago').subscribe(data => {
      this.formapagos = data.retorno;
    });
  }

  getBanco(): void {
    this.ia.getTableInfinity('banco').subscribe(data => {
      this.banco = data.retorno;
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
    if (fp.nombre === 'Débito Bancario') {
      this.cfp = true;
    } else {
      this.cfp = false;
    }
  }

  getDataItem(): void {
    if (this.id !== 'new') {
      console.log(this.id);
      console.log(this.params);

      const parametros = {
        codigo: this.params.codigo
      }

      this.ia.getItemInfinity('comercializadora', parametros).subscribe(
        d => {
          this.fecha = new Date(d.retorno[0].fechavencimientocontr);
          this.fechaIn = new Date(d.retorno[0].fehainiciocontrato);
          console.log(d.retorno);
          this.f.setValue({
            codigoabastecedora: d.retorno[0].codigoabastecedora.codigo,
            codigo: d.retorno[0].codigo,
            codigoarch: d.retorno[0].codigoarch,
            codigostc: d.retorno[0].codigostc,
            clavestc: d.retorno[0].clavestc,
            ruc: d.retorno[0].ruc,
            nombre: d.retorno[0].nombre,
            activo: d.retorno[0].activo,
            escontribuyenteespacial: d.retorno[0].escontribuyenteespacial,
            // correo1: data.payload.data().correo1,
            // telefono1: data.payload.data().telefono1,
            direccion: d.retorno[0].direccion,
            identificacionrepresentantelega: d.retorno[0].identificacionrepresentantelega,
            nombrerepresentantelegal: d.retorno[0].nombrerepresentantelegal,
            nombrecorto: d.retorno[0].nombrecorto,
            establecimientofac: d.retorno[0].establecimientofac,
            establecimientondb: d.retorno[0].establecimientondb,
            establecimientoncr: d.retorno[0].establecimientoncr,
            puntoventandb: d.retorno[0].puntoventandb,
            puntoventancr: d.retorno[0].puntoventancr,
            puntoventafac: d.retorno[0].puntoventafac,
            fechavencimientocontr: this.fecha,
            fehainiciocontrato: this.fechaIn,
            prefijonpe: d.retorno[0].prefijonpe,
            clavewsepp: d.retorno[0].clavewsepp,
            obligadocontabilidad: d.retorno[0].obligadocontabilidad,
            esagenteretencion: d.retorno[0].esagenteretencion,
            leyendaagenteretencion: d.retorno[0].leyendaagenteretencion,
            ambientesri: d.retorno[0].ambientesri,
            tipoemision: d.retorno[0].tipoemision,
            tipoplazocredito: d.retorno[0].tipoplazocredito,
            diasplazocredito: d.retorno[0].diasplazocredito,
            cuentadebito: d.retorno[0].cuentadebito,
            tipocuentadebito: d.retorno[0].tipocuentadebito,
            codigobancodebito: d.retorno[0].codigobancodebito.codigo,
            tasainteres: d.retorno[0].tasainteres,
            // formaPago: d.retorno[0].formaPago,
          });
        },
        err => console.log('HTTP Error', err),
      );
    }
  }

  agregarDatosContactos(): void {
    this.datosContactos.push(this.crearDatoContacto());
  }

  private crearDatoContacto(): any {
    return this.fb.group({
      correo1: ['', [Validators.required]],
      telefono1: ['', [Validators.required]],
    });
  }

  private dataDatoContacto(valor: any): any {
    return this.fb.group({
      correo1: [valor.correo],
      telefono1: [valor.telefono],
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

  get nombreCortoNotValid(): any {
    return this.f.get('nombrecorto')?.invalid && this.f.get('nombrecorto')?.touched;
  }

  get formaPagoNotValid(): any {
    return this.f.get('formaPago')?.invalid && this.f.get('formaPago')?.touched;
  }

  get areaMercadeoNotValid(): any {
    return this.f.get('areaMercadeo')?.invalid && this.f.get('areaMercadeo')?.touched;
  }

  get establecimientoFacNotValid(): any {
    return this.f.get('establecimientofac')?.invalid && this.f.get('establecimientofac')?.touched;
  }

  get establecimientoDbNotValid(): any {
    return this.f.get('establecimientondb')?.invalid && this.f.get('establecimientondb')?.touched;
  }

  get establecimientoCrNotValid(): any {
    return this.f.get('establecimientoncr')?.invalid && this.f.get('establecimientoncr')?.touched;
  }

  get puntoVentaFacNotValid(): any {
    return this.f.get('puntoventafac')?.invalid && this.f.get('puntoventafac')?.touched;
  }

  get puntoVentaDbNotValid(): any {
    return this.f.get('puntoventandb')?.invalid && this.f.get('puntoventandb')?.touched;
  }

  get puntoVentaCrNotValid(): any {
    return this.f.get('puntoventancr')?.invalid && this.f.get('puntoventancr')?.touched;
  }

  get direccionInenNotValid(): any {
    return this.f.get('direccionInen')?.invalid && this.f.get('direccionInen')?.touched;
  }

  get fechaVencimientoNotValid(): any {
    return this.f.get('fechavencimientocontr')?.invalid && this.f.get('fechavencimientocontr')?.touched;
  }

  get fechaInicioNotValid(): any {
    return this.f.get('fehainiciocontrato')?.invalid && this.f.get('fehainiciocontrato')?.touched;
  }

  get abastecedoraIdNotValid(): any {
    return this.f.get('codigoabastecedora')?.invalid && this.f.get('codigoabastecedora')?.touched;
  }

  get segmentoOperacionNotValid(): any {
    return this.f.get('segmentoOperacion')?.invalid && this.f.get('segmentoOperacion')?.touched;
  }

  get tipoDiasPlazoNotValid(): any {
    return this.f.get('tipoplazocredito')?.invalid && this.f.get('tipoplazocredito')?.touched;
  }

  get diasPlazoCreditoNotValid(): any {
    return this.f.get('diasplazocredito')?.invalid && this.f.get('diasplazocredito')?.touched;
  }

  get cuentaDebitarNotValid(): any {
    return this.f.get('cuentadebito')?.invalid && this.f.get('cuentadebito')?.touched;
  }

  get tipoCuentaDebitoNotValid(): any {
    return this.f.get('tipocuentadebito')?.invalid && this.f.get('tipocuentadebito')?.touched;
  }

  get codigoBancoDebitarNotValid(): any {
    return this.f.get('codigobancodebito')?.invalid && this.f.get('codigobancodebito')?.touched;
  }

  get tasaInteresCreditoDiasNotValid(): any {
    return this.f.get('tasainteres')?.invalid && this.f.get('tasainteres')?.touched;
  }

  get prefijoNotValid(): any {
    return this.f.get('prefijonpe')?.invalid && this.f.get('prefijonpe')?.touched;
  }

  get claveNotValid(): any {
    return this.f.get('clavewsepp')?.invalid && this.f.get('clavewsepp')?.touched;
  }

  get obligadoContabilidadNotValid(): any {
    return this.f.get('obligadocontabilidad')?.invalid && this.f.get('obligadocontabilidad')?.touched;
  }

  get agenteRetencionNotValid(): any {
    return this.f.get('esagenteretencion')?.invalid && this.f.get('esagenteretencion')?.touched;
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
        Validators.minLength(1),
        Validators.maxLength(10)
      ]],
      clavestc: [''],
      ruc: ['', [
        Validators.required,
        Validators.minLength(13)
      ]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      activo: ['', [
        Validators.required,
      ]],
      escontribuyenteespacial: [''],
      // correo1: ['', [Validators.required]],
      // telefono1: ['', [Validators.required]],
      direccion: [''],
      identificacionrepresentantelega: [''],
      nombrerepresentantelegal: [''],
      nombrecorto: [''],
      // formaPago: [''],
      establecimientofac: [''],
      establecimientondb: [''],
      establecimientoncr: [''],
      puntoventandb: [''],
      puntoventafac: [''],
      puntoventancr: [''],
      fechavencimientocontr: [''],
      fehainiciocontrato: [''],
      codigoabastecedora: ['', [Validators.required]],
      tipoplazocredito: [''],
      diasplazocredito: [''],
      cuentadebito: [''],
      tipocuentadebito: [''],
      codigobancodebito: [''],
      tasainteres: [''],
      obligadocontabilidad: [''],
      esagenteretencion: [''],
      leyendaagenteretencion: [''],
      ambientesri: [''],
      tipoemision: [''],
      // datosContactos: this.fb.array([]),
      prefijonpe: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2)
      ]],
      clavewsepp: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(8)
      ]],
    });

  }

  close(): void {
    console.log('Salir de COMERCIALIZADORA');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'COMERCIALIZADORA' } });
  }

  save(): void {
    debugger;
    if (this.f.valid) {
      const value = this.f.value;
      console.log(value);
      this.registro = true;
      if (this.id !== 'new') {
        // this.editItems('comercializadora', this.id, value, 'firebase');
        this.editItems(value, this.id, 'comercializadora', 'postgres');
      } else {
        // this.addItems('comercializadora', value, 'firebase');
        this.addItems('comercializadora', value, 'postgres');
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'COMERCIALIZADORA' } });
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    } else {
      items.usuarioactual = this.user.email;
      this.ia.addDataTable(table, items, 2).subscribe(
        d => {
          console.log(d);
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'COMERCIALIZADORA' } });
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
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'COMERCIALIZADORA' } });
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
          this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'COMERCIALIZADORA' } });
        },
        err => console.log('HTTP Error', err),
      );
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
