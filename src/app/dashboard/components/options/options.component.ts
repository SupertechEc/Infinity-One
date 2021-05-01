import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  items: any[] = [];
  componentes: any[] = [];
  parm: any;
  groupName = '';
  loading = false;
  id = '';
  coleccion = '';
  columna = '';
  label = 'etiqueta';
  card = 'tarjeta';

  constructor(
    private router: Router,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private aRoute: ActivatedRoute
  ) {
    this.aRoute.queryParams.subscribe(params => {
      this.loading = true;
      this.id = params.id;
      this.coleccion = params.coleccion;
      this.columna = params.columna;
      console.log(this.id);
      console.log(this.coleccion);
      console.log(this.columna);
      this.getItems(this.id, this.coleccion, this.columna);
    });
  }

  ngOnInit(): void {
  }

  getItems(id: any, coll: any, col: any): void {
    this.cf.getItemsParm(coll, col, id).subscribe(data => {
      this.items = [];
      data.forEach((element: any) => {
        this.items.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.items.sort((a, b) => {
        return a.secuencial - b.secuencial;
      });
      console.log(this.items);
      this.loading = false;
    });
  }

  goPage(item: any): void {
    if (item.accion) {
      if (item.nombre === 'PRECIO') {
        this.router.navigate(['/dashboard/detalle-lista-precios'], { queryParams: { nombre: item.nombre } });
      } else {
        this.router.navigate(['/dashboard/detalle-opciones'], { queryParams: { nombre: item.nombre } });
      }
    } else {
      this.router.navigate(['/dashboard/opciones'], { queryParams: { id: item.id, coleccion: 'acciones', columna: 'submenuId' } });
    }
  }

}
