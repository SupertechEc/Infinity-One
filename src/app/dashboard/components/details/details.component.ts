import { AfterViewInit, Component, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { ElementosService } from '../../../core/services/elementos.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogListaprecioComponent } from '../dialog-listaprecio/dialog-listaprecio.component';
import Swal from 'sweetalert2';
import { InfinityApiService } from '../../../core/services/infinity-api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements AfterViewInit {

  // displayedColumns: string[] = ['codigo', 'name', 'editar', 'borrar'];
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;
  parm: any;
  cliente: any = {};
  comercializadora: any = {};
  comer: any[] = [];
  clipro: any = {};
  compro: any = {};
  items: any[] = [];
  itemsFilter: any[] = [];
  tn: any[] = [];
  title = '';
  url = '';
  // id: string | null;
  collection: any[] = [];
  nameCol = '';
  flag = true;
  ndp = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Output()
  itemEdited = new EventEmitter();

  constructor(
    private router: Router,
    private cf: ConectionFirebaseService,
    private toastr: ToastrService,
    private local: LocalstorageService,
    private aRoute: ActivatedRoute,
    private es: ElementosService,
    private dialog: MatDialog,
    private ias: InfinityApiService,
  ) {

    // this.id = this.aRoute.snapshot.paramMap.get('id');
    // console.log(this.id);
    this.aRoute.queryParams.subscribe(params => {
      this.nameCol = params.nombre;
      this.nameCol = this.nameCol.replace(' - ', '');
      this.title = this.nameCol;
      this.nameCol = this.nameCol.replace(' ', '');
      this.nameCol = this.nameCol.replace(' ', '');
      this.nameCol = this.nameCol.toLocaleLowerCase();

      console.log(this.nameCol);
      if (this.nameCol === 'notadepedido') {
        this.getComercializadora();
      }
      if (this.nameCol === 'clienteproducto') {
        this.getItems('cliente', 'nombre');
        this.flag = false;
        this.displayedColumns = ['codigo', 'name', 'editar'];
      } else if (this.nameCol === 'comercializadoraproducto') {
        this.getItems('comercializadora', 'nombre');
        this.flag = false;
        this.displayedColumns = ['codigo', 'name', 'editar'];
      } else if (this.nameCol === 'notadepedido') {
        this.ndp = true;
        this.getItems('notadepedido', 'fechaVenta');
        this.flag = true;
        this.displayedColumns = ['codigo', 'fecha', 'editar'];
      } else {
        this.getItems(this.nameCol, 'nombre');
        this.displayedColumns = ['codigo', 'name', 'editar', 'borrar'];
      }
    });

    // this.getNotaPedido();
    // this.parm = this.local.get('item');
    // console.log(this.parm);
  }

  ngAfterViewInit(): void {

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getComercializadora(): void {
    this.cf.getItems('comercializadora', 'nombre').subscribe(data => {
      this.comer = [];
      data.forEach((element: any) => {
        this.comer.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.comer);
    });
  }

  getFilter(com: any): void {
    console.log(com);
    console.log(this.items);
    this.itemsFilter = this.items.filter(i => i.comercializadoraId === com);
    console.log(this.itemsFilter);
    this.dataSource = new MatTableDataSource(this.itemsFilter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.getItems('notadepedido', 'fechaVenta');
  }

  openLista(item: any): void {
    // console.log('Lista');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = item;

    this.dialog.open(DialogListaprecioComponent, dialogConfig)
      .afterClosed()
      .subscribe(val => {
        if (val) {
          this.itemEdited.emit();
        }
      });
  }

  changePage(): void {
    if (this.nameCol === 'notadepedido') {
      // this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: r.id } });
      this.router.navigate(['/dashboard/anp']);
    }
  }

  getItems(col: any, columna: string): void {
    const table = this.es.quitarAcentos(col);
    console.log(table);
    if (table === 'areamercadeo') {
      this.ias.getTableInfinity(table).subscribe(
        d => {
          console.log(d.retorno);
          this.showitems(d.retorno);
        },
        err => console.log('HTTP Error', err),
      );
    } else {
      this.cf.getItems(col, columna).subscribe(data => {
        this.items = [];
        data.forEach((element: any) => {
          this.items.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.items);
        this.showitems(this.items);
      });
    }
  }

  showitems(items: any): void {
    this.dataSource = new MatTableDataSource(items);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  newItem(): void {

    Swal.fire({
      icon: 'info',
      showConfirmButton: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading();

    if (this.nameCol === 'notadepedido') {
      this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: 'new' } });
      Swal.close();
      // this.es.getNotaPedido(this.nameCol).then((data: any) => {
      //   const user = this.local.get('user');
      //   console.log(data);
      //   const arr = data;
      //   console.log(arr);
      //   const colId = arr.id;
      //   const ar1 = {
      //     numeropedido: arr.numero
      //   };
      //   console.log(ar1);
      //   this.cf.agregarItemNP(ar1, 'notadepedido').
      //     then(r => {
      //       console.log(colId);
      //       console.log(r.id);
      //       arr.notapedidoId = '' + r.id;
      //       arr.flag = 'B';
      //       arr.uid = user.localId;
      //       arr.fechaUpdate = new Date();
      //       delete arr.id;
      //       console.log(arr);
      //       this.cf.editItem('tablanumero', colId, arr).then(() => {
      //         console.log('Item editado con exito');
      //         Swal.close();
      //         this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: 'new', tn: colId, np: r.id } });
      //       }).catch(error => {
      //         console.log(error);
      //       });
      //     })
      //     .catch(err => console.log(err));
      // });
    } else {
      console.log(this.nameCol);
      Swal.close();
      this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: 'new' } });
    }
  }

  delItem(item: any, id: string): void {

    console.log(item);
    Swal.fire({
      icon: 'question',
      text: `Está seguro que desea borrar a ${item.nombre}`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: `Borrar`,
    }).then(resp => {
      if (resp.value) {
        this.cf.deleteItem(this.nameCol, id).then(() => {
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
    console.log(item);
    if (this.nameCol === 'clienteproducto') {
      this.cliente.clienteId = item.id;
      this.cliente.clienteCodigo = item.codigo;
      this.cliente.clienteNombre = item.nombre;
      this.cliente.fechaCreacion = new Date();
      console.log(this.cliente);
      this.cf.getItemsParm('clienteproducto', 'clienteId', item.id).subscribe(d => {
        this.clipro = [];
        d.forEach((element: any) => {
          this.clipro.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.clipro);
        if (this.clipro.length > 0) {
          console.log(this.clipro[0]);
          this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: this.clipro[0].id } });
        } else {
          console.log('agregar');
          this.cf.agregarItem(this.cliente, 'clienteproducto').then(r => {
            this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: r.id } });
          }).catch(error => {
            console.log(error);
          });
        }
      });
    } else if (this.nameCol === 'comercializadoraproducto') {
      this.comercializadora.comercializadoraId = item.id;
      this.comercializadora.comercializadoraCodigo = item.codigo;
      this.comercializadora.comercializadoraNombre = item.nombre;
      this.comercializadora.fechaCreacion = new Date();
      console.log(this.comercializadora);
      this.cf.getItemsParm('comercializadoraproducto', 'comercializadoraId', item.id).subscribe(d => {
        this.compro = [];
        d.forEach((element: any) => {
          this.compro.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        });
        console.log(this.compro);
        if (this.compro.length > 0) {
          console.log(this.compro[0]);
          this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: this.compro[0].id } });
        } else {
          console.log('agregar');
          this.cf.agregarItem(this.comercializadora, 'comercializadoraproducto').then(r => {
            this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: r.id } });
          }).catch(error => {
            console.log(error);
          });
        }
      });
    } else {
      if (this.nameCol === 'áreamercadeo') {
        this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: item.codigo } });
      } else {
        this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: item.id } });
      }
    }
  }

}

