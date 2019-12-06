import { Component } from '@angular/core';
import xml2js from 'xml2js';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  

//Testing
import {Costumer, Product, Venda } from './model/client_model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  title = '360º Company Dashboard';
  public xmlItems: any;  
  constructor(private _http: HttpClient) { this.loadXML(); }  
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
        var invoices = obj.SourceDocuments[0].SalesInvoices[0].Invoice.length;  
        var costumers = obj.MasterFiles[0].Customer;    
        var costumers_array = new Array<Costumer>();

        costumers.forEach(element => {
          var temp = new Costumer;
          temp.id = element.CustomerID;
          temp.name = element.CompanyName;
          costumers_array.push(temp);
        });
        
        //Array<Invoices> = [];
        console.log(costumers_array);  
      });
    });  
  }  
}  