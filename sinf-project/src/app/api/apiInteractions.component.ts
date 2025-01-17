import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './api.service'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-apiInteraction',
  templateUrl: './apiInteraction.component.html',
  styleUrls: ['./apiInteraction.component.scss']
})
export class ApiInteraction {

  protected data: any;


  constructor(private Api: ApiService, private endpoint: string, protected body: string = "") {
    this.Api.getTokenFromJasmin();
  }

  setbody(body: string){
    this.body=body;
    this.endpoint=body;
    this.Api.getTokenFromJasmin();
  }
  getRequest() {
    this.Api.get(this.endpoint).subscribe(
      (response: any) => this.data = response,
      (err: any) => {
       
        if (err.status === 401){
         this.Api.getTokenFromJasmin();
            }
         return -1;
      }
    );
   
    return 0;
  }


 postRequest() {
  this.Api.post(this.endpoint,this.body).subscribe(
    (response: any) => this.data = response[0],
    (err: any) => {
      if (err.status === 401){
       this.Api.getTokenFromJasmin();
          }
       
    }
  );
}

  protected getData(){
    return this.data;
  }

  protected resetData() {
    this.data = undefined;
  }
}