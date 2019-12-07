import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service'

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})

export class GeneralComponent implements OnInit {
  
  
  constructor(private Api: ApiService) { 
   
  }

  ngOnInit() {
   
  }

  getSales(){
   this.Api.get("/sales/orders");
  }

}
