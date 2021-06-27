import { Component, OnInit } from '@angular/core';
import { FechasLaborablesService } from '../../../core/services/fechas-laborables.service';
import { ClaveAccesoService } from '../../../core/services/clave-acceso.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    private fl: FechasLaborablesService,
    private ca: ClaveAccesoService,
  ) { }

  ngOnInit(): void {
    const fecha = this.fl.getDate(new Date(), 4);
    console.log(fecha);
    console.log(this.ca.crearClaveAcceso(new Date(), '001', '001', '1', '1234567890001', '1', '02'));
  }

}
