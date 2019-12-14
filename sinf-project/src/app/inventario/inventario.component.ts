import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiInteraction } from 'src/app/api/apiInteractions.component'
import { ApiService } from '../api/api.service';
import {StockItem, Customer,Sale,Purchase, Supplier ,Compra, Product, InvEvolution, ProdutosComprados,Category} from './../model/client_model'; 

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent extends ApiInteraction implements OnInit {

  //evolucao inventario (linear)
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'agost', 'set','out', 'nov', 'de'];
  public legendLine: boolean = false;
  public processingDone: boolean=false;
  public processingPurchases: boolean=false;
  public processingSells: boolean=false;

  private stockItems: Array<StockItem>=[];
  private lowStockItems: Array<StockItem>=[];
  private totalInventaryValue: number =0;
  private categories: Array<Category>=[];
  private inventarioEvolution: Array<InvEvolution>=[];
  private globalinventory=[0,0,0,0,0,0,0,0,0,0,0,0];
  private purchases: Array<Purchase>=[];
  private sales: Array<Sale>=[];
  
 // Grafico Pie - inventario por Categoria - 
 public pieChartData: number[] = []; 
 public pieChartLabels: Label[] = [];
 public legendPie: boolean = false;

  constructor(api: ApiService) {
  super(api,'/materialscore/materialsitems');
  }
  ngOnInit() {
    this.getRequest();
  }
  ngDoCheck(){
    if(this.data != null && !this.processingDone){
      this.processData();
      console.log("aqui");
      this.resetData();
      this.setbody('/purchases/orders');
      this.getRequest();
      
      this.processingDone=true;
      console.log(this.categories);
      console.log(this.stockItems);
    } 
    if(this.data!=null && !this.processingPurchases && this.processingDone){
      console.log(this.data);
      this.processPurch();
      this.resetData();
      this.setbody('/sales/orders');
      this.getRequest();
      this.processingPurchases=true;
    }
    if(this.data!=null && !this.processingSells && this.processingPurchases && this.processingDone){
      console.log(this.data);
      this.processSales();
      this.inventoryTendency();
      //this.povoarCategories();
     // this.putcategories();
      this.processingSells=true;
    }
    
  }
  processData(){
    this.data.forEach(item => {
      var stockItem = new StockItem();
      stockItem.name= item.itemKey;
      if(item.assortment == null){
        stockItem.category= "indiferenciado";
      }else{
        stockItem.category= item.assortment;
      }
      
      stockItem.brand=item.brand;
      item.materialsItemWarehouses.forEach(el => {
        stockItem.unitCost= el.calculatedUnitCost.amount;
        stockItem.totalCost= el.inventoryBalance.amount;
        stockItem.totalUnits=el.stockBalance;
      });
    
      stockItem.minStock=item.minStock;
      stockItem.maxStock= item.maxStock;
      this.stockItems.push(stockItem);
      var inv= new InvEvolution();
      inv.item=stockItem;
      this.inventarioEvolution.push(inv);
    });
    console.log(this.stockItems);
    console.log(this.inventarioEvolution);
    this.stockItems.sort((a,b)=>{if(a.name<b.name)return 1; else return -1;});
    this.calcTotalValue();
    this.putLowStock();
    this.povoarCategories();
    this.putcategories();
  }
  processPurch(){
    console.log(this.data);
    this.data.forEach(element => {
      var purchase= new Purchase();
      //console.log(element);
      purchase.supplier_name= element.sellerSupplierPartyName;
      purchase.amount= element.payableAmount.amount;
      purchase.region = element.loadingCityName;
      var date=element.documentDate; //"2019-12-10T00:00:00"
      purchase.date=date;
      var date_array = date.split('-');
      purchase.year = date_array[0];
      purchase.month = date_array[1];
      var day= date_array[2].split('T');
      purchase.day = day[0];
      purchase.itens= new Array<Compra>();
      var product = new Product();
      element.documentLines.forEach(elementItem=>{
        
        var compra= new Compra();
        compra.product= new Product();
        product.name=elementItem.purchasesItem;
        compra.product.name=elementItem.purchasesItem;
        compra.name=elementItem.purchasesItem;
        //console.log(compra.name);
        compra.product.category="none";
        //compra.product=product;
        compra.quantity=elementItem.quantity;
        compra.unitprice=elementItem.unitPrice.amount;
        //console.log(compra);
        purchase.itens.push(compra);
      });
      this.purchases.push(purchase);
   
      
    });
    console.log(this.purchases);
   // this.allPurchases = this.purchases;
  }
  processSales(){
    this.data.forEach(element => {
      var sale = new Sale();
      sale.amount = element.payableAmount.amount;
      sale.client_name = element.buyerCustomerPartyName
      sale.category = element.documentTypeDescription;
      sale.area = element.loadingCityName;
      sale.date = element.documentDate;
      var product = new Product();
      element.documentLines.forEach(elementItem=>{
        
        var compra= new Compra();
        compra.product= new Product();
        
        compra.product.name=elementItem.salesItem;
        compra.name=elementItem.salesItem;
        //console.log(compra.name);
        compra.product.category="none";
        //compra.product=product;
        compra.quantity=elementItem.quantity;
        compra.unitprice=elementItem.unitPrice.amount;
        //console.log(compra);
        sale.itens.push(compra);
      });
      this.sales.push(sale);
      
      
    });
    console.log(this.sales);
    this.calcEvolution();
   // this.allSales = this.sales;
  }

  calcEvolution(){
    this.sales.forEach(element=>{
      var date=element.date; //"2019-12-10T00:00:00"
      var year = element.date.toString().substr(0, 4);
      var month = element.date.toString().substr(5,2);
      element.itens.forEach(item=>{
        this.inventarioEvolution.forEach(el=>{
          if(el.item.name== item.name){
            el.inventarioPorMes[+month-1]-= item.quantity;
          }
        });
      });
      
    });

    this.purchases.forEach(purchase=>{
      purchase.itens.forEach(item=>{
        this.inventarioEvolution.forEach(el=>{
          if(el.item.name== item.name){
            el.inventarioPorMes[purchase.month-1]+= item.quantity;
          }
        });
      });
    });
    
       this.inventarioEvolution.forEach(item=>{
         var i=0;
         item.inventarioPorMes.forEach(imes=>{
          this.globalinventory[i]+= imes;
          i++;
         });
         i=0;
       });

    
    console.log(this.inventarioEvolution);
    console.log(this.globalinventory);
  }
  calcTotalValue(){
    this.stockItems.forEach(element=>{
      this.totalInventaryValue += element.totalCost;
    })
  }

  putLowStock(){
    this.stockItems.forEach(item=>{
      if(item.totalUnits <= item.minStock){
        this.lowStockItems.push(item);
      }
    });
    this.lowStockItems.sort((a,b)=>{if((a.minStock-a.totalUnits)<(b.minStock-b.totalUnits))return 1; else return -1;});
    console.log(this.lowStockItems);
  }
  povoarCategories(){
    //console.log(this.produtosComprados);
    this.stockItems.forEach(ele=>{
        var exists=false;
         this.categories.forEach(el=>{
          if(ele.category== el.name){
            exists=true;
          }
    });
    if(!exists){
      var c= new Category();
      c.name=ele.category;
      c.quantity=0;
      c.total=0;
      this.categories.push(c);
    }
  });
  //console.log(this.categories);

  this.stockItems.forEach(ele=>{
      this.categories.forEach(cat=>{
        if(ele.category==cat.name){
          cat.quantity+= ele.totalUnits;
          cat.total+=ele.totalCost;
        }
      });
      
  });

}
inventoryTendency(){
  var i;
    console.log(this.globalinventory);
    //this.globalinventory.sort((a,b)=>{if(a.>b.date) return 1; else return -1;});
    this.globalinventory.forEach(element=>{
      if(this.lineChartLabels.includes(element.toString()))
      {
        i = this.lineChartLabels.indexOf(element.toString());
        this.lineChartData[0][i]+=element;
      }
      else{
        //this.lineChartLabels.push(element.toString());
        this.lineChartData[0].data.push(element);
      }
  

    })
}
putcategories(){

   this.categories.sort((a,b)=>{if(a.quantity<b.quantity)return 1; else return -1;});
  
   var i;
  
   this.categories.forEach(element=>{
     if(this.pieChartLabels.includes(element.name))
     {
       i = this.pieChartLabels.indexOf(element.name);
       this.pieChartData[i]+=element.quantity;
     }
     else{
       this.pieChartLabels.push(element.name);
       this.pieChartData.push(element.quantity);
     }
 

   })
}
    
}
