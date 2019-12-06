import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

//tendencia compras mensais (linear)
public lineChartData: ChartDataSets[] = [
  { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
];
public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
public legendLine: boolean = false;

  //comparacao de gastos (linear)
  public lineChartData2: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ];
  public lineChartLabels2: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public legendLine2: boolean = false;


  constructor() { }

  ngOnInit() {
  }

}
