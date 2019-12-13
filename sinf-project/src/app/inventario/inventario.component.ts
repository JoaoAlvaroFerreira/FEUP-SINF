import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiInteraction } from 'src/app/api/apiInteractions.component'
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent extends ApiInteraction implements OnInit {

  //evolucao inventario (linear)
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public legendLine: boolean = false;
  public processingDone: boolean=false;


  constructor(api: ApiService) {
  super(api,'/materialscore/materialsitems');
  }
  ngOnInit() {
    this.getRequest();
  }
  ngDoCheck(){
    if(this.data != null && !this.processingDone){
      this.processData();
      this.processingDone=true;
    } 
    
  }
  processData(){
    this.data.forEach(element => {
      console.log(element);
    });
        
  }
}
