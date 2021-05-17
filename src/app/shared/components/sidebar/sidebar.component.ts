import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  name = '';
  item: any;
  imageUrl = '';
  user: any[] = [];
  profile: any[] = [];
  menus: any[] = [];
  loading = false;

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(
    firestore: AngularFirestore,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private router: Router
  ) {
    this.imageUrl = 'assets/images/AVATAR.svg';
    this.getUser();
  }

  ngOnInit(): void {
  }

  getUser(): void {
    this.loading = true;
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
      this.loading = false;
    });
  }

  toggleSideBar(): void {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  goPage(menu: any): void {
    console.log(menu);
    // [routerLink]="['/dashboard/opciones']"
    //         [queryParams]="{ id: menu.id, coleccion: 'submenús', columna: 'menuId' }" (click)="toggleSideBar()"
    if (menu.nombre === 'MONITOR COMERCIAL') {
      this.router.navigate(['/dashboard/garantia']);
    } else {
      this.router.navigate(['/dashboard/opciones'], { queryParams: { id: menu.id, coleccion: 'submenús', columna: 'menuId' } });
    }
  }

  // getUser(): void {
  //   this.loading = true;
  //   this.item = this.local.get('user');
  //   console.log(this.item);
  //   this.cf.getItemsParm('usuarios', 'email', this.item.email).subscribe(data => {
  //     this.user = [];
  //     data.forEach((element: any) => {
  //       this.user.push({
  //         id: element.payload.doc.id,
  //         ...element.payload.doc.data()
  //       });
  //     });

  //     console.log(this.user);

  //     this.cf.getItemsParm('perfiles', 'name', this.user[0].profile).subscribe(res => {
  //       this.profile = [];
  //       res.forEach((item: any) => {
  //         this.profile.push({
  //           id: item.payload.doc.id,
  //           ...item.payload.doc.data()
  //         });
  //       });
  //       console.log(this.profile);

  //       this.cf.getSubItem('perfiles', this.profile[0].id, 'menus').subscribe(r => {
  //         this.menus = [];
  //         r.forEach((item: any) => {
  //           this.menus.push({
  //             id: item.payload.doc.id,
  //             ...item.payload.doc.data()
  //           });
  //         });
  //         this.loading = false;
  //         console.log(this.menus);
  //       });

  //     });

  //   });
  // }

  // sendItem(item: any): void {
  //   console.log(item);
  //   this.local.remove('item');
  //   this.local.set('item', item);
  //   // window.location.href = '#';
  //   // window.location.reload();
  //   this.router.navigate([item.url]);
  // }

  // // page(url: string): void {
  // //   console.log(url);
  // //   this.router.navigateByUrl(url);
  // // }

}
