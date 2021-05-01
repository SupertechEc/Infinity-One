import { Component, OnInit } from '@angular/core';
import { InfinityApiService } from '../../../core/services/infinity-api.service';

@Component({
  selector: 'app-garantia',
  templateUrl: './garantia.component.html',
  styleUrls: ['./garantia.component.css']
})
export class GarantiaComponent implements OnInit {

  constructor(
    private api: InfinityApiService,
  ) { }

  ngOnInit(): void {
  }

  getData(): void {

    this.api.getDataInfinity().subscribe(data => {
      console.log(data);
    });
  }

}
