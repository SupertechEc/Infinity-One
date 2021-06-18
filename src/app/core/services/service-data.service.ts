import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {

  item: any;
  items: Observable<any[]> | undefined;
  data: any[] = [];

  constructor(
    private firestore: AngularFirestore
  ) { }

  getData(coll: string, col: string): any {
    return this.firestore.collection<any>(coll, ref => ref.orderBy(col))
      .snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }

  getDataParm(coll: string, col: string, parm: any): any {
    return this.firestore.collection<any>(coll, ref => ref.where(col, '==', parm))
      .snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }

  getDataSub(coll: string, colId: string, subcol: string): any {
    return this.firestore.collection<any>(coll).doc(colId).collection(subcol)
      .snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }

  getDataArray(coll: string, col: string, items: any): any {
    return this.getData(coll, col).subscribe((r: any) => {
      r = r.filter((v: any) => v.listaprecioCodigo = items.codigoListaPrecio);
      // r = r.filter((v: any) => v.comercializadoraCodigo = items.codigoComercializadora);
      // r = r.filter((v: any) => v.medidaCodigo = items.codigoMedida);
      // r = r.filter((v: any) => v.medidaAbreviacion = 'GLS');
      // r = r.filter((v: any) => v.productoCodigo = items.codigoProducto);
      // r = r.filter((v: any) => v.listaprecioCodigo = items.codigoListaPrecio);
      return r;
    });
  }

}
