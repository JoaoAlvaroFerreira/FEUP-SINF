import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiInteraction } from 'src/app/api/apiInteractions.component'
import { ApiService } from '../api/api.service';
import { Customer,Sale,Purchase, Supplier } from './../model/client_model'; // necessario?

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent extends ApiInteraction implements OnInit {

  private valorTotalCompras=0;
  public processingDone: boolean=false;
  private purchases: Array<Purchase>=[];
  private suppliers: Array<Supplier> =[];
  private supplierDistribution: Array<Supplier>=[];

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


  constructor(api: ApiService) {
    super(api,'/purchases/orders');
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
      var purchase= new Purchase();
      purchase.supplier_name= element.sellerSupplierPartyName;
      purchase.amount= element.payableAmount.amount;
      purchase.area = element.loadingCityName;
      purchase.date= element.loadingDateTime;
      this.purchases.push(purchase);
      this.calcTotal();
      
    });
    

  }
  calcTotal(){
      this.purchases.forEach(element=>{
        this.valorTotalCompras += element.amount;
      })
  }

}
