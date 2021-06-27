import { Injectable } from '@angular/core';
import { ConectionFirebaseService } from '../services/conection-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ElementosService {

  tn: any[] = [];

  constructor(
    private cf: ConectionFirebaseService,
  ) { }

  getNotaPedido(nameCol: string): any {

    if (nameCol === 'notadepedido') {

      return new Promise(resolve => {
        let numram = Math.random();
        numram = 3000 * numram;
        console.log(numram);
        setTimeout(() => {
          this.cf.getItemsParmNP('tablanumero', 'flag', 'L', 'notapedidoId', '').subscribe(data => {
            this.tn = [];
            data.forEach((element: any) => {
              this.tn.push({
                id: element.payload.doc.id,
                ...element.payload.doc.data()
              });
            });
            this.tn.sort((a, b) => {
              return a.numero - b.numero;
            });
            // console.log(this.tn);
            const [arr] = this.tn;
            resolve(arr);
          });
        }, numram);
      });
    }
  }

  quitarAcentos(word: string): string {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
