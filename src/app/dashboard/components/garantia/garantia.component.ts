import { Component, OnInit } from '@angular/core';
import { InfinityApiService } from '../../../core/services/infinity-api.service';

@Component({
  selector: 'app-garantia',
  templateUrl: './garantia.component.html',
  styleUrls: ['./garantia.component.css']
})
export class GarantiaComponent implements OnInit {

  item: any;
  comercializadora = '';
  actualizadoal = '';
  valortotal = '';
  valoratresdias = '';
  noventayocho = '';
  saldo = '';
  saldodisponible = '';
  porcentajeusado = '';

  constructor(
    private api: InfinityApiService,
  ) { }

  ngOnInit(): void {
  }

  getData(): void {

    this.api.getDataInfinity().subscribe(data => {
      console.log(data);
      this.comercializadora = data.COMERCIALIZADORA;
      this.actualizadoal = data.ACTUALIZADOAL.substring(0, 19);
      this.valortotal = data.VALORTOTAL;
      this.valoratresdias = data.VALORATRESDIAS;
      this.noventayocho = data.NOVENTAYOCHO;
      this.saldo = data.SALDO.substring(1);
      this.saldodisponible = data.SALDODISPONIBLE;
      this.porcentajeusado = data.PORCENTAJEUSADO;
    });
  }

}
