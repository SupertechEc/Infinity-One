import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClaveAccesoService {

  constructor(
    private datePipe: DatePipe,
  ) { }

  crearClaveAcceso(
    fecha: Date,
    establecimiento: string,
    puntoEmision: string,
    secuencial: string,
    ruc: string,
    ambiente: string,
    tipoDocumento: string): any {
    const simpleFecha = this.datePipe.transform(fecha, 'ddMMyyyy');
    console.log(simpleFecha);
    let claveAcceso = String(simpleFecha);
    claveAcceso = claveAcceso.concat(tipoDocumento);
    claveAcceso = claveAcceso.concat(ruc);
    claveAcceso = claveAcceso.concat(ambiente);
    claveAcceso = claveAcceso.concat(establecimiento);
    claveAcceso = claveAcceso.concat(puntoEmision);
    claveAcceso = claveAcceso.concat(this.generarSecuencial(secuencial));
    claveAcceso = claveAcceso.concat('000009991');
    return claveAcceso + this.obtenerDigitoVerificadorModuloOnce(claveAcceso);
  }

  generarSecuencial(sec: string): any {
    let secuencial = sec;
    const aux = '0';
    for (let i = secuencial.length; i < 9; i++) {
      secuencial = aux + secuencial;
    }
    return secuencial;
  }

  obtenerDigitoVerificadorModuloOnce(item: string): any {
    let a = 2;
    let rutSumado = 0;
    let mulDig = 1;
    const arrayC = this.invertir(item);
    for (let i = 0; i < item.length; i++) {
      mulDig = arrayC[i] * a;
      rutSumado += mulDig;
      if (a === 7) {
        a = 1;
      }
      a++;
    }

    const resto = rutSumado % 11;
    let Digito = String(11 - resto);

    if (Digito === '11') {
      Digito = '0';
    }

    if (Digito === '10') {
      Digito = '1';
    }

    return Digito;
  }

  invertir(item: string): any {
    const itemArray = [...item];
    return itemArray.reverse();
  }

}
