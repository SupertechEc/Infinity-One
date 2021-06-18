import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FechasLaborablesService {

  constructor(
    private datePipe: DatePipe,
  ) { }

  getDate(fecha: Date, plazo: number): Date {
    console.log(fecha.getDay());
    console.log(fecha.getDate());
    fecha.setDate(fecha.getDate() + plazo);
    if (fecha.getDay() === 0) {
      fecha.setDate(fecha.getDate() + 1);
    } else if (fecha.getDay() === 6) {
      fecha.setDate(fecha.getDate() + 2);
    }

    return fecha;

  }
}
