import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConectionFirebaseService {

  id = '';

  constructor(
    private firestore: AngularFirestore
  ) { }

  agregarItem(item: any, col: string): Promise<any> {
    return this.firestore.collection(col).add(item);
  }

  agregarItemNP(item: any, col: string): Promise<any> {
    return this.firestore.collection(col).add(item);
  }

  agregarSubItem(col: string, id: string, subcol: string, item: any): Promise<any> {
    return this.firestore.collection(col).doc(id).collection(subcol).add(item);
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

  getItemsParmNumber(coll: string, column: string, parm: number): Observable<any> {
    // console.log(coll + ' ' + column + ' ' + parm);
    return this.firestore.collection(coll,
      ref => ref.where(column, '==', parm)
    ).snapshotChanges();
  }

  getItemsParmNP(coll: string, column: string, parm: string, column2: string, parm2: string): Observable<any> {
    console.log(parm2);
    return this.firestore.collection(coll,
      ref => ref.where(column, '==', parm).where(column2, '==', parm2)
    ).snapshotChanges();
  }

  deleteItem(col: string, id: string): Promise<any> {
    return this.firestore.collection(col).doc(id).delete();
  }

  deleteSubItem(col: string, id: string, subcol: string, subId: string): Promise<any> {
    return this.firestore.collection(col).doc(id).collection(subcol).doc(subId).delete();
  }

  getItemData(col: string, id: string): Observable<any> {
    return this.firestore.collection(col).doc(id).snapshotChanges();
  }

  editItem(col: string, id: string, item: any): Promise<any> {
    return this.firestore.collection(col).doc(id).update(item);
  }

  editSubItem(col: string, id: string, subcol: string, subId: string, item: any): Promise<any> {
    return this.firestore.collection(col).doc(id).collection(subcol).doc(subId).update(item);
  }

}
