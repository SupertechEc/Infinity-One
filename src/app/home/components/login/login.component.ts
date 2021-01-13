import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

import Swal from 'sweetalert2';
import { LocalstorageService } from '../../../core/services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: any = {};

  constructor(
    private router: Router,
    private auth: AuthService,
    private local: LocalstorageService
  ) { }

  ngOnInit(): void {
  }

  login(form: NgForm): void {
    if (form.invalid) { return; }

    Swal.fire({
      icon: 'info',
      showConfirmButton: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading();

    this.auth.login(this.usuario)
      .subscribe(resp => {
        this.local.set('user', resp);
        // console.log(resp);
        Swal.close();
        this.auth.authUser(this.usuario.email, this.usuario.password).then(result => {
          console.log(result);
          this.router.navigateByUrl('/dashboard');
        })
          .catch(error => {
            console.error(error);
          });
      }, (err) => {
        console.log(err.error.error.message);
        Swal.fire({
          icon: 'error',
          text: 'El email o clave son incorrectos',
        });
      });
  }

}
