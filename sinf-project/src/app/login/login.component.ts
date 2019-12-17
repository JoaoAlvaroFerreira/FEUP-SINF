import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Router} from '@angular/router'



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  credentials = {username: '', password: ''};
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onPress(){
    if((this.credentials.username == "CEO"||this.credentials.username == "Manager" || this.credentials.username == "developer") && this.credentials.password == "password"){
    environment.username = this.credentials.username;
    environment.password = this.credentials.password;

    this.router.navigateByUrl('/visaogeral');
    }
  }
}
