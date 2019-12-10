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
  public processingDone: boolean = false;
  // Grafico Linear - Tendência de Vendas
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ];
  public lineChartLabels: Label[] = [];
  public legendLine: boolean = false;


  // Grafico Barras - Vendas por Região
  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ]; 
  public barChartLabels: Label[] = ['Região A', 'Região B', 'Região C', 'Região D'];
  public legendBar: boolean = false;

  // Grafico Pie - Vendas por Categoria - NOT IMPLEMENTED
  public pieChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ]; 
  public pieChartLabels: Label[] = ['Região A', 'Região B', 'Região C', 'Região D'];
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

      this.calcTotal();
      this.categorySales();
      this.salesPerRegion();
      this.salesTendency();
      this.rentableClients();
      this.salesDistribution();
        
      
  }
  salesDistribution() {
   
  }

  rentableClients() {

    var customerExist = false;
    this.sales.forEach(element=>{
      this.customers.forEach(elementCustomer=>{
        if(element.client_name == elementCustomer.name)
       { customerExist = true;
        elementCustomer.total_spent += element.amount;
        }
      })
     
      if(!customerExist){
        var c = new Customer();
        c.name = element.client_name;
        c.total_spent = element.amount;
        this.customers.push(c);
      }
  

    })
  }
    
  salesTendency() {
    var i;
   
    this.sales.forEach(element=>{
      if(this.pieChartLabels.includes(element.category))
      {
        i = this.pieChartLabels.indexOf(element.category);
        this.pieChartData[0][i]+=element.amount;
      }
      else{
        this.pieChartLabels.push(element.category);
        this.pieChartData[0].data.push(element.amount);
      }
  

    })
  }
  salesPerRegion() {
   
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
        this.pieChartData[0][i]+=element.amount;
      }
      else{
        this.pieChartLabels.push(element.category);
        this.pieChartData[0].data.push(element.amount);
      }
  

    })
  }
}
