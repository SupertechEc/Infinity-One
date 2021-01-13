import { Component, OnInit } from '@angular/core';
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

  constructor(
    firestore: AngularFirestore,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private router: Router
  ) {
    this.imageUrl = 'assets/images/AVATAR.svg';
  }

  ngOnInit(): void {
    this.getUser();
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

      this.cf.getItemsParm('perfiles', 'name', this.user[0].profile).subscribe(res => {
        this.profile = [];
        res.forEach((item: any) => {
          this.profile.push({
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          });
        });
        console.log(this.profile);

        this.cf.getSubItem('perfiles', this.profile[0].id, 'menus').subscribe(r => {
          this.menus = [];
          r.forEach((item: any) => {
            this.menus.push({
              id: item.payload.doc.id,
              ...item.payload.doc.data()
            });
          });
          this.loading = false;
          console.log(this.menus);
        });

      });

    });
  }

  sendItem(item: any): void {
    console.log(item);
    this.local.remove('item');
    this.local.set('item', item);
    // window.location.href = '#';
    // window.location.reload();
    this.router.navigate([item.url]);
  }

  // page(url: string): void {
  //   console.log(url);
  //   this.router.navigateByUrl(url);
  // }

}
