import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InfinityApiService } from '../../../core/services/infinity-api.service';
class FacturasServicio {
  numSRI: any;
  numFactura: any;
  fechaEmi: any;
  fechaVmto: any;
  fechaGuia: any;
  estadoFac: any;
  estadoPago: any;
  ValorAnuladas: any;
  valorEmitidasConPago: any;
  valorEmitidasSinPago: any;
}

@Component({
  selector: 'app-dialog-facturas',
  templateUrl: './dialog-facturas.component.html',
  styleUrls: ['./dialog-facturas.component.css']
})
export class DialogFacturasComponent implements OnDestroy, OnInit {
  facturas = new FormGroup({});
  // dtOptions: DataTables.Settings = {};
  // dtTrigger= new Subject();

  displayedColumns: string[] = ['numFactura', 'fechaEmi', 'fechaVmto', 'fechaGuia', 'estadoFac', 'estadoPago', 'ValorAnuladas'];
  // dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fechaEmision = '20210512';
  tipo = 'SIN PAGO';

  f: FormGroup = this.fb.group({});

  /*fechaEmision :string="";
  tipo: string="";
  numFactura = '';
  fechaVencimiento = '';
  fechaDespacho = '';
  estadoFactura ='';
  estadoPago = '';
  valorAnuladas = '';
  valorEmitidasConPago = '';
  valorEmitidasSinPago = '';
  facts: any[] = [];*/

  public facturasServicio = new MatTableDataSource<FacturasServicio>();


  constructor(
    private fb: FormBuilder,
    private api: InfinityApiService,
    private dialogRef: MatDialogRef<DialogFacturasComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    // this.fechaEmision = data.fechaEmision,
    this.tipo = data.tipo;
  }

  ngOnInit(): void {
    /*this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language:{
        url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
      }
    };*/
    // debugger
    // this.getDatosFactura();

    this.ConsultaCorreoElectronicoTodos(this.fechaEmision, this.tipo);
    // console.log('facturas',this.facturasServicio.data);
    // onsole.log("facturasDatos"+ this.fechaEmision);
    console.log('facturas', this.tipo);
  }

  ngOnDestroy(): void {
    // this.dtTrigger.unsubscribe();
  }

  /*getDatosFactura(){
    debugger
    this.api.getDataF().subscribe(data => {
      console.log(data);
      data.forEach((element: any) => {
        if(element.estadoFac==='ANULADA'){
         //this.numeroFactura = element.numFactura;
          this.fechaEmision = element.fechaEmi;
          this.fechaVencimiento = element.fechaVmto;
          this.fechaDespacho = element.fechaGuia;
          this.estadoFactura = element.estadoFac;
          this.estadoPago = element.estadoPago;
          this.valorAnuladas = element.valorAnuladas;
        }else if(element.estadoFac==='ACTIVA'){
          if(element.estadoPago==='CANCELADA'){
          // this.numeroFactura = element.numFactura;
            this.fechaEmision = element.fechaEmi;
            this.fechaVencimiento = element.fechaVmto;
            this.fechaDespacho = element.fechaGuia;
            this.estadoFactura = element.estadoFac;
            this.estadoPago = element.estadoPago;
            this.valorEmitidasConPago = element.valorEmitidasConPago;
          }else if(element.estadoPago==='SIN PAGO'){
            //this.numeroFactura = element.numFactura;
            this.fechaEmision = element.fechaEmi;
            this.fechaVencimiento = element.fechaVmto;
            this.fechaDespacho = element.fechaGuia;
            this.estadoFactura = element.estadoFac;
            this.estadoPago = element.estadoPago;
            this.valorEmitidasSinPago = element.valorEmitidasSinPago;
          }
        }
        this.dataSource = element;
      });
    });
  }*/

  public ConsultaCorreoElectronicoTodos(fecha: any, tipo: any): void {
    console.log('hola');
    this.api.faturasPorTipo(fecha, tipo)
      .subscribe(res => {
        if (res != null) {
          this.facturasServicio.data = res;
          console.log('serivico', this.facturasServicio.data);
        }
        else {
          this.facturasServicio.data = [];
        }
      })
  }

  close(): void {
    this.dialogRef.close();
  }

}
