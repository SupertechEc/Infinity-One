import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-elite-dashboard',
  templateUrl: './elite-dashboard.component.html',
  styleUrls: ['./elite-dashboard.component.css']
})
export class EliteDashboardComponent implements OnInit {

  item: any;
  user: any[] = [];
  menus: any[] = [];

  constructor(
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private router: Router,
    private auth: AuthService,
  ) {
    this.getUser();
  }

  ngOnInit(): void {
  }

  getUser(): void {
    this.item = this.local.get('user');
    console.log(this.item);
    this.cf.getItemsParm('usuarios', 'email', this.item.email).subscribe(data => {
      this.user = [];
      data.forEach((element: any) => {
        this.user.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });

      console.log(this.user);
      this.getMenus();
    });
  }

  getMenus(): void {
    this.cf.getItems('menús', 'secuencial').subscribe(data => {
      this.menus = [];
      data.forEach((element: any) => {
        this.menus.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.menus);
      if (this.item.email === 'p&sprueba@gmail.com') {
        this.menus = this.menus.filter(d => d.nombre === 'MONITOR COMERCIAL');
      }
    });
  }

  goPage(menu: any): void {
    console.log(menu);
    if (menu.nombre === 'MONITOR COMERCIAL') {
      this.router.navigate(['/dashboard/garantia']);
    } else {
      this.router.navigate(['/dashboard/opciones'], { queryParams: { id: menu.id, coleccion: 'submenús', columna: 'menuId' } });
    }
  }

  exit(): void {
    this.auth.logout();
    this.router.navigateByUrl('/home/login');
  }

}
