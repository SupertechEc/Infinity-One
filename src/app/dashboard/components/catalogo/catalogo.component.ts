import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  items: any[] = [];
  componentes: any[] = [];
  parm: any;
  groupName = '';
  loading = false;
  nameEtiqueta = '';

  constructor(
    private router: Router,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
  ) {
    this.parm = this.local.get('item');
    console.log(this.parm);
  }

  ngOnInit(): void {
    this.getGroups();
  }

  getGroups(): void {
    this.loading = true;
    this.groupName = this.parm.name;
    this.cf.getItemsParm('grupos', 'name', this.groupName).subscribe(data => {
      this.items = [];
      data.forEach((element: any) => {
        this.items.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.items);
      this.getComponentes(this.items[0].id);
    });
  }

  getComponentes(groupId: string): void {
    console.log(groupId);
    this.cf.getItemsParm('componentes', 'groupId', groupId).subscribe(data => {
      this.componentes = [];
      data.forEach((element: any) => {
        this.componentes.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.componentes.sort((a, b) => {

        // Para ordenar por texto
        // if (a.name > b.name) {
        //   return 1;
        // }
        // if (a.name < b.name) {
        //   return -1;
        // }
        // // a must be equal to b
        // return 0;

        // Para ordenar por números
        return a.sequence - b.sequence;

      });
      this.loading = false;
      console.log(this.componentes);
    });
  }

}
