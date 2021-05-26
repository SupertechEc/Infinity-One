import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  sideBarOpen = true;

  screenWidth: any;
  screenHeight: any;

  flag = false;

  constructor() {
    // this.screenWidth = window.innerWidth;
    // this.screenHeight = window.innerHeight;
    // console.log(this.screenWidth);
    // console.log(this.screenHeight);
  }

  ngOnInit(): void {
  }

  // @HostListener('window:resize', ['$event'])

  // onResize(event: Event): void {
  //   this.screenWidth = window.innerWidth;
  //   this.screenHeight = window.innerHeight;
  //   if (this.screenWidth < 701) {
  //     this.sideBarOpen = false;
  //   }
  //   else {
  //     this.sideBarOpen = true;
  //   }
  //   // console.log(this.sideBarOpen);
  // }

  sideBarToggler(event: Event): void {
    // this.flag = true;
    this.sideBarOpen = !this.sideBarOpen;
    console.log(this.flag);
  }

}
