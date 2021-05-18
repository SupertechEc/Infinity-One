import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConectionFirebaseService } from 'src/app/core/services/conection-firebase.service';
import { InfinityApiService } from '../../../core/services/infinity-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogFacturasComponent } from '../dialog-facturas/dialog-facturas.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-garantia',
  templateUrl: './garantia.component.html',
  styleUrls: ['./garantia.component.css']
})
export class GarantiaComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'name', 'editar', 'borrar'];
  dataSource!: MatTableDataSource<any>;

  item: any;
  comercializadora = '';
  comercializadoraM = '';
  actualizadoal = '';
  valortotal = '';
  valoratresdias = '';
  noventayocho = '';
  saldo = '';
  saldodisponible = '';
  porcentajeusado = '';
  facturasemitidasnopagadas = '';
  facturasemitidaspagadas = '';
  facturasanuladas = '';
  valornopagadas = '';
  valorpagadas = '';
  valoranuladas = '';
  fechaEmi = '';
  fechaActualizado: any;
  clienteId = '';
  public datosFecha: FormGroup = new FormGroup({});
  public fechaEmision: any;

  @Output()
  itemEdited = new EventEmitter();

  constructor(
    private api: InfinityApiService,
    private cf: ConectionFirebaseService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.obtenerDatos();
  }

  getData(): void {

    this.api.getDataInfinity().subscribe(data => {
      console.log(data);
      this.comercializadora = data.COMERCIALIZADORA;
      this.actualizadoal = data.ACTUALIZADOAL.substring(0, 19);
      this.valortotal = data.VALORTOTAL;
      this.valoratresdias = data.VALORATRESDIAS;
      this.noventayocho = data.NOVENTAYOCHO;
      this.saldo = data.SALDO.substring(1);
      this.saldodisponible = data.SALDODISPONIBLE;
      this.porcentajeusado = data.PORCENTAJEUSADO;
    });
  }

  getDataDate(fechaEmision: HTMLInputElement): void {
    console.log(fechaEmision.value);
    const hoy = new Date();
    this.fechaActualizado = this.datePipe.transform(hoy, 'yyyy/MM/dd');
    this.comercializadoraM = 'PETROLEOS Y SERVICIOS PYS C.A.';
    const date = fechaEmision.value;
    let fecha = '';
    const arr = date.split('/');

    let dd = '';
    let mm = '';
    let yyyy = '';
    dd += arr[1];
    mm += arr[0];
    yyyy += arr[2];
    if (arr[0].length <= 1) {
      mm = 0 + arr[0];
    }
    if (arr[1].length <= 1) {
      dd = 0 + arr[1];
    }
    fecha = yyyy + mm + dd;
    this.fechaEmi = fecha;
    this.api.ConsultaDireccionTodos(this.fechaEmi).subscribe(data => {
      console.log(data);
      let sumaNoPago = 0;
      let sumaPago = 0;
      let sumaActiva = 0;
      let sumaNoActiva = 0;
      let valorNoPagado = 0.0;
      let valorPagado = 0.0;
      let valorAnulado = 0.0;
      data.forEach((element: any) => {
        if (element.estadoPago === 'SIN PAGO') {
          sumaNoPago += 1;
          this.facturasemitidasnopagadas = sumaNoPago as unknown as string;
          this.facturasemitidaspagadas = 0 as unknown as string;
        } else if (element.estadoPago === 'CANCELADA') {
          sumaPago += 1;
          this.facturasemitidaspagadas = sumaPago as unknown as string;
        }

        if (element.estadoFac === 'ACTIVA') {
          sumaActiva += 1;
          if (sumaActiva >= 1) {
            this.facturasanuladas = 0 as unknown as string;
          } else {
            this.facturasanuladas = sumaActiva as unknown as string;
          }
        } else if (element.estadoFac === 'ANULADA') {
          sumaNoActiva += 1;
          this.facturasanuladas = sumaNoActiva as unknown as string;
        }

        if (element.valorEmitidasSinPago >= 0) {
          valorNoPagado += element.valorEmitidasSinPago;
          let numeroP = valorNoPagado, comasP;
          const noTruncarDecimales = { maximumFractionDigits: 2 };
          comasP = numeroP.toLocaleString('en-US', noTruncarDecimales);
          this.valornopagadas = comasP;

        } else {
          var numeroP = valorNoPagado, comasP;
          const noTruncarDecimales = { maximumFractionDigits: 2 };
          comasP = numeroP.toLocaleString('en-US', noTruncarDecimales);
          this.valornopagadas = comasP;
        }

        if (element.valorEmitidasConPago >= 0) {
          valorPagado += element.valorEmitidasConPago;
          var numeroCP = valorPagado, comasCP;
          const noTruncarDecimales = { maximumFractionDigits: 2 };
          comasCP = numeroCP.toLocaleString('en-US', noTruncarDecimales);
          this.valorpagadas = comasCP;

        } else {
          var numeroCP = valorPagado, comasCP;
          const noTruncarDecimales = { maximumFractionDigits: 2 };
          comasCP = numeroCP.toLocaleString('en-US', noTruncarDecimales);
          this.valorpagadas = comasCP;
        }

        if (element.ValorAnuladas >= 0) {
          valorAnulado += element.ValorAnuladas;
          var numeroA = valorAnulado, comasA;
          const noTruncarDecimales = { maximumFractionDigits: 2 };
          comasA = numeroA.toLocaleString('en-US', noTruncarDecimales);
          this.valoranuladas = comasA;
        } else {
          var numeroA = valorAnulado, comasA;
          const noTruncarDecimales = { maximumFractionDigits: 2 };
          comasA = numeroA.toLocaleString('en-US', noTruncarDecimales);
          this.valoranuladas = comasA;
        }
      });
    });
  }

  public obtenerDatos(): void {
    this.datosFecha = this.formBuilder.group({ fechaEmision: [null, Validators.required] });
  }

  convertirNumero(): void {

  }

  editItem(fechaEmision: HTMLInputElement, item: any): void {
    console.log('abdc' + item);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item;
    this.dialog.open(DialogFacturasComponent, dialogConfig)
      .afterClosed()
      .subscribe(val => {
      });
  }
}
