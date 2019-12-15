import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiInteraction } from 'src/app/api/apiInteractions.component'
import { ApiService } from '../api/api.service';
import { Customer,Sale,Purchase, Supplier ,Compra, Product, ProdutosComprados,Category} from './../model/client_model'; // necessario?
import { VendasComponent } from '../vendas/vendas.component';
import { element } from 'protractor';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent extends ApiInteraction implements OnInit {

  private valorTotalCompras=0;
  public processingDone: boolean=false;
  public processingItens: boolean=false;
  private purchases: Array<Purchase>=[]; 
  private anualPurchases: Array<Purchase>=[];
  private allPurchases: Array<Purchase> = [];
  private suppliers: Array<Supplier> =[];
  private categories: Array<Category> =[];
  private produtosComprados: Array<ProdutosComprados> =[];
  private supplierDistribution: Array<Supplier>=[];
  private allSupplierDistribution: Array<Supplier>=[];
  private comprasPorMes: Array<number>=[0,0,0,0,0,0,0,0,0,0,0,0];

  
  private selectedYear;
  private selectedMonth;


//tendencia compras mensais (linear)
// Grafico Linear - Tendência de compras mensais
public lineChartData: ChartDataSets[] = [
  { data: [], label: 'Series A' }
];
public lineChartLabels: Label[] = [];
public legendLine: boolean = false;

  //comparacao de gastos (linear)
  public lineChartData2: ChartDataSets[] = [
    { data: [], label: 'Series A' }
  ];
  public lineChartLabels2: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'agost', 'set','out', 'nov', 'de'];
  public legendLine2: boolean = false;

 // Grafico Pie - Compras por Categoria - 
 public pieChartData: number[] = []; 
 public pieChartLabels: Label[] = [];
 public legendPie: boolean = false;

  constructor(api: ApiService) {
  super(api,'/purchases/orders');
  this.selectedYear = "all";
    this.selectedMonth = "all";
    
   }

  ngOnInit() {
   // this.setbody('/purchases/orders')
    this.getRequest();
  }
  ngDoCheck(){
    if(this.data != null && !this.processingDone){
      this.processData();
      this.resetData();
      this.setbody('/purchasesCore/purchasesItems')
      this.getRequest();
      this.processingDone=true;
      console.log(this.purchases);
      console.log(this.comprasPorMes);
    } 
    if(this.data!=null && !this.processingItens && this.processingDone){
      this.processItens();
      this.povoarCategories();
      this.putcategories();
      this.processingItens=true;
    }

    
  }

  onChange(){

    if(this.data != null && this.processingDone){
    
      this.clearCache();
      this.dateFiltering();
      this.produtosComprados.forEach(el=>{
        el.quantity=0;
        el.total=0;
      });
      this.categories.forEach(cat=>{
        cat.quantity=0;
        cat.total=0;
      });
      this.suppliers.forEach(sup=>{
        sup.sells_made=0;
        sup.total_gain=0;
      });
      this.putInCategory();
      this.povoarCompraMes();
      this.calcTotal();
      this.rentableSuppliers();
      this.povoarProdutos();
      this.purchasesTendency();
      this.annualPurchaseTendency();
      this.putcategories();
      console.log(this.allPurchases);
      console.log(this.purchases);
      console.log(this.categories);
      console.log(this.comprasPorMes);
      

    }
   
  }
  clearCache(){
    this.valorTotalCompras = 0;
    this.lineChartData = [
      { data: [], label: 'Series A' }
    ];
    this.lineChartLabels = [];
  
  
    // Grafico Barras - Vendas por Região
    this.lineChartData2 = [
      { data: [], label: 'Series A' }
    ]; 
    this.lineChartLabels2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'agost', 'Set','Out', 'Nov', 'Dec'];
  
    // Grafico Pie - Vendas por Categoria - NOT IMPLEMENTED
    this.pieChartData = []; 
    this.pieChartLabels = [];
  }

  dateFiltering(){
    var aux: Array<Purchase> = new Array<Purchase>();
    var auxAnual: Array<Purchase> = new Array<Purchase>();
    for(var i = 0; i < this.allPurchases.length; i++){
      //2019-11-28T00:00:00
      var year = this.allPurchases[i].date.toString().substr(0, 4);
      var month = this.allPurchases[i].date.toString().substr(5,2);
      
      if((year == this.selectedYear || this.selectedYear == "all") && (month == this.selectedMonth || this.selectedMonth == "all")){
        aux.push(this.allPurchases[i]);

      }
      if(year == this.selectedYear || this.selectedYear == "all"){
        auxAnual.push(this.allPurchases[i]);
      }
    }
    this.anualPurchases=auxAnual;
    this.purchases = aux;
  }

  purchasesTendency() {
    var i;
    
    this.purchases.sort((a,b)=>{if(a.date>b.date) return 1; else return -1;});

    this.purchases.forEach(element=>{
      if(this.lineChartLabels.includes(element.date.toString()))
      {
        i = this.lineChartLabels.indexOf(element.date.toString());
        this.lineChartData[0][i]+=element.amount;
      }
      else{
        this.lineChartLabels.push(element.day.toString());
        this.lineChartData[0].data.push(element.amount);
      }
  

    })
  }
  annualPurchaseTendency(){
    var i;
    
    this.anualPurchases.sort((a,b)=>{if(a.date>b.date) return 1; else return -1;});

    this.comprasPorMes.forEach(element=>{
      if(this.lineChartLabels2.includes(element.toString()))
      {
        i = this.lineChartLabels2.indexOf(element.toString());
        this.lineChartData2[0][i]+=element;
      }
      else{
        //this.lineChartLabels2.push(element.day.toString());
        this.lineChartData2[0].data.push(element);
      }
  

    })

  }
  processItens(){
    this.produtosComprados.forEach(element=>{
        this.data.forEach(el=>{
        if(element.product.name == el.itemKey){
          element.category=el.assortment;
          element.product.category=el.assortment;
        }
    });
    });
    
    
  }
  povoarCategories(){
    //console.log(this.produtosComprados);
    this.data.forEach(ele=>{
        var exists=false;
         this.categories.forEach(el=>{
          if(ele.assortment== el.name){
            exists=true;
          }
    });
    if(!exists){
      var c= new Category();
      c.name=ele.assortment;
      c.quantity=0;
      c.total=0;
      this.categories.push(c);
    }
  });
  //console.log(this.categories);

  this.putInCategory();
 
  

}
putInCategory(){
  this.purchases.forEach(element=>{
    element.itens.forEach(ele=>{
      
      this.categories.forEach(cat=>{
        if(ele.product.category==cat.name){
          cat.quantity+= ele.quantity;
          cat.total+=ele.unitprice*ele.quantity;
        }
      });
      
    });
  });
}
putcategories(){
   console.log(this.categories);
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
  processData(){
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
        this.comprasPorMes[purchase.month-1]+= compra.quantity*compra.unitprice;
        //console.log(compra);
        purchase.itens.push(compra);
    
      });
      this.purchases.push(purchase);
   // console.log(this.purchases);
      
    });
    this.allPurchases = this.purchases;
    //console.log(this.purchases);
    this.calcTotal();
    this.rentableSuppliers();
    this.povoarProdutos();
    this.purchasesTendency();
    this.annualPurchaseTendency();
  }
  povoarCompraMes(){
    this.comprasPorMes.forEach(el=>{
      el=0;
    });
    this.anualPurchases.forEach(purch=>{
      purch.itens.forEach(iten=>{
        this.comprasPorMes[purch.month-1]+= iten.quantity*iten.unitprice;
       
      });
    });
  }

  povoarProdutos(){
    //console.log(this.purchases);
    this.purchases.forEach(element=>{
      var exist=false;
      //console.log(element.itens);

      element.itens.forEach(el=>{

        this.produtosComprados.forEach(ele=>{
          //console.log(el.product.name);
          //console.log(el)
           if (el.product.name== ele.product.name) {
            ele.total += el.unitprice*el.quantity;
            ele.quantity+=el.quantity;
            exist=true;
        }
        });
        var p= new ProdutosComprados();
        if (!exist) {
          p.product= new Product();
          p.product=el.product;
          p.quantity= el.quantity;
          p.total= el.quantity*el.unitprice;
          this.produtosComprados.push(p);
          //console.log(this.produtosComprados);
        }
        exist=false;


       

      });
      

    });
    console.log(this.produtosComprados);
    this.produtosComprados.sort((a,b)=>{if(a.quantity<b.quantity)return 1; else return -1;});
  }

  calcTotal(){
      this.purchases.forEach(element=>{
        this.valorTotalCompras += element.amount;
      })
  }

  rentableSuppliers(){
    var supplierExist=false;
    this.purchases.forEach(element => {
      this.suppliers.forEach(elementSupplier=>{
        if(element.supplier_name == elementSupplier.name)
        { 
          supplierExist = true;
          elementSupplier.total_gain += element.amount;
          elementSupplier.sells_made++;
         }
      })

      if(!supplierExist){
        var s= new Supplier();
        s.name= element.supplier_name;
        s.sells_made=1;
        s.total_gain= element.amount;
        this.suppliers.push(s);
      }
      supplierExist=false;

    });
    this.suppliers.sort((a,b)=>{if(a.total_gain<b.total_gain)return 1; else return -1;});

  }

}
