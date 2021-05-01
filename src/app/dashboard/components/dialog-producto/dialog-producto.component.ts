import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConectionFirebaseService } from '../../../core/services/conection-firebase.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-producto',
  templateUrl: './dialog-producto.component.html',
  styleUrls: ['./dialog-producto.component.css']
})
export class DialogProductoComponent implements OnInit {

  f = new FormGroup({});
  message = '';
  item: any;
  producto: any[] = [];
  medida: any[] = [];
  prod: any;
  medi: any;
  activo = false;
  inactivo = false;
  indeterminate = false;
  color = '';
  stylecolor = '';
  labelPosition = 'after';
  btname = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogProductoComponent>,
    @Inject(MAT_DIALOG_DATA) item: any,
    private cf: ConectionFirebaseService,
    private local: LocalstorageService,
    private toastr: ToastrService,
  ) {
    this.makeForm();
    this.item = item;
    if (this.item.tipo === 'new') {
      this.btname = 'Agregar';
    } else {
      this.btname = 'Editar';
    }
  }

  ngOnInit(): void {
    this.getProducto();
    this.getMedida();
    this.getDataItem();
  }

  setChange(cambio: boolean): any {
    if (cambio == null) {
      return;
    }
    if (cambio) {
      this.activo = true;
      this.inactivo = false;
      this.color = 'primary';
      this.indeterminate = false;
      this.stylecolor = '#66bb6a';
    } else {
      this.activo = false;
      this.inactivo = true;
      this.color = 'warn';
      this.indeterminate = true;
      this.stylecolor = '#ef5350';
    }
  }

  makeForm(): void {
    this.f = this.fb.group({
      productoId: ['', [Validators.required]],
      medidaId: ['', [Validators.required]],
      estatus: ['', [Validators.required]],
      margen: ['', [Validators.required]],
      precioEPP: ['', [Validators.required]],
      precioSugerido: ['', [Validators.required]],
      soloIVA: [false, [Validators.required]]
    });

  }

  getDataItem(): void {
    console.log(this.item);
    if (this.item.tipo === 'edit') {
      this.f.setValue({
        productoId: this.item.productoId,
        medidaId: this.item.medidaId,
        estatus: this.item.estatus,
        margen: this.item.margen,
        precioEPP: this.item.precioEPP,
        precioSugerido: this.item.precioSugerido,
        soloIVA: this.item.soloIVA
      });
      // if (!this.item.margen || !this.item.precioEPP || !this.item.precioSugerido || !this.item.soloIVA) {
      //   this.f.setValue({
      //     productoId: this.item.productoId,
      //     medidaId: this.item.medidaId,
      //     estatus: this.item.estatus,
      //     margen: '',
      //     precioEPP: '',
      //     precioSugerido: '',
      //     soloIVA: ''
      //   });
      // } else {
      //   this.f.setValue({
      //     productoId: this.item.productoId,
      //     medidaId: this.item.medidaId,
      //     estatus: this.item.estatus,
      //     margen: this.item.margen,
      //     precioEPP: this.item.precioEPP,
      //     precioSugerido: this.item.precioSugerido,
      //     soloIVA: this.item.soloIVA
      //   });
      // }
      this.setChange(this.item.estatus);
    }
  }

  getProducto(): void {
    this.cf.getItems('producto', 'nombre').subscribe(data => {
      this.producto = [];
      data.forEach((element: any) => {
        this.producto.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.producto);
    });
  }

  getMedida(): void {
    this.cf.getItems('medida', 'nombre').subscribe(data => {
      this.medida = [];
      data.forEach((element: any) => {
        this.medida.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.medida);
    });
  }

  get estatusNotValid(): any {
    return this.f.get('estatus')?.invalid && this.f.get('estatus')?.touched;
  }

  get productoIdNotValid(): any {
    return this.f.get('productoId')?.invalid && this.f.get('productoId')?.touched;
  }

  get medidaIdNotValid(): any {
    return this.f.get('medidaId')?.invalid && this.f.get('medidaId')?.touched;
  }

  cathProducto(pro: any): void {
    this.prod = pro;
  }

  cathMedida(med: any): void {
    this.medi = med;
  }

  save(): void {
    console.log(this.prod);
    console.log(this.medi);
    if (this.f.valid) {
      const value = this.f.value;
      if (this.prod) {
        value.productoCodigo = this.prod.codigo;
        value.productoNombre = this.prod.nombre;
      }

      if (this.medi) {
        value.medidaCodigo = this.medi.codigo;
        value.medidaNombre = this.medi.nombre;
        value.medidaAbreviacion = this.medi.abreviacion;
      }

      if (this.item.tipo === 'new') {
        value.fechaCreacion = new Date();
        console.log('nuevo');
        console.log(value);
        this.cf.agregarSubItem(this.item.colName, this.item.colId, 'productos', value).then(() => {
          console.log('Item registrado con exito');
          this.toastr.success('Item registrado con exito', 'Item Registrado', {
            positionClass: 'toast-bottom-right'
          });
          this.dialogRef.close();
        }).catch(error => {
          console.log(error);
        });
      } else {
        value.fechaActualizacion = new Date();
        console.log('editar');
        console.log(value);
        this.cf.editSubItem(this.item.colName, this.item.colId, 'productos', this.item.id, value).then(() => {
          console.log('Item editado con exito');
          this.toastr.success('Item editado con exito', 'Item Editado', {
            positionClass: 'toast-bottom-right'
          });
          this.dialogRef.close();
        }).catch(error => {
          console.log(error);
        });
      }
    }

  }

  close(): void {
    this.dialogRef.close();
  }

}
