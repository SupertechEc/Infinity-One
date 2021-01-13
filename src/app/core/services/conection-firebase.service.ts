import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConectionFirebaseService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  agregarItem(item: any, col: string): Promise<any> {
    return this.firestore.collection(col).add(item);
  }

  getSubItem(col: string, id: string, subcol: string): Observable<any> {
    return this.firestore.collection(col).doc(id).collection(subcol).snapshotChanges();
  }

  getItems(coll: string, ord: string): Observable<any> {
    return this.firestore.collection(coll, ref => ref.orderBy(ord)).snapshotChanges();
  }

  getItemsParm(coll: string, column: string, parm: string): Observable<any> {
    return this.firestore.collection(coll,
      ref => ref.where(column, '==', parm)
    ).snapshotChanges();
  }

  deleteItem(col: string, id: string): Promise<any> {
    return this.firestore.collection(col).doc(id).delete();
  }

  getItemData(col: string, id: string): Observable<any> {
    return this.firestore.collection(col).doc(id).snapshotChanges();
  }

  editItem(col: string, id: string, item: any): Promise<any> {
    return this.firestore.collection(col).doc(id).update(item);
  }

}
