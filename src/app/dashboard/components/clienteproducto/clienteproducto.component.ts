import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProductoComponent } from '../dialog-producto/dialog-producto.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clienteproducto',
  templateUrl: './clienteproducto.component.html',
  styleUrls: ['./clienteproducto.component.css']
})
export class ClienteproductoComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'name', 'editar', 'borrar'];
  dataSource!: MatTableDataSource<any>;

  f = new FormGroup({});
  loading = false;
  registro = false;
  clienteId = '';
  producto: any[] = [];
  cliente: any;
  flag = 0;
  btnName = '';
  item: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Output()
  itemEdited = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private afs: AngularFireStorage,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.makeForm();
    this.aRoute.queryParams.subscribe(params => {
      this.clienteId = params.id;
      this.btnName = 'Agregar';
      console.log(params);
    });
  }

  ngOnInit(): void {
    this.getCliente();
    this.getProducto();
  }

  makeForm(): void {
    this.f = this.fb.group({
      // terminalId: ['', [Validators.required]],
      // productos: this.fb.array([]),
    });
  }

  getCliente(): void {
    this.cf.getItemData('clienteproducto', this.clienteId).subscribe(data => {
      this.cliente = data.payload.data();
      this.flag = 1;
      console.log(this.cliente);
    });
  }

  getProducto(): void {
    this.cf.getSubItem('clienteproducto', this.clienteId, 'productos').subscribe(data => {
      this.producto = [];
      data.forEach((element: any) => {
        this.producto.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.producto);
      this.dataSource = new MatTableDataSource(this.producto);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  get productoIdNotValid(): any {
    return this.f.get('productoId')?.invalid && this.f.get('productoId')?.touched;
  }

  save(): void {

  }

  close(): void {
    console.log('Salir de ÁREA MERCADEO');
    this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: 'CLIENTE PRODUCTO' } });
  }

  newItem(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.item.colName = 'clienteproducto';
    this.item.colId = this.clienteId;
    this.item.tipo = 'new';
    dialogConfig.data = this.item;

    this.dialog.open(DialogProductoComponent, dialogConfig)
      .afterClosed()
      .subscribe(val => {
        if (val) {
          this.itemEdited.emit();
        }
      });
  }

  delItem(item: any): void {
    console.log(item);
    Swal.fire({
      icon: 'question',
      text: `Está seguro que desea borrar a ${item.nombre}`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: `Borrar`,
    }).then(resp => {
      if (resp.value) {
        this.cf.deleteSubItem('clienteproducto', this.clienteId, 'productos', item.id).then(() => {
          console.log('Registro eliminado con exito');
          this.toastr.info('Registro eliminado con exito', 'Registro Eliminado', {
            positionClass: 'toast-bottom-right'
          });
        }).catch(error => {
          console.log(error);
        });
      }
    });
  }

  editItem(item: any): void {
    // console.log(item);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    item.colName = 'clienteproducto';
    item.colId = this.clienteId;
    item.tipo = 'edit';
    dialogConfig.data = item;

    this.dialog.open(DialogProductoComponent, dialogConfig)
      .afterClosed()
      .subscribe(val => {
        if (val) {
          this.itemEdited.emit();
        }
      });
  }

}
