import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './api.service'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-apiInteraction',
  templateUrl: './apiInteraction.component.html',
  styleUrls: ['./apiInteraction.component.scss']
})
export class ApiInteraction {

  /**
   * Data that is being fetched from web api
   */
  protected data: any;

  /**
   * Component to be extended by graphical components
   */
  constructor(private Api: ApiService, private endpoint: string, protected body: string = "") {
  }

  /**
   * Fetch the data using configuration from the WebApi and save it in the Class's data property
   */
  fetchData() {
    this.getRequest().subscribe(
      (response: any) => this.data = response.body,
      (err: any) => {
        console.log(this.data);
        console.log("CODE: "+ err.status);
        if (err.status === 401){
          console.log("token issues");
          this.Api.getTokenFromJasmin().subscribe(
            () => this.getRequest().subscribe(
              (response: any) => this.data = response,
              
            )
          );
            }
         
      }
    );

  
  }

  /**
   * Retrieve the adequate request. Either a POST or a GET method.
   */
  private getRequest(): Observable<Object> {
    return this.Api.get(this.endpoint);
  }

  /**
   * Reset data to undefined value
   */
  protected resetData() {
    this.data = undefined;
  }
}