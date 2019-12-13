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
  private allSales: Array<Sale> = [];
  private customers: Array<Customer> = [];
  private totalSaleValue: number = 0;
  private customerDistribution: Array<Customer> = [];

  private selectedYear;
  private selectedMonth;

  
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
    this.selectedYear = "2019";
    this.selectedMonth = "12";
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

  onChange(){
    console.log("a");
    if(this.data != null && this.processingDone){
      console.log("b");
      this.clearCache();
      this.dateFiltering();
      
      this.rentableClients();
      this.calcTotal();
      this.categorySales();
      this.salesPerRegion();
      this.salesTendency();
      this.salesDistribution();
    }
  }
  clearCache(){
    this.totalSaleValue = 0;
    this.lineChartData = [
      { data: [], label: 'Series A' }
    ];
    this.lineChartLabels = [];
  
  
    // Grafico Barras - Vendas por Região
    this.barChartData = [
      { data: [], label: 'Series A' }
    ]; 
    this.barChartLabels = [];
  
    // Grafico Pie - Vendas por Categoria - NOT IMPLEMENTED
    this.pieChartData = []; 
    this.pieChartLabels = [];
  }

  dateFiltering(){
    var aux: Array<Sale> = new Array<Sale>();
    console.log("Month: "+this.selectedMonth);
    for(var i = 0; i < this.allSales.length; i++){
      //2019-11-28T00:00:00
      var year = this.allSales[i].date.toString().substr(0, 4);
      var month = this.allSales[i].date.toString().substr(5,2);
      
      if((year == this.selectedYear || this.selectedYear == "all") && (month == this.selectedMonth || this.selectedMonth == "all")){
        aux.push(this.allSales[i]);
        console.log("in");
      }
      console.log(this.allSales[i].date);
    }

    this.sales = aux;
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
        this.allSales = this.sales;
        
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
    this.customers = [];
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
    
    this.customers.sort((a,b)=>{if(a.total_spent < b.total_spent) return 1; else return -1;});
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
