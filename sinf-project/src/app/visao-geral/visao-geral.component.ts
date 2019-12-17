import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ApiInteraction } from 'src/app/api/apiInteractions.component'
import { ApiService } from '../api/api.service';
import { Customer,Sale,Purchase, Supplier ,Compra,StockItem, InvEvolution,Product, ProdutosComprados,Category} from './../model/client_model'; // necessario?
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-visao-geral',
  templateUrl: './visao-geral.component.html',
  styleUrls: ['./visao-geral.component.css']
})
export class VisaoGeralComponent extends ApiInteraction implements OnInit {

    private processingSales: boolean=false;
    private processingPurchases: boolean=false;
    private processingInventory: boolean=false;
    
    //tendencia de vendas (linear) igual ao painel de vendas
    public lineChartData: ChartDataSets[] = [
      { data: [], label: 'Series A' }
    ];
    public lineChartLabels: Label[] = [];
    public legendLine: boolean = false;
    private sales: Array<Sale>=[];
    private purchases: Array<Purchase>=[];
    private stockItems: Array<StockItem>=[];
    private totalSaleValue: number=0;
    private valorTotalCompras: number=0;
    private totalInventaryValue: number=0;
    
    private produtosComprados: Array<ProdutosComprados> =[];
    private produtosCompradosDist: Array<ProdutosComprados> = [];
    private username;
    private password;
    
  
  constructor(api: ApiService) { 
    super(api,'/sales/orders');
  }
  ngOnInit() {
    this.getRequest();
    this.username = environment.username;
    this.password = environment.password;
  }
  ngDoCheck(){
    if(this.data != null && !this.processingSales){
      this.processSales();
      this.povoarProdutos();
      this.calcTotal();
      this.salesTendency();
      this.resetData();
      this.setbody('/purchases/orders')
      this.getRequest();
      this.processingSales=true;
    } 
    if(this.data != null && this.processingSales && !this.processingPurchases){
        this.processPurchases();
        this.processItens();
        this.calcTotalPurchases();
        this.resetData();
        this.setbody('/materialscore/materialsitems')
        this.getRequest();
        this.processingPurchases=true;

    }
    if(this.data != null && this.processingSales && this.processingPurchases && !this.processingInventory){
      this.processInventory();
      this.calcTotalInventory();
    
      this.salesDistribution();
      //this.resetData();
     // this.setbody('/purchases/orders')
      //this.getRequest();
      this.processingInventory=true;

  }
   

  }
  calcTotalInventory(){
    this.stockItems.forEach(element=>{
      this.totalInventaryValue += element.totalCost;
    })
  }

  processSales(){
    

      this.data.forEach(element => {
        console.log(element);
        var sale = new Sale();
        sale.amount = element.payableAmount.amount;
        sale.client_name = element.buyerCustomerPartyName
        sale.category = element.documentTypeDescription;
        sale.area = element.loadingCityName;
        sale.date = element.documentDate;
        var product = new Product();
        element.documentLines.forEach(item=>{
          var compra = new Compra();
          compra.product= new Product();
          compra.product.category="none";
          compra.product.name=item.salesItem;
          compra.quantity=item.quantity;
          compra.unitprice= item.unitPrice.amount;
          sale.itens.push(compra);

        });
        this.sales.push(sale);
        
        
      });
       }

  povoarProdutos(){
    console.log("THIS SALES"+this.sales);
    this.sales.forEach(element=>{
      var exist=false;
      element.itens.forEach(el=>{

        this.produtosComprados.forEach(ele=>{
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
        }
        exist=false;
      });
      

    });

    this.produtosComprados.sort((a,b)=>{if(a.quantity<b.quantity)return 1; else return -1;});
    
    console.log("THIS PRODUTO COMPRADO"+this.produtosComprados[0].product.name);
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

  salesDistribution() {
    console.log("NOME DO GAJO"+this.produtosComprados[0].product.name);
    this.produtosCompradosDist = this.produtosComprados;
    this.produtosCompradosDist.sort((a,b)=>{if(a.quantity < b.quantity) return 1; else return 0;});
    console.log("NOME DO GAJO DOIS"+this.produtosCompradosDist[0].product.name);
  }

  processPurchases(){
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
       // this.comprasPorMes[purchase.month-1]+= compra.quantity*compra.unitprice;
        //console.log(compra);
        purchase.itens.push(compra);
    
      });
      this.purchases.push(purchase);
   // console.log(this.purchases);
      
    });
    //this.allPurchases = this.purchases;
  }

  processInventory(){
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
      //var inv= new InvEvolution();
      //inv.item=stockItem;
     // this.inventarioEvolution.push(inv);
    });
  }

  calcTotal(){
    
    this.sales.forEach(element=>{
      this.totalSaleValue += element.amount;
    })
   
  }

  calcTotalPurchases(){
    this.purchases.forEach(element=>{
      this.valorTotalCompras += element.amount;
    })

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

 
}
