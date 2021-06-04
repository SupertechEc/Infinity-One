import { Component, OnInit } from '@angular/core';
import { FechasLaborablesService } from '../../../core/services/fechas-laborables.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    private fl: FechasLaborablesService,
  ) { }

  ngOnInit(): void {
    const fecha = this.fl.getDate(new Date(), 4);
    console.log(fecha);
  }

}
