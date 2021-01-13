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
  id: string | null;
  name = '';

  constructor(
    private router: Router,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private aRoute: ActivatedRoute
  ) {
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.getNameGroup(this.id);
  }

  ngOnInit(): void {
  }

  getNameGroup(id: any): void {
    this.loading = true;
    this.cf.getItemData('componentes', id).subscribe(data => {
      this.name = data.payload.data().name;
      console.log(this.name);
      this.getGroups(this.name);
    });
  }

  getGroups(name: any): void {
    this.cf.getItemsParm('grupos', 'name', name).subscribe(data => {
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

  getComponentes(groupId: any): void {
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
        return a.sequence - b.sequence;
      });
      this.loading = false;
      console.log(this.componentes);
    });
  }

}
