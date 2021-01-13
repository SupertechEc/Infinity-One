import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  existItem(control: FormControl): Promise<any> | Observable<any> {

    if (!control.value) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'strider') {
          resolve({ existe: true });
        } else {
          resolve(null);
        }
      }, 3500);
    });

  }

  correctApellido(control: FormControl): any {

    // console.log(control.value?.toLowerCase());
    if (control.value?.toLowerCase() === 'guaman') {
      return {
        noApellido: true
      };
    }

    return null;

  }

  passwordsIguales(pass1Name: string, pass2Name: string): any {

    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }

    };

  }

}
