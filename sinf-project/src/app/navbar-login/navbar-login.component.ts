import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-login',
  templateUrl: './navbar-login.component.html',
  styleUrls: ['./navbar-login.component.css']
})
export class NavbarLoginComponent implements OnInit {
  title = '360º Company Dashboard';
  constructor() { }

  ngOnInit() {
  }

}
