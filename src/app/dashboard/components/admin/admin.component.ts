import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  item: any;
  menus: any[] = [];
  componentes: any[] = [];
  parm: any;
  groupName = '';
  loading = false;
  id = '';
  coleccion = '';
  columna = '';
  label = 'etiqueta';
  card = 'tarjeta';
  flag = true;

  constructor(
    private router: Router,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private aRoute: ActivatedRoute
  ) {
    this.item = this.local.get('user');
    this.getItems();
  }

  ngOnInit(): void {
  }

  getItems(): void {
    this.loading = true;
    this.cf.getItems('menús', 'nombre').subscribe(data => {
      this.menus = [];
      data.forEach((element: any) => {
        this.menus.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.menus);
      if (this.item.email === 'p&sprueba@gmail.com') {
        this.flag = false;
        this.menus = this.menus.filter(d => d.nombre === 'MONITOR COMERCIAL');
      }
      this.loading = false;
    });
  }

  goPage(item: any): void {
    console.log(item);
    if (item.nombre === 'MONITOR COMERCIAL') {
      this.router.navigate(['/dashboard/garantia']);
    } else {
      this.router.navigate(['/dashboard/opciones'], { queryParams: { id: item.id, coleccion: 'submenús', columna: 'menuId' } });
    }
  }

}
