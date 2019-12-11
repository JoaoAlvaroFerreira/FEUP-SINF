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
  private suppliers: Array<Supplier> =[];
  private categories: Array<Category> =[];
  private produtosComprados: Array<ProdutosComprados> =[];
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
    } 
    if(this.data!=null && !this.processingItens && this.processingDone){
      this.processItens();
      this.povoarCategories();
      this.processingItens=true;
    }
      
    /*this.processingDone=false;
    this.setbody('/purchasesCore/purchasesItems')
    this.getRequest();
    if(this.data != null && !this.processingDone){
     // this.processData();
     this.processItens();
     //console.log(this.data);
      this.processingDone=true;
    }*/

    
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
    console.log(this.produtosComprados);
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
  console.log(this.categories);

  this.purchases.forEach(element=>{
    element.itens.forEach(ele=>{
      var category= ele.product.category;
      
    });
  });

  }
  processData(){
    this.data.forEach(element => {
      var purchase= new Purchase();
      purchase.supplier_name= element.sellerSupplierPartyName;
      purchase.amount= element.payableAmount.amount;
      purchase.area = element.loadingCityName;
      purchase.date= element.loadingDateTime;
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
    //console.log(this.purchases);
    this.calcTotal();
    this.rentableSuppliers();
    this.povoarProdutos();
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
