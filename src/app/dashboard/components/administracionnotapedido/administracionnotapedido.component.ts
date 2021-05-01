import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectionFirebaseService } from 'src/app/core/services/conection-firebase.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-administracionnotapedido',
  templateUrl: './administracionnotapedido.component.html',
  styleUrls: ['./administracionnotapedido.component.css']
})
export class AdministracionnotapedidoComponent implements AfterViewInit {

  f = new FormGroup({});
  abastecedora: any[] = [];
  comercializadora: any[] = [];
  terminal: any[] = [];
  item: any[] = [];
  notaPedido: any[] = [];
  displayedColumns: string[] = ['cliente', 'factura', 'numero', 'producto', 'volSolicitado', 'volAutorizado', 'fechaVenta', 'fechaDespacho', 'adelantar', 'autorizar', 'anular'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    private cf: ConectionFirebaseService,
    private fb: FormBuilder,
  ) {
    this.makeForm();
    this.aRoute.queryParams.subscribe(params => {
      console.log(params);
    });
  }

  ngAfterViewInit(): void {
    this.getAbastecedora();
    this.getComercializadora();
    this.getTerminal();
    this.getNotaPedido();

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  makeForm(): void {
    this.f = this.fb.group({
      abastecedoraId: ['', [Validators.required]],
      comercializadoraId: ['', [Validators.required]],
      terminalId: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      datosNotaPedido: this.fb.array([]),
    });
  }

  getAbastecedora(): void {
    this.cf.getItems('abastecedora', 'nombre').subscribe(data => {
      this.abastecedora = [];
      data.forEach((element: any) => {
        this.abastecedora.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.abastecedora);
      // this.getComercializadora(this.abastecedora[0]);
    });
  }

  getComercializadora(): void {
    this.cf.getItems('comercializadora', 'nombre').subscribe(data => {
      this.comercializadora = [];
      data.forEach((element: any) => {
        this.comercializadora.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.comercializadora);
      // this.getComercializadora(this.abastecedora[0]);
    });
  }

  getTerminal(): void {
    this.cf.getItems('terminal', 'nombre').subscribe(data => {
      this.terminal = [];
      data.forEach((element: any) => {
        this.terminal.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.terminal);
      // this.getComercializadora(this.abastecedora[0]);
    });
  }

  getNotaPedido(): void {
    this.cf.getItems('notadepedido', 'codigo').subscribe(data => {
      this.notaPedido = [];
      data.forEach((element: any) => {
        this.notaPedido.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.notaPedido);
      this.dataSource = new MatTableDataSource(this.notaPedido);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // this.getComercializadora(this.abastecedora[0]);
    });
  }

  agregarDatosNotaPedido(
    cli: string, fac: boolean, num: string, pro: string, vols: string,
    vola: string, fv: string, fd: string, ade: boolean, aut: boolean, anu: boolean
  ): void {
    this.datosNotaPedido.push(this.crearDatosNotaPedido(cli, fac, num, pro, vols, vola, fv, fd, ade, aut, anu));
  }

  private crearDatosNotaPedido(
    cli: string, fac: boolean, num: string, pro: string, vols: string,
    vola: string, fv: string, fd: string, ade: boolean, aut: boolean, anu: boolean
  ): any {
    return this.fb.group({
      cliente: [cli],
      factura: [fac],
      numero: [num],
      productoCodigo: [pro],
      volSolicitado: [vols],
      volAutorizado: [vola],
      fechaVenta: [fv],
      fechaDespacho: [fd],
      adelantar: [ade, [Validators.required]],
      autorizar: [aut, [Validators.required]],
      anular: [anu, [Validators.required]]
    });
  }

  eliminarDatosNotaPedido(i: number): void {
    this.datosNotaPedido.removeAt(i);
  }

  get datosNotaPedido(): any {
    return this.f.get('datosNotaPedido') as FormArray;
  }

  get abastecedoraIdNotValid(): any {
    return this.f.get('abastecedoraId')?.invalid && this.f.get('abastecedoraId')?.touched;
  }

  get comercializadoraIdNotValid(): any {
    return this.f.get('comercializadoraId')?.invalid && this.f.get('comercializadoraId')?.touched;
  }

  get terminalIdNotValid(): any {
    return this.f.get('comercializadoraId')?.invalid && this.f.get('comercializadoraId')?.touched;
  }

  changeFilter(num: number): void {

  }

  save(): void {

  }

}
