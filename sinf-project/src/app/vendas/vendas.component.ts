import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiInteraction } from 'src/app/api/apiInteractions.component'
import { ApiService } from '../api/api.service';
import { Customer,Sale } from './../model/client_model';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent extends ApiInteraction implements OnInit {

  private sales: Array<Sale> = [];
  private customers: Array<Customer> = [];
  private totalSaleValue: number = 0;
  private customerDistribution: Array<Customer> = [];

  
  public processingDone: boolean = false;
  // Grafico Linear - Tendência de Vendas
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' }
  ];
  public lineChartLabels: Label[] = [];
  public legendLine: boolean = false;


  // Grafico Barras - Vendas por Região
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' }
  ]; 
  public barChartLabels: Label[] = [];
  public legendBar: boolean = false;

  // Grafico Pie - Vendas por Categoria - NOT IMPLEMENTED
  public pieChartData: number[] = []; 
  public pieChartLabels: Label[] = [];
  public legendPie: boolean = false;

  constructor(api: ApiService) {
    super(api, '/sales/orders');
   }

  ngOnInit() {
    
    this.getRequest();
    
  }

  ngDoCheck() {

    if(this.data != null && !this.processingDone){
      this.processData();
      this.processingDone = true;
    }
  }

  processData(){

      this.data.forEach(element => {
        var sale = new Sale();
        sale.amount = element.payableAmount.amount;
        sale.client_name = element.buyerCustomerPartyName
        sale.category = element.documentTypeDescription;
        sale.area = element.loadingCityName;
        sale.date = element.documentDate;
        this.sales.push(sale);
      });
      this.rentableClients();
      this.calcTotal();
      this.categorySales();
      this.salesPerRegion();
      this.salesTendency();
      this.salesDistribution();
        
      
  }
  salesDistribution() {
   
    if(this.customers != null){
      this.customerDistribution = this.customers;
      this.customerDistribution.sort((a,b)=>{if(a.purchases_made<b.purchases_made) return 1; else return -1;});
    }
  }

  rentableClients() {

    var customerExist = false;
    this.sales.forEach(element=>{
      this.customers.forEach(elementCustomer=>{
        
        if(element.client_name == elementCustomer.name)
       { customerExist = true;
        elementCustomer.total_spent += element.amount;
        elementCustomer.purchases_made++;
        }
      })
     
      if(!customerExist){
        var c = new Customer();
        c.name = element.client_name;
        c.total_spent = element.amount;
        c.purchases_made = 1;
        this.customers.push(c);
      }
  
      customerExist = false;
    })
    
    this.customers.sort((a,b)=>{if(a.total_spent<b.total_spent) return 1; else return -1;});
  }
    
  salesTendency() {
    var i;
    
    this.sales.sort((a,b)=>{if(a.date>b.date) return 1; else return -1;});
    this.sales.forEach(element=>{
      if(this.lineChartLabels.includes(element.date.toString()))
      {
        i = this.lineChartLabels.indexOf(element.date.toString());
        this.lineChartData[0][i]+=element.amount;
      }
      else{
        this.lineChartLabels.push(element.date.toString());
        this.lineChartData[0].data.push(element.amount);
      }
  

    })
  }
  salesPerRegion() {
    var i;
    
    this.sales.forEach(element=>{
      if(this.barChartLabels.includes(element.area))
      {
        i = this.barChartLabels.indexOf(element.area);
        this.barChartData[0][i]+=element.amount;
      }
      else{
        this.barChartLabels.push(element.area);
        this.barChartData[0].data.push(element.amount);
      }
  

    })
  }

  calcTotal(){
    
    this.sales.forEach(element=>{
      this.totalSaleValue += element.amount;
    })
  }

  categorySales(){
    var i;
   
    this.sales.forEach(element=>{
      if(this.pieChartLabels.includes(element.category))
      {
        i = this.pieChartLabels.indexOf(element.category);
        this.pieChartData[i]+=element.amount;
      }
      else{
        this.pieChartLabels.push(element.category);
        this.pieChartData.push(element.amount);
      }
  

    })
  }
}
