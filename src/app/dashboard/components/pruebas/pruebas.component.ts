import { Component, OnInit } from '@angular/core';
import { InfinityApiService } from 'src/app/core/services/infinity-api.service';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css']
})
export class PruebasComponent implements OnInit {

  constructor(
    private api: InfinityApiService,
  ) { }

  ngOnInit(): void {
  }

  getPruebas(): void {
    this.api.consultasPrueba().then(data => {
      console.log(data);
    });
  }

  getPruebas2(): void {
    this.api.getDataPrueba().subscribe(data => {
      console.log(data);
    });
  }
}
