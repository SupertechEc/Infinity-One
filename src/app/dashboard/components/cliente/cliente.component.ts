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
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
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
  comercializadora: any[] = [];
  tipocliente: any[] = [];
  areamercadeo: any[] = [];
  direccioninen: any[] = [];
  formapagos: any[] = [];
  grupocliente: any[] = [];
  grupoflete: any[] = [];
  terminal: any[] = [];
  banco: any[] = [];
  listaprecios: any[] = [];
  codigosupervisorzonal: any[] = [];
  fechaIni: Date = new Date();
  fechaInsc: Date = new Date();
  fechaArch: Date = new Date();
  fechaVenCon: Date = new Date();
  user = this.local.get('user');
  params: any;
  cfp = false;

  controlargarantiabanacaria = [{ estado: 'SI' }, { estado: 'NO' }];

  ces = [{ estado: 'SI' }, { estado: 'NO' }];

  eces = [
    { codigo: 'S', nombre: 'SI' },
    { codigo: 'N', nombre: 'NO' },
  ];

  tdpcs = [
    { codigo: 'L', nombre: 'Laborable' },
    { codigo: 'C', nombre: 'Calendario' },
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
    this.aRoute.queryParams.subscribe((params) => {
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
    this.getComercializadora();
    this.getTipoCliente();
    //this.getAreaMercadeo();
    this.getFormaPago();
    this.getDireccionInen();
    this.getTerminal();
    this.getListaPrecios();
    this.getBanco();
    // this.getItems();
  }

  getBanco(): void {
    this.ia.getTableInfinity('banco').subscribe((data) => {
      this.banco = data.retorno;
    });
  }

  getFormaPago(): void {
    this.ia.getTableInfinity('formapago').subscribe((data) => {
      this.formapagos = data.retorno;
    });
  }

  getListaPrecios(): void {
    this.ia.getTableInfinity('listaprecio').subscribe((data) => {
      this.listaprecios = data.retorno;
    });
  }

  getTerminal(): void {
    this.ia.getTableInfinity('terminal').subscribe((data) => {
      this.terminal = data.retorno;
    });
  }

  getComercializadora(): void {
    this.ia.getTableInfinity('comercializadora').subscribe((data) => {
      this.comercializadora = data.retorno;
    });
  }

  getAreaMercadeo(): void {
    this.cf.getItems('áreamercadeo', 'nombre').subscribe((data) => {
      this.areamercadeo = [];
      data.forEach((element: any) => {
        this.areamercadeo.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      console.log(this.areamercadeo);
    });
  }

  getTipoCliente(): void {
    this.ia.getTableInfinity('tipocliente').subscribe((data) => {
      this.tipocliente = data.retorno;
    });
  }

  getDireccionInen(): void {
    this.ia.getTableInfinity('direccioninen').subscribe((data) => {
      this.direccioninen = data.retorno;
    });
  }

  getGrupoFlete(): void {
    this.ia.getTableInfinity('grupoflete').subscribe((data) => {
      this.grupoflete = data.retorno;
    });
  }

  getSupervisorZonal(): void {
    this.ia.getTableInfinity('supervisorzonal').subscribe((data) => {
      this.codigosupervisorzonal = data.retorno;
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
        codigo: this.params.codigo,
      };

      this.ia.getItemInfinity('cliente', parametros).subscribe(
        (d) => {
          console.log('comercializadora', d.retorno[0].codigocomercializadora);
          this.fechaIni = new Date(d.retorno[0].fehainiciooperacion),
          this.fechaInsc = new Date(d.retorno[0].fehainscripcion),
          this.fechaArch = new Date(d.retorno[0].feharegistroarch),
          this.fechaVenCon = new Date(d.retorno[0].fehavencimientocontrato)
          this.f.setValue({
          codigocomercializadora: d.retorno[0].codigocomercializadora,
          codigo: d.retorno[0].codigo,
          codigoarch: d.retorno[0].codigoarch,
          codigostc: d.retorno[0].codigostc,
          clavestc: d.retorno[0].clavestc,
          ruc: d.retorno[0].ruc,
          nombre: d.retorno[0].nombre,
          estado: d.retorno[0].estado,
          escontribuyenteespacial: d.retorno[0].escontribuyenteespacial,
          // correo1: data.payload.data().correo1,
          // telefono1: data.payload.data().telefono1,
          direccion: d.retorno[0].direccion,
          identificacionrepresentantelega: d.retorno[0].identificacionrepresentantelega,
          nombrerepresentantelegal: d.retorno[0].nombrerepresentantelegal,
          // nombreCorto: data.payload.data().nombreCorto,
          codigotipocliente: d.retorno[0].codigotipocliente,
          //areaMercadeo: d.retorno[0].areaMercadeo,
          codigodireccioninen: d.retorno[0].codigodireccioninen.codigo,
          fehavencimientocontrato: this.fechaVenCon,
          // segmentoOperacion: data.payload.data().segmentoOperacion,
          tipoplazocredito: d.retorno[0].tipoplazocredito,
          diasplazocredito: d.retorno[0].diasplazocredito,
          cuentadebito: d.retorno[0].cuentadebito,
          tipocuentadebito: d.retorno[0].tipocuentadebito,
          codigobancodebito: d.retorno[0].codigobancodebito.codigo,
          tasainteres: d.retorno[0].tasainteres,
          nombrearrendatario: d.retorno[0].nombrearrendatario,
          codigoformapago: d.retorno[0].codigoformapago.codigo,
          controlagarantia: d.retorno[0].controlagarantia,
          codigolistaprecio: d.retorno[0].codigolistaprecio,
          codigolistaflete: d.retorno[0].codigolistaflete,
          fehainiciooperacion: this.fechaIni,
          fehainscripcion: this.fechaInsc,
          feharegistroarch: this.fechaArch,
          //fechaRegistroAbastecedora: data.payload.data().fechaRegistroAbastecedora,
          aplicasubsidio2: d.retorno[0].aplicasubsidio2,
          centrocosto: d.retorno[0].centrocosto,
          codigosupervisorzonal: d.retorno[0].codigosupervisorzonal,
          codigoterminaldefecto: d.retorno[0].codigoterminaldefecto.codigo,
          //datosContactos: data.payload.data().datosContactos
          });
        },
        (err) => console.log('HTTP Error', err)
      );

      /*this.cf.getItemData('cliente', this.id).subscribe(data => {
        console.log(data.payload.data());
        // this.imgUrl = data.payload.data().imagenUrl;
        this.f.patchValue({
          codigo: data.payload.data().codigo,
          codigoarch: data.payload.data().codigoarch,
          codigostc: data.payload.data().codigostc,
          clavestc: data.payload.data().clavestc,
          ruc: data.payload.data().ruc,
          nombre: data.payload.data().nombre,
          estado: data.payload.data().estado,
          escontribuyenteespacial: data.payload.data().escontribuyenteespacial,
          // correo1: data.payload.data().correo1,
          // telefono1: data.payload.data().telefono1,
          direccion: data.payload.data().direccion,
          identificacionrepresentantelega: data.payload.data().identificacionrepresentantelega,
          nombrerepresentantelegal: data.payload.data().nombrerepresentantelegal,
          // nombreCorto: data.payload.data().nombreCorto,
          codigotipocliente: data.payload.data().codigotipocliente,
          areaMercadeo: data.payload.data().areaMercadeo,
          codigodireccioninen: data.payload.data().codigodireccioninen,
          fehavencimientocontrato: data.payload.data().fehavencimientocontrato,
          codigocomercializadora: data.payload.data().codigocomercializadora,
          // segmentoOperacion: data.payload.data().segmentoOperacion,
          tipoplazocredito: data.payload.data().tipoplazocredito,
          diasplazocredito: data.payload.data().diasplazocredito,
          cuentadebito: data.payload.data().cuentadebito,
          tipocuentadebito: data.payload.data().tipocuentadebito,
          codigobancodebito: data.payload.data().codigobancodebito,
          tasainteres: data.payload.data().tasainteres,
          nombrearrendatario: data.payload.data().nombrearrendatario,
          codigoformapago: data.payload.data().codigoformapago,
          controlagarantia: data.payload.data().controlagarantia,
          codigolistaprecio: data.payload.data().codigolistaprecio,
          codigolistaflete: data.payload.data().codigolistaflete,
          fehainiciooperacion: data.payload.data().fehainiciooperacion,
          fehainscripcion: data.payload.data().fehainscripcion,
          feharegistroarch: data.payload.data().feharegistroarch,
          //fechaRegistroAbastecedora: data.payload.data().fechaRegistroAbastecedora,
          aplicasubsidio2: data.payload.data().aplicasubsidio2,
          centrocosto: data.payload.data().centrocosto,
          codigosupervisorzonal: data.payload.data().codigosupervisorzonal,
          codigoterminaldefecto: data.payload.data().codigoterminaldefecto,
          //datosContactos: data.payload.data().datosContactos
        });
        this.setChange(data.payload.data().estado);
        // this.loading = false;
      });*/
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
    return (
      this.f.get('codigoarch')?.invalid && this.f.get('codigoarch')?.touched
    );
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
    return this.f.get('estado')?.invalid && this.f.get('estado')?.touched;
  }

  get contEspecialNotValid(): any {
    return (
      this.f.get('escontribuyenteespacial')?.invalid &&
      this.f.get('escontribuyenteespacial')?.touched
    );
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
    return (
      this.f.get('identificacionrepresentantelega')?.invalid &&
      this.f.get('identificacionrepresentantelega')?.touched
    );
  }

  get nombreRLNotValid(): any {
    return (
      this.f.get('nombrerepresentantelegal')?.invalid &&
      this.f.get('nombrerepresentantelegal')?.touched
    );
  }

  // get nombreCortoNotValid(): any {
  //   return this.f.get('nombreCorto')?.invalid && this.f.get('nombreCorto')?.touched;
  // }

  get tipoClienteNotValid(): any {
    return (
      this.f.get('codigotipocliente')?.invalid &&
      this.f.get('codigotipocliente')?.touched
    );
  }

  get areaMercadeoNotValid(): any {
    return (
      this.f.get('areaMercadeo')?.invalid && this.f.get('areaMercadeo')?.touched
    );
  }

  get direccionInenNotValid(): any {
    return (
      this.f.get('codigodireccioninen')?.invalid &&
      this.f.get('codigodireccioninen')?.touched
    );
  }

  get fechaVencimientoContratoNotValid(): any {
    return (
      this.f.get('fehavencimientocontrato')?.invalid &&
      this.f.get('fehavencimientocontrato')?.touched
    );
  }

  get comercializadoraIdNotValid(): any {
    return (
      this.f.get('codigocomercializadora')?.invalid &&
      this.f.get('codigocomercializadora')?.touched
    );
  }

  // get segmentoOperacionNotValid(): any {
  //   return this.f.get('segmentoOperacion')?.invalid && this.f.get('segmentoOperacion')?.touched;
  // }

  get tipoDiasPlazoNotValid(): any {
    return (
      this.f.get('tipoplazocredito')?.invalid &&
      this.f.get('tipoplazocredito')?.touched
    );
  }

  get diasPlazoCreditoNotValid(): any {
    return (
      this.f.get('diasplazocredito')?.invalid &&
      this.f.get('diasplazocredito')?.touched
    );
  }

  get cuentaDebitarNotValid(): any {
    return (
      this.f.get('cuentadebito')?.invalid && this.f.get('cuentadebito')?.touched
    );
  }

  get tipoCuentaNotValid(): any {
    return (
      this.f.get('tipocuentadebito')?.invalid &&
      this.f.get('tipocuentadebito')?.touched
    );
  }

  get codigoBancoDebitarNotValid(): any {
    return (
      this.f.get('codigobancodebito')?.invalid &&
      this.f.get('codigobancodebito')?.touched
    );
  }

  get tasaInteresCreditoDiasNotValid(): any {
    return (
      this.f.get('tasainteres')?.invalid && this.f.get('tasainteres')?.touched
    );
  }

  get nombreArrendatarioNotValid(): any {
    return (
      this.f.get('nombrearrendatario')?.invalid &&
      this.f.get('nombrearrendatario')?.touched
    );
  }

  get formaPagoNotValid(): any {
    return (
      this.f.get('codigoformapago')?.invalid &&
      this.f.get('codigoformapago')?.touched
    );
  }

  get controlarGrarantiaBancariaNotValid(): any {
    return (
      this.f.get('controlagarantia')?.invalid &&
      this.f.get('controlagarantia')?.touched
    );
  }

  get listaPreciosNotValid(): any {
    return (
      this.f.get('codigolistaprecio')?.invalid &&
      this.f.get('codigolistaprecio')?.touched
    );
  }

  get codigoGrupoFleteNotValid(): any {
    return (
      this.f.get('codigolistaflete')?.invalid &&
      this.f.get('codigolistaflete')?.touched
    );
  }

  get fechaInicioOperacionNotValid(): any {
    return (
      this.f.get('fehainiciooperacion')?.invalid &&
      this.f.get('fehainiciooperacion')?.touched
    );
  }

  get fechaInscripcionClienteNotValid(): any {
    return (
      this.f.get('fehainscripcion')?.invalid &&
      this.f.get('fehainscripcion')?.touched
    );
  }

  get fechaRegistroARCHNotValid(): any {
    return (
      this.f.get('feharegistroarch')?.invalid &&
      this.f.get('feharegistroarch')?.touched
    );
  }

  get fechaRegistroAbastecedoraNotValid(): any {
    return (
      this.f.get('fechaRegistroAbastecedora')?.invalid &&
      this.f.get('fechaRegistroAbastecedora')?.touched
    );
  }

  get aplicaSubsidioNotValid(): any {
    return (
      this.f.get('aplicasubsidio2')?.invalid &&
      this.f.get('aplicasubsidio2')?.touched
    );
  }

  get centroCostoNotValid(): any {
    return (
      this.f.get('centrocosto')?.invalid && this.f.get('centrocosto')?.touched
    );
  }

  get codigoSupervisorZonalNotValid(): any {
    return (
      this.f.get('codigosupervisorzonal')?.invalid &&
      this.f.get('codigosupervisorzonal')?.touched
    );
  }

  get terminalPorDefectoNotValid(): any {
    return (
      this.f.get('codigoterminaldefecto')?.invalid &&
      this.f.get('codigoterminaldefecto')?.touched
    );
  }

  makeForm(): void {
    this.f = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(4)]],
      codigoarch: ['', [Validators.required, Validators.minLength(2)]],
      codigostc: ['', [Validators.required, Validators.minLength(6)]],
      clavestc: [''],
      ruc: ['', [Validators.required, Validators.minLength(13)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required]],
      escontribuyenteespacial: [''],
      // correo1: ['', [Validators.required]],
      // telefono1: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      identificacionrepresentantelega: [''],
      nombrerepresentantelegal: [''],
      // nombreCorto: ['', [Validators.required]],
      codigotipocliente: [''],
      // areaMercadeo: ['', [Validators.required]],
      codigodireccioninen: ['', [Validators.required]],
      fehavencimientocontrato: [''],
      codigocomercializadora: ['', [Validators.required]],
      // segmentoOperacion: ['', [Validators.required]],
      tipoplazocredito: [''],
      diasplazocredito: [0],
      cuentadebito: [''],
      tipocuentadebito: [''],
      codigobancodebito: [''],
      tasainteres: [''],
      nombrearrendatario: [''],
      codigoformapago: [''],
      controlagarantia: [''],
      codigolistaprecio: ['', [Validators.required]],
      codigolistaflete: [''],
      fehainiciooperacion: [''],
      fehainscripcion: [''],
      feharegistroarch: [''],
      // fechaRegistroAbastecedora  : [''],
      aplicasubsidio2: [''],
      centrocosto: [''],
      codigosupervisorzonal: [''],
      codigoterminaldefecto: [''],
      // datosContactos: this.fb.array([]),
    });
  }

  close(): void {
    console.log('Salir de CLIENTE');
    this.router.navigate(['/dashboard/detalle-opciones'], {
      queryParams: { nombre: 'CLIENTE' },
    });
  }

  save(): void {
    debugger;
    if (this.f.valid) {
      const value = this.f.value;
      console.log(value);
      this.registro = true;
      if (this.id !== 'new') {
        // this.editItems('cliente', this.id, value, 'firebase');
        this.editItems(value, this.id, 'cliente', 'postgres');
      } else {
        // this.addItems('cliente', value, 'firebase');
        this.addItems('cliente', value, 'postgres');
      }
      console.log(value);
    }
  }

  addItems(table: string, items: any, tipo: string): void {
    if (tipo === 'firebase') {
      items.fechaCreacion = new Date();
      this.cf
        .agregarItem(items, table)
        .then(() => {
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right',
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], {
            queryParams: { nombre: 'CLIENTE' },
          });
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    } else {
      items.usuarioactual = this.user.email;
      this.ia.addDataTable(table, items, 2).subscribe(
        (d) => {
          console.log(d);
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right',
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], {
            queryParams: { nombre: 'CLIENTE' },
          });
        },
        (err) => console.log('HTTP Error', err)
      );
    }
  }

  editItems(items: any, codigo: string, table: string, tipo: string): void {
    if (tipo === 'firebase') {
      items.fechaActualizacion = new Date();
      this.cf
        .editItem(table, codigo, items)
        .then(() => {
          console.log('Item editado con exito');
          this.toastr.success('Item editado con exito', 'Item Editado', {
            positionClass: 'toast-bottom-right',
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], {
            queryParams: { nombre: 'CLIENTE' },
          });
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    } else {
      items.usuarioactual = this.user.email;
      this.ia.editDataTable(table, items).subscribe(
        (d) => {
          console.log(d);
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right',
          });
          this.registro = false;
          this.router.navigate(['/dashboard/detalle-opciones'], {
            queryParams: { nombre: 'CLIENTE' },
          });
        },
        (err) => console.log('HTTP Error', err)
      );
    }
  }
}
