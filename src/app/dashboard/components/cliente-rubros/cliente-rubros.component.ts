import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

const USER_INFO = [
  {Fecha: '', Valor: 0},
];

const USER_SCHEMA: { [key: string]: any } = {
  Fecha: 'date',
  Valor: 'number',
  edit: 'edit'
};


@Component({
  selector: 'app-cliente-rubros',
  templateUrl: './cliente-rubros.component.html',
  styleUrls: ['./cliente-rubros.component.css']
})
export class ClienteRubrosComponent implements OnInit {

  nameCol = '';
  displayedColumns: string[] = ['Fecha', 'Valor', 'edit'];
  dataSource = USER_INFO;
  dataSchema = USER_SCHEMA;
  flag = false;
  radio = false;
  modalidad = false;
  f = new FormGroup({});
  fechaActualizado: any;
  filas = Number(this.f.get('valor')?.value);
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.makeForm();
   }

  ngOnInit(): void {
  }

  verCuotasCliente(): void{
    this.nameCol = 'cuotasCliente';
    Swal.fire({
      icon: 'info',
      showConfirmButton: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading();
    console.log(this.nameCol);
    Swal.close();
    this.router.navigate(['/dashboard/' + this.nameCol], { queryParams: { id: 'new' } });
  }

  autorizar(event: MatRadioChange): void {
    console.log(event.value);
    let valorT = 0;
    valorT = Number(this.f.get('valor')?.value);
    let cuota = 0;
    cuota = Number(this.f.get('cuota')?.value);
    const hoy = new Date();
    this.fechaActualizado = this.datePipe.transform(hoy, 'yyyy-MM-dd');
    if (event.value === '1') {
      this.flag = true;
      this.radio = true;
      this.dataSource.forEach((element: any) => {
        element.Fecha = null;
        element.Valor = valorT / cuota;
      });
    }else if (event.value === '2'){
      this.flag = false;
      this.radio = true;
      this.dataSource.forEach((element: any) => {
        element.Fecha = this.fechaActualizado;
        element.Valor = valorT / cuota;
      });
    }else if (event.value === '3'){
      this.flag = false;
      this.radio = true;
      const date = this.fechaActualizado;
      const arr = date.split('-');
      let numberValue = 0;
      let dd = '';
      let mm = '';
      let yyyy = '';
      let fecha = '';
      arr[2] = '01';
      dd += arr[2];
      mm += arr[1];
      numberValue = Number(mm);
      if (numberValue < 12){
        numberValue += 1;
        if (numberValue <= 9){
          mm = '0' + numberValue as unknown as string;
        }else{
          mm = numberValue as unknown as string;
        }
      }else{
        numberValue = 1;
        mm = '0' + numberValue as unknown as string;
      }
      yyyy += arr[0];
      fecha = yyyy + '-' + mm + '-' + dd;
      this.dataSource.forEach((element: any) => {
        element.Fecha = fecha;
        element.Valor = valorT / cuota;
      });
    }else{
      this.flag = false;
      this.radio = false;
    }
  }

  mostrarModalidadCobroV(): void{
    debugger;
    let valor = '';
    let filas = 0;
    valor = this.f.get('valor')?.value;
    filas = Number(this.f.get('cuota')?.value);
    console.log(valor);
    if (valor !== '' ){
      this.mostrarModalidadCobroC(valor);
    }else {
      this.modalidad = false;
      this.flag = false;
      this.radio = false;
      this.dataSource = [];
    }
    for (let i = 0; i < filas; i++) {
      this.dataSource.push({Fecha: '', Valor: 0});
    }
  }

  mostrarModalidadCobroC(valor: any): void{
    let cuota = '';
    cuota = this.f.get('cuota')?.value;
    console.log(valor);
    console.log(cuota);
    if (valor !== undefined){
      if (valor !== '' && cuota !== ''){
        this.modalidad = true;
      }else {
        this.modalidad = false;
        this.flag = false;
        this.radio = false;
        this.dataSource = [];
      }
    }else{
      this.modalidad = false;
      this.flag = false;
      this.radio = false;
      this.dataSource = [];
    }
  }


  get valorNotValid(): any {
    return this.f.get('valor')?.invalid && this.f.get('valor')?.touched;
  }

  get cuotaNotValid(): any {
    return this.f.get('cuota')?.invalid && this.f.get('cuota')?.touched;
  }

  makeForm(): void {
    this.f = this.fb.group({
      valor: ['', [
        Validators.required,
        Validators.minLength(1)
      ]],
      cuota: ['', [
        Validators.required,
        Validators.minLength(1)
      ]],
    });
  }

}
