import { Component, OnInit } from '@angular/core';
import { ApiInteractions } from './../downloader/api_interactions';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-api-tester',
  templateUrl: './api-tester.component.html',
  styleUrls: ['./api-tester.component.css']
})
export class ApiTesterComponent implements OnInit {
  a;
  b;
  constructor() {
    this.a = "hi, this is the api not working yet";
    this.b = new ApiInteractions();
   }

  ngOnInit() {
  }

  apicall(){
    this.a = "in api call";
    this.a = this.b.get("");
  
  }
}
