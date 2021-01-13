import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'editar', 'borrar'];
  dataSource!: MatTableDataSource<any>;
  parm: any;
  items: any[] = [];
  title = '';
  url = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private cf: ConectionFirebaseService,
    private toastr: ToastrService,
    private local: LocalstorageService,
  ) {
    this.parm = this.local.get('item');
    console.log(this.parm);
    this.title = this.parm.name;
    this.url = this.parm.name.toLocaleLowerCase();
    this.getItems();
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

  getItems(): void {
    this.cf.getItems('grupos', 'sequence').subscribe(data => {
      this.items = [];
      data.forEach((element: any) => {
        this.items.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.items);
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  newItem(): void {
    this.router.navigateByUrl('/dashboard/' + this.url);
  }

  // editItem(item: any): void {
  //   console.log(item);
  // }

  delItem(item: any, id: string): void {

    console.log(item);
    Swal.fire({
      icon: 'question',
      text: `Está seguro que desea borrar a ${item.name}`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: `Borrar`,
    }).then(resp => {
      if (resp.value) {
        this.cf.deleteItem('grupos', id).then(() => {
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

}
