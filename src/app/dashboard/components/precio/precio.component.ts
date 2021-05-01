import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectionFirebaseService } from 'src/app/core/services/conection-firebase.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NullTemplateVisitor } from '@angular/compiler';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precio',
  templateUrl: './precio.component.html',
  styleUrls: ['./precio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrecioComponent implements OnInit {

  selected = new FormControl(0);
  i = 0;
  k = 0;
  s = 0;
  btnflag = false;
  dcp1: string[] = [];
  dcp2: string[] = [];
  dcp3: string[] = [];
  dspaso1!: MatTableDataSource<any>;
  dspaso2!: MatTableDataSource<any>;
  // dspaso3!: MatTableDataSource<any>;
  productos: any[] = [];
  comercializadora: any[] = [];
  compro: any[] = [];
  lptp: any[] = [];
  listTable: any[] = [];
  gravamen: any[] = [];
  terminal: any[] = [];
  detallePrecio: any[] = [];
  datosPreciosList: any[] = [];
  precio: any[] = [];
  precioMatriz: any[] = [];
  selection = new SelectionModel<any>(true, []);
  f = new FormGroup({});
  comflag = false;
  mrb = '';
  btnNext = 'Siguiente';
  tabla1 = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    private cf: ConectionFirebaseService,
    private fb: FormBuilder,
  ) {
    this.makeForm();
    // this.dcp1 = ['select', 'producto', 'medida', 'margen', 'pepp', 'pvs', 'iva'];
    this.dcp1 = ['producto', 'medida', 'precio', 'pvc', 'pepp', 'dpcg1', 'dpcg2', 'dpcg4', 'dpcg5', 'dpcg6', 'dpcg9'];
    this.dcp2 = ['terminal', 'producto', 'medida', 'precio', 'valor'];
  }

  ngOnInit(): void {
    // this.getProducto();
    this.getComercializadora();
    this.getTerminal();
    this.getGravamen();
  }

  makeForm(): void {
    this.f = this.fb.group({
      comercializadoraCodigo: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: [''],
      comentario: ['', [Validators.required]],
      estatus: [true],
      configTerminal: ['', [Validators.required]],
      datosPrecios: this.fb.array([]),
    });
  }

  changeRadioButton(valor: number): void {
    if (valor === 1) {
      this.mrb = 'Para todos los terminales';
    } else {
      this.mrb = 'Configuración por terminal';
    }
  }

  agregardatosPrecios(
    pid: string, sel: boolean, pc: string, pn: string, mc: string, ma: string, mar: string, pe: string, ps: string, si: boolean
  ): void {
    this.datosPrecios.push(this.crearDatoPrecio(pid, sel, pc, pn, mc, ma, mar, pe, ps, si));
  }

  private crearDatoPrecio(
    pid: string, sel: boolean, pc: string, pn: string, mc: string, ma: string, mar: string, pe: string, ps: string, si: boolean
  ): any {
    return this.fb.group({
      pid: [pid],
      select: [sel, [Validators.required]],
      productoCodigo: [pc],
      productoNombre: [pn],
      medidaCodigo: [mc],
      medidaAbreviacion: [ma],
      margen: [mar, [Validators.required]],
      precioEPP: [pe, [Validators.required]],
      precioSugerido: [ps, [Validators.required]],
      soloIVA: [si, [Validators.required]]
    });
  }

  eliminarDatoPrecio(i: number): void {
    this.datosPrecios.removeAt(i);
  }

  get datosPrecios(): any {
    return this.f.get('datosPrecios') as FormArray;
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
    });
  }

  getProductos(id: string): void {
    this.datosPrecios.clear();
    console.log('repite');
    this.cf.getItemsParm('comercializadoraproducto', 'comercializadoraId', id).subscribe(data => {
      this.compro = [];
      data.forEach((element: any) => {
        this.compro.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.comflag = true;
      console.log(this.compro);
      this.cf.getSubItem('comercializadoraproducto', this.compro[0].id, 'productos').subscribe(d => {
        console.log('bucle' + this.i);
        this.productos = [];
        if (this.i === 0) {
          this.tabla1 = true;
          d.forEach((element: any) => {
            this.productos.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            });
            const pid = element.payload.doc.id;
            const pc = element.payload.doc.data().productoCodigo;
            const pn = element.payload.doc.data().productoNombre;
            const mc = element.payload.doc.data().medidaCodigo;
            const ma = element.payload.doc.data().medidaAbreviacion;
            const mar = element.payload.doc.data().margen;
            const pe = element.payload.doc.data().precioEPP;
            const ps = element.payload.doc.data().precioSugerido;
            const si = element.payload.doc.data().soloIVA;
            // console.log('pc: ' + pc + ' pn: ' + pn + ' ma: ' + ma);
            this.agregardatosPrecios(pid, false, pc, pn, mc, ma, mar, pe, ps, si);
          });
          console.log(this.productos);
          // this.dspaso1 = new MatTableDataSource(this.productos);
          // this.dspaso1.paginator = this.paginator;
          // this.dspaso1.sort = this.sort;
        }
      });
    });

  }

  getGravamen(): void {
    this.cf.getItems('gravamen', 'nombre').subscribe(g => {
      this.gravamen = [];
      g.forEach((element: any) => {
        this.gravamen.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      this.gravamen.sort((a, b) => {

        // Para ordenar por texto
        if (a.secuencial > b.secuencial) {
          return 1;
        }
        if (a.secuencial < b.secuencial) {
          return -1;
        }
        // a must be equal to b
        return 0;

        // Para ordenar por números
        // return a.sequence - b.sequence;

      });
      console.log(this.gravamen);
    });
  }

  changeMatTab(accion: string): void {
    const value = this.f.value;
    this.datosPreciosList = value.datosPrecios;
    value.datosPrecios.forEach((d: any) => {
      if (d.select) {
        this.s++;
      }
    });
    if (accion === 'siguiente') {
      console.log(accion);
      if (this.i < 4) {
        if (value.comercializadoraCodigo === '' ||
          value.fechaInicio === '' ||
          value.comentario === '' ||
          value.estatus === '' ||
          value.configTerminal === '' || this.s === 0) {
          Swal.fire({
            icon: 'error',
            text: 'Se deben llenar todos los datos',
          });
          this.i = 0;
        } else {
          this.i++;
          console.log(this.i);
          this.selected = new FormControl(this.i);
          if (this.i === 1) {
            this.lptp = [];
            this.listTable = [];
            console.log(this.datosPreciosList);
            this.cf.getItemsParm('listaprecioterminalproducto', 'comercializadoraCodigo', this.compro[0].comercializadoraCodigo)
              .subscribe(dat => {
                dat.forEach((element: any) => {
                  this.lptp.push({
                    id: element.payload.doc.id,
                    ...element.payload.doc.data()
                  });
                });
                this.lptp = this.lptp.filter(d => d.terminalCodigo === '02');
                console.log(this.compro);
                // console.log(this.productos);
                console.log(this.lptp);
                this.lptp.forEach((e: any) => {
                  e.datosProductos.forEach((dp: any) => {
                    this.listTable.push({
                      comercializadoraProductoId: this.compro[0].id,
                      comercializadoraCodigo: e.comercializadoraCodigo,
                      comercializadoraNombre: e.comercializadoraNombre,
                      listaPrecioCodigo: e.listaPrecioCodigo,
                      listaPrecioNombre: e.listaPrecioNombre,
                      terminalCodigo: e.terminalCodigo,
                      terminalNombre: e.terminalNombre,
                      tipoListaPrecio: e.tipoListaPrecio,
                      margenvalorcomercializadora: e.margenvalorcomercializadora,
                      margenporcentaje: e.margenporcentaje,
                      estatus: e.estatus,
                      ...dp
                    });
                  });
                });
                console.log(this.listTable);
                this.datosPreciosList.forEach((val: any) => {
                  console.log(val);
                  if (!val.select) {
                    console.log(val.productoCodigo);
                    this.listTable = this.listTable.filter(lt => lt.productoCodigo !== val.productoCodigo);
                  }
                });
                console.log(this.listTable);
                this.listTable = this.listTable.filter(lt => lt.estatus === true);
                console.log(this.listTable);
                this.listTable.forEach((r: any) => {
                  let dpcg1 = 0;
                  let dpcg4 = 0;
                  let dpcg9 = 0;
                  let dpcg2 = 0;
                  let dpcg5 = 0;
                  let dpcg6 = 0;
                  this.datosPreciosList.forEach((dp: any) => {
                    if (r.productoCodigo === dp.productoCodigo) {
                      r.precioSugerido = dp.precioSugerido;
                      r.precioEPP = dp.precioEPP;
                      r.soloIVA = dp.soloIVA;
                      r.poductosId = dp.pid;
                      const comproductos = {
                        precioSugerido: dp.precioSugerido,
                        precioEPP: dp.precioEPP,
                        margen: dp.margen,
                        fechaActualizacion: new Date(),
                        soloIVA: dp.soloIVA,
                      };
                      console.log(dp);
                      this.cf.editSubItem('comercializadoraproducto', r.comercializadoraProductoId, 'productos', r.poductosId, comproductos);
                      this.gravamen.forEach((g: any) => {
                        if (g.codigo === '0001') {
                          // console.log(dp.precioEPP);
                          // console.log(g.valorDefecto);
                          dpcg1 = Number((dp.precioEPP / g.valorDefecto).toFixed(6));
                          r.gravamenCodigo1 = g.codigo;
                          r.gravamenNombre = g.nombre;
                          r.dpcg1 = Number((dp.precioEPP / g.valorDefecto).toFixed(6));
                          this.detallePrecio.push({ ...r });
                          console.log('Formula ' + g.codigo + ':' + r.dpcg1);
                        } else if (g.codigo === '0004') {
                          if (r.tipoListaPrecio === 'MCO') {
                            // console.log(dp.margen);
                            // console.log(r.margenvalorcomercializadora);
                            dpcg4 = Number((dp.margen * (r.margenvalorcomercializadora / 100)).toFixed(6));
                            r.gravamenCodigo4 = g.codigo;
                            r.gravamenNombre = g.nombre;
                            r.dpcg4 = Number((dp.margen * (r.margenvalorcomercializadora / 100)).toFixed(6));
                            this.detallePrecio.push({ ...r });
                            console.log('Formula ' + g.codigo + ':' + r.dpcg4);
                          } else {
                            // console.log(dpcg1);
                            // console.log(r.margenporcentaje);
                            dpcg4 = Number((dpcg1 * (r.margenporcentaje / 100)).toFixed(6));
                            r.gravamenCodigo4 = g.codigo;
                            r.gravamenNombre = g.nombre;
                            r.dpcg4 = Number((dpcg1 * (r.margenporcentaje / 100)).toFixed(6));
                            this.detallePrecio.push({ ...r });
                            console.log('Formula ' + g.codigo + ':' + r.dpcg4);
                          }
                        } else if (g.codigo === '0009') {
                          dpcg9 = Number((dpcg1 + dpcg4).toFixed(6));
                          r.gravamenCodigo9 = g.codigo;
                          r.gravamenNombre = g.nombre;
                          r.dpcg9 = Number((dpcg1 + dpcg4).toFixed(6));
                          this.detallePrecio.push({ ...r });
                          console.log('Formula ' + g.codigo + ':' + r.dpcg9);
                        } else if (g.codigo === '0002') {
                          dpcg2 = Number((dpcg9 * g.valorDefecto).toFixed(6));
                          r.gravamenCodigo2 = g.codigo;
                          r.gravamenNombre = g.nombre;
                          r.dpcg2 = Number((dpcg9 * g.valorDefecto).toFixed(6));
                          this.detallePrecio.push({ ...r });
                          console.log('Formula ' + g.codigo + ':' + r.dpcg2);
                        } else if (g.codigo === '0005') {
                          if (r.soloIVA) {
                            dpcg5 = 0;
                            r.gravamenCodigo5 = g.codigo;
                            r.gravamenNombre = g.nombre;
                            r.dpcg5 = 0;
                            this.detallePrecio.push({ ...r });
                            console.log('Formula ' + g.codigo + ':' + r.dpcg5);
                          } else {
                            dpcg5 = Number(((r.precioSugerido - dpcg9) * g.valorDefecto).toFixed(6));
                            r.gravamenCodigo5 = g.codigo;
                            r.gravamenNombre = g.nombre;
                            r.dpcg5 = Number(((r.precioSugerido - dpcg9) * g.valorDefecto).toFixed(6));
                            this.detallePrecio.push({ ...r });
                            console.log('Formula ' + g.codigo + ':' + r.dpcg5);
                          }
                        } else if (g.codigo === '0006') {
                          if (r.soloIVA) {
                            dpcg6 = 0;
                            r.gravamenCodigo6 = g.codigo;
                            r.gravamenNombre = g.nombre;
                            r.dpcg6 = 0;
                            this.detallePrecio.push({ ...r });
                            console.log('Formula ' + g.codigo + ':' + r.dpcg6);
                          } else {
                            dpcg6 = Number((dpcg9 * g.valorDefecto).toFixed(6));
                            r.gravamenCodigo6 = g.codigo;
                            r.gravamenNombre = g.nombre;
                            r.dpcg6 = Number((dpcg9 * g.valorDefecto).toFixed(6));
                            this.detallePrecio.push({ ...r });
                            console.log('Formula ' + g.codigo + ':' + r.dpcg6);
                          }
                        }
                      });
                    }
                  });
                });
                console.log(value.datosPrecios);
              });
          }
        }
        console.log(this.listTable);
        console.log(this.detallePrecio);
        if (this.i === 0) {
          this.detallePrecio = [];
        }
        // this.dspaso1 = new MatTableDataSource(this.listTable);
        // this.dspaso1.paginator = this.paginator;
        // this.dspaso1.sort = this.sort;
        // this.datosPrecios.clear();
      }
    } else {
      console.log(accion);
      if (this.i > 0) {
        this.i--;
        console.log(this.i);
        if (this.i === 0) {
          this.detallePrecio = [];
        }
        this.selected = new FormControl(this.i);
      }
    }

    if (this.i > 0) {
      this.btnflag = true;
    } else {
      this.btnflag = false;
    }

    if (this.i > 2) {
      this.btnNext = 'Guardar';
      let k = 0;
      let precio = {};
      let detalleprecio = {};
      this.terminal.forEach((t: any) => {
        this.listTable.forEach((lt: any) => {
          precio = {
            comercializadoraCodigo: lt.comercializadoraCodigo,
            comercializadoraNombre: lt.comercializadoraNombre,
            terminalCodigo: t.codigo,
            terminalNombre: t.nombre,
            productoCodigo: lt.productoCodigo,
            productoNombre: lt.productoNombre,
            medidaAbreviacion: lt.medidaAbreviacion,
            listaPrecioCodigo: lt.listaPrecioCodigo,
            listaPrecioNombre: lt.listaPrecioNombre,
            fechaInicio: value.fechaInicio,
            secuencial: '1',
            codigo: 'A00000000001',
            fechaFin: 'Null',
            activo: true,
            observacion: value.comentario,
            precioProducto: lt.dpcg9,
          };
          this.precioMatriz.push(precio);
          this.cf.agregarItem(precio, 'precio');
        });
      });
      console.log(this.precioMatriz);
      this.dspaso2 = new MatTableDataSource(this.precioMatriz);
      this.dspaso2.paginator = this.paginator;
      this.dspaso2.sort = this.sort;
      if (this.i === 4) {
        this.cf.getItems('precio', 'terminalNombre').subscribe(data => {
          this.precio = [];
          data.forEach((element: any) => {
            this.precio.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            });
          });

          let cg = '';
          let ng = '';
          let vg = '';
          let pid = '';
          let pcomercializadoraCodigo = '';
          let pcomercializadoraNombre = '';
          let pterminalCodigo = '';
          let pterminalNombre = '';
          let pproductoCodigo = '';
          let pproductoNombre = '';
          let pmedidaAbreviacion = '';
          let plistaPrecioCodigo = '';
          let plistaPrecioNombre = '';
          if (k === 0) {
            console.log(k++);
            console.log(this.precio);
            this.precio.forEach((p: any) => {
              this.gravamen.forEach((g: any) => {
                // console.log(this.listTable);
                // console.log(k++);
                if (g.codigo !== '0003') {
                  this.listTable.forEach((lt: any) => {
                    if (lt.listaPrecioCodigo === p.listaPrecioCodigo) {
                      if (lt.productoCodigo === p.productoCodigo) {
                        if (lt.gravamenCodigo1 === g.codigo) {
                          cg = g.codigo;
                          ng = g.nombre;
                          vg = lt.dpcg1;
                          pid = p.id;
                          pcomercializadoraCodigo = p.comercializadoraCodigo;
                          pcomercializadoraNombre = p.comercializadoraNombre;
                          pterminalCodigo = p.terminalCodigo;
                          pterminalNombre = p.terminalNombre;
                          pproductoCodigo = p.productoCodigo;
                          pproductoNombre = p.productoNombre;
                          pmedidaAbreviacion = p.medidaAbreviacion;
                          plistaPrecioCodigo = p.listaPrecioCodigo;
                          plistaPrecioNombre = p.listaPrecioNombre;
                        } else if (lt.gravamenCodigo2 === g.codigo) {
                          cg = g.codigo;
                          ng = g.nombre;
                          vg = lt.dpcg2;
                          pid = p.id;
                          pcomercializadoraCodigo = p.comercializadoraCodigo;
                          pcomercializadoraNombre = p.comercializadoraNombre;
                          pterminalCodigo = p.terminalCodigo;
                          pterminalNombre = p.terminalNombre;
                          pproductoCodigo = p.productoCodigo;
                          pproductoNombre = p.productoNombre;
                          pmedidaAbreviacion = p.medidaAbreviacion;
                          plistaPrecioCodigo = p.listaPrecioCodigo;
                          plistaPrecioNombre = p.listaPrecioNombre;
                        } else if (lt.gravamenCodigo4 === g.codigo) {
                          cg = g.codigo;
                          ng = g.nombre;
                          vg = lt.dpcg4;
                          pid = p.id;
                          pcomercializadoraCodigo = p.comercializadoraCodigo;
                          pcomercializadoraNombre = p.comercializadoraNombre;
                          pterminalCodigo = p.terminalCodigo;
                          pterminalNombre = p.terminalNombre;
                          pproductoCodigo = p.productoCodigo;
                          pproductoNombre = p.productoNombre;
                          pmedidaAbreviacion = p.medidaAbreviacion;
                          plistaPrecioCodigo = p.listaPrecioCodigo;
                          plistaPrecioNombre = p.listaPrecioNombre;
                        } else if (lt.gravamenCodigo5 === g.codigo) {
                          cg = g.codigo;
                          ng = g.nombre;
                          vg = lt.dpcg5;
                          pid = p.id;
                          pcomercializadoraCodigo = p.comercializadoraCodigo;
                          pcomercializadoraNombre = p.comercializadoraNombre;
                          pterminalCodigo = p.terminalCodigo;
                          pterminalNombre = p.terminalNombre;
                          pproductoCodigo = p.productoCodigo;
                          pproductoNombre = p.productoNombre;
                          pmedidaAbreviacion = p.medidaAbreviacion;
                          plistaPrecioCodigo = p.listaPrecioCodigo;
                          plistaPrecioNombre = p.listaPrecioNombre;
                        } else if (lt.gravamenCodigo6 === g.codigo) {
                          cg = g.codigo;
                          ng = g.nombre;
                          vg = lt.dpcg6;
                          pid = p.id;
                          pcomercializadoraCodigo = p.comercializadoraCodigo;
                          pcomercializadoraNombre = p.comercializadoraNombre;
                          pterminalCodigo = p.terminalCodigo;
                          pterminalNombre = p.terminalNombre;
                          pproductoCodigo = p.productoCodigo;
                          pproductoNombre = p.productoNombre;
                          pmedidaAbreviacion = p.medidaAbreviacion;
                          plistaPrecioCodigo = p.listaPrecioCodigo;
                          plistaPrecioNombre = p.listaPrecioNombre;
                        } else {
                          cg = g.codigo;
                          ng = g.nombre;
                          vg = lt.dpcg9;
                          pid = p.id;
                          pcomercializadoraCodigo = p.comercializadoraCodigo;
                          pcomercializadoraNombre = p.comercializadoraNombre;
                          pterminalCodigo = p.terminalCodigo;
                          pterminalNombre = p.terminalNombre;
                          pproductoCodigo = p.productoCodigo;
                          pproductoNombre = p.productoNombre;
                          pmedidaAbreviacion = p.medidaAbreviacion;
                          plistaPrecioCodigo = p.listaPrecioCodigo;
                          plistaPrecioNombre = p.listaPrecioNombre;
                        }
                        detalleprecio = {
                          comercializadoraCodigo: pcomercializadoraCodigo,
                          comercializadoraNombre: pcomercializadoraNombre,
                          terminalCodigo: pterminalCodigo,
                          terminalNombre: pterminalNombre,
                          productoCodigo: pproductoCodigo,
                          productoNombre: pproductoNombre,
                          medidaAbreviacion: pmedidaAbreviacion,
                          listaPrecioCodigo: plistaPrecioCodigo,
                          listaPrecioNombre: plistaPrecioNombre,
                          fechaInicio: value.fechaInicio,
                          secuencial: '1',
                          codigo: 'A00000000001',
                          codigoGravamen: cg,
                          nombreGravamen: ng,
                          valor: vg,
                        };
                        // console.log(detalleprecio);
                        // console.log(pid);
                        this.cf.agregarSubItem('precio', pid, 'detalleprecio', detalleprecio);
                        this.router.navigate(['/dashboard/detalle-lista-precios'], { queryParams: { nombre: 'PRECIO' } });
                      }
                    }
                  });
                }
              });
            });
          }

        });
      }
    } else {
      this.btnNext = 'Siguiente';
    }

  }

  back(): void {
    this.router.navigate(['/dashboard/detalle-lista-precios'], { queryParams: { nombre: 'LISTA PRECIO' } });
  }

  delItem(item: any, id: string): void {

  }

  editItem(item: any): void {

  }

}
