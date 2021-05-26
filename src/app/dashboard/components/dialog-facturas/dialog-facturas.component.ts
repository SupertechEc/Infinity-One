import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-dialog-facturas',
  templateUrl: './dialog-facturas.component.html',
  styleUrls: ['./dialog-facturas.component.css']
})
export class DialogFacturasComponent implements OnDestroy, AfterViewInit, OnInit {
  facturas = new FormGroup({});

  displayedColumns: string[] = ['numFactura', 'fechaEmi', 'fechaVmto', 'fechaGuia', 'estadoFac', 'estadoPago', 'valorEmitidasSinPago'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fechaEmision: any;
  tipo: any;
  facturasServicio: any;

  f: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private api: InfinityApiService,
    private dialogRef: MatDialogRef<DialogFacturasComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.dataSource = new MatTableDataSource(data);
    console.log(data);
    this.facturasServicio = data,
    this.fechaEmision= data.dateFactura,
    this.tipo= data.item;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
