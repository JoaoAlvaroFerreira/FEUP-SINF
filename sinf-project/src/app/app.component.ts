import { Component } from '@angular/core';
import xml2js from 'xml2js';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  

//Testing
import {Customer, Product, Venda, Invoice } from './model/client_model';
import {Account, Customer2} from './model/financial_model';
import { find } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  title = '360º Company Dashboard';
  public xmlItems: any;  
  constructor(private _http: HttpClient) { 
    this.loadXML(); 
    this.loadXMLfinancial();
  }  
  loadXML() {  
    this._http.get('/assets/saft.xml',  
      {  
        headers: new HttpHeaders()  
          .set('Content-Type', 'text/xml')  
          .append('Access-Control-Allow-Methods', 'GET')  
          .append('Access-Control-Allow-Origin', '*')  
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),  
        responseType: 'text'  
      })  
      .subscribe((data) => {  
        this.parseXML(data)  
          .then((data) => {  
            this.xmlItems = data;  
          });  
      });  
  }  

  loadXMLfinancial() {  
    this._http.get('/assets/accountingsaft.xml',  
      {  
        headers: new HttpHeaders()  
          .set('Content-Type', 'text/xml')  
          .append('Access-Control-Allow-Methods', 'GET')  
          .append('Access-Control-Allow-Origin', '*')  
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),  
        responseType: 'text'  
      })  
      .subscribe((data) => {  
        this.parseXML2(data)  
          .then((data) => {  
            this.xmlItems = data;  
          });  
      });  
  }  
  parseXML2(data) {  
    return new Promise(resolve => {  
      var k: string | number,  
        arr = [],  
        parser = new xml2js.Parser(  
          {  
            trim: true,  
            explicitArray: true  
          });  
      parser.parseString(data, function (err, result) {  

        var accounts_array = new Array<Account>();

        var obj = result.AuditFile;  
        var accountsxml = obj.MasterFiles[0].GeneralLedgerAccounts[0].Account;
        console.log(accountsxml);
        //PARSE ACCOUNTS

        accountsxml.forEach(element => {
          let temp = new Account();
          temp.accountID = element.AccountID;
          temp.accountDescription = element.AccountDescription[0];
          temp.openingDebitBalance = element.OpeningDebitBalance[0];
          temp.openingCreditBalance = element.OpeningCreditBalance[0];
          temp.closingDebitBalance = element.ClosingDebitBalance[0];
          temp.closingCreditBalance = element.ClosingCreditBalance[0];
          temp.groupingCategory = element.GroupingCategory[0];
          accounts_array.push(temp);
        });
        console.log(accounts_array);

        //Parse Customers
        var customersxml = obj.MasterFiles[0].Custumer;

        /*
        export class Customer{
          customerID: number;
          accountID: string;
          customerTaxID: number;
          companyName: string;
          ClosingDebitBalance: number;
          billingAddress: Address;
          shipToAddress: Address
          telephone: number;
          selfBillingIndicator: number;
      }
      export class Address{
          addressDetail: string;
          city: string;
          postalCode: string;
          region: string;
          country: string;
      }*/

      })
    });
  }

  parseXML(data) {  
    return new Promise(resolve => {  
      var k: string | number,  
        arr = [],  
        parser = new xml2js.Parser(  
          {  
            trim: true,  
            explicitArray: true  
          });  
          /* COmpany info
      parser.parseString(data, function (err, result) {  
        var obj = result.AuditFile;  
        var header = obj.Header[0];        
          arr.push({  
            id: header.CompanyID,  
            name: header.CompanyName,  
            taxRegistrationNumber: header.TaxRegistrationNumber,  
            taxAccountingBasis: header.TaxAccountingBasis 
          });  
          console.log(arr);
        resolve(arr);  
      });*/  
      parser.parseString(data, function (err, result) {  
        var obj = result.AuditFile;  
        var invoices = obj.SourceDocuments[0].SalesInvoices[0].Invoice;
        let products_xml = obj.MasterFiles[0].Product; 
        var customers = obj.MasterFiles[0].Customer;    
        var customers_array = new Array<Customer>();
        var invoices_array = new Array<Invoice>();
        var products_array = new Array<Product>();

        products_xml.forEach(element => {
          let temp_product = new Product();
          temp_product.name = element.ProductDescription[0];
          temp_product.category = element.ProductGroup[0];
          temp_product.productCode = element.ProductCode[0];
          products_array.push(temp_product);
        });

        customers.forEach(element => {
          var temp = new Customer;
          temp.id = element.CustomerID[0];
          temp.name = element.CompanyName[0];
          customers_array.push(temp);
        });

        invoices.forEach(elemento => {
          let invoice = new Invoice;
          let date = elemento.InvoiceDate[0];
          var date_array = date.split('-');
          invoice.year = date_array[0];
          invoice.month = date_array[1];
          invoice.day = date_array[2];
          
          const found = customers_array.find(element => element.id == elemento.CustomerID[0]);

          invoice.customer = found;
          
          invoice.region = elemento.ShipTo[0].Address[0].Region[0];
          let productsxml = elemento.Line;
          let venda_array = Array<Venda>();

          productsxml.forEach(element => {
            let found_product = products_array.find(element2 => element2.productCode == element.ProductCode);
            let temp_venda = new Venda();
            temp_venda.products = found_product;
            temp_venda.quantity = element.Quantity[0];
            temp_venda.unitprice = element.UnitPrice[0];
            venda_array.push(temp_venda);
          });

          invoice.vendas = venda_array;
          invoices_array.push(invoice);
        });
        //Array<Invoices> = [];
        console.log(invoices_array);  
      });
    });  
  }  
}  