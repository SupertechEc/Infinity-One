import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';

@Component({
  selector: 'app-dialog-listaprecio',
  templateUrl: './dialog-listaprecio.component.html',
  styleUrls: ['./dialog-listaprecio.component.css']
})
export class DialogListaprecioComponent implements OnInit {

  item: any;
  lptp: any[] = [];
  flag = false;

  constructor(
    private dialogRef: MatDialogRef<DialogListaprecioComponent>,
    @Inject(MAT_DIALOG_DATA) item: any,
    private cf: ConectionFirebaseService,
  ) {
    this.item = item;
    console.log(this.item);
    this.cf.getItemsParm('listaprecioterminalproducto', 'listaPrecioId', this.item.id).subscribe(r => {
      this.lptp = [];
      r.forEach((element: any) => {
        this.lptp.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.flag = true;
      console.log(this.lptp);
    });
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
