import { Component } from '@angular/core';
import xml2js from 'xml2js';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  

//Testing
import {Customer, Product, Venda, Invoice } from './model/client_model';
import {Account, Customer2, Address, Supplier, Tax, Ledger, CreditLine, DebitLine, Journal, Transaction} from './model/financial_model';
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
        var customers_array = new Array<Customer2>();
        var supplier_array = new Array<Supplier>();
        var taxes_array = new Array<Tax>();
        var ledger = new Ledger();

        var obj = result.AuditFile;  
        var accountsxml = obj.MasterFiles[0].GeneralLedgerAccounts[0].Account;

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
        var customersxml = obj.MasterFiles[0].Customer;
        customersxml.forEach(element => {
            let tempcustomer = new Customer2();
            tempcustomer.customerID = element.CustomerID[0];
            tempcustomer.accountID = element.AccountID[0];
            tempcustomer.customerTaxID = element.CustomerTaxID[0];
            tempcustomer.companyName = element.CompanyName[0];
          
          let tempbillingaddress = new Address();
            tempbillingaddress.addressDetail = element.BillingAddress[0].AddressDetail[0];
            tempbillingaddress.city = element.BillingAddress[0].City[0];
            tempbillingaddress.postalCode = element.BillingAddress[0].PostalCode[0];
            tempbillingaddress.region = element.BillingAddress[0].Region[0];
            tempbillingaddress.country = element.BillingAddress[0].Country[0];
          tempcustomer.billingAddress = tempbillingaddress;

          let tempshipaddress = new Address();
            tempshipaddress.addressDetail = element.BillingAddress[0].AddressDetail[0];
            tempshipaddress.city = element.BillingAddress[0].City[0];
            tempshipaddress.postalCode = element.BillingAddress[0].PostalCode[0];
            tempshipaddress.region = element.BillingAddress[0].Region[0];
            tempshipaddress.country = element.BillingAddress[0].Country[0];
          tempcustomer.shipToAddress = tempshipaddress;
          tempcustomer.selfBillingIndicator = element.SelfBillingIndicator[0];
          customers_array.push(tempcustomer);
        });
        console.log(customers_array);

        //PARSE SUPPLIERS
        var suppliersxml= obj.MasterFiles[0].Supplier;
        console.log(suppliersxml);
        suppliersxml.forEach(element => {
          let suppliertemp = new Supplier();
            suppliertemp.supplierID = element.SupplierID[0];
            suppliertemp.accountID = element.AccountID[0];
            suppliertemp.supplierTaxID = element.SupplierTaxID[0];
            suppliertemp.companyName = element.CompanyName[0];

            let tempbillingaddress = new Address();

            tempbillingaddress.addressDetail = element.BillingAddress[0].AddressDetail[0];
            tempbillingaddress.city = element.BillingAddress[0].City[0];
            tempbillingaddress.postalCode = element.BillingAddress[0].PostalCode[0];
            tempbillingaddress.region = element.BillingAddress[0].Region[0];
            tempbillingaddress.country = element.BillingAddress[0].Country[0];
            suppliertemp.billingAddress = tempbillingaddress;

            let tempshipaddress = new Address();
            tempshipaddress.addressDetail = element.BillingAddress[0].AddressDetail[0];
            tempshipaddress.city = element.BillingAddress[0].City[0];
            tempshipaddress.postalCode = element.BillingAddress[0].PostalCode[0];
            tempshipaddress.region = element.BillingAddress[0].Region[0];
            tempshipaddress.country = element.BillingAddress[0].Country[0];
            suppliertemp.shipToAddress = tempshipaddress;

            suppliertemp.selfBillingIndicator = element.SelfBillingIndicator[0];
            
            supplier_array.push(suppliertemp);
        });
        console.log(supplier_array);

        //Parse TAXES
        
        var taxesxml= obj.MasterFiles[0].TaxTable[0].TaxTableEntry;

        taxesxml.forEach(element => {
          let temptax = new Tax();
          temptax.taxType = element.TaxType[0];
          temptax.taxCountryRegion = element.TaxCountryRegion[0];
          temptax.taxCode = element.TaxCode[0];
          temptax.description = element.Description[0];
          temptax.taxPercentage = element.TaxPercentage[0];
          taxes_array.push(temptax);
        });
        console.log(taxes_array);
        
        //PARSE GeneralLedgerEntries
        let ledgerxml = obj.GeneralLedgerEntries[0];
        ledger.numberOfEntries = ledgerxml.NumberOfEntries[0];
        ledger.totalDebit = ledgerxml.TotalDebit[0];
        ledger.totalCredit = ledgerxml.TotalCredit[0];
        
        let journalxml = obj.GeneralLedgerEntries[0].Journal;
        
        var journals_array = new Array<Journal>();
        //EACH JOURNAL      
        journalxml.forEach(element => {
          let journaltemp = new Journal();
            journaltemp.journalID = element.JournalID[0];
            journaltemp.description = element.Description[0];

            //PARSE TRANSACTIONS
            let transactionxml = element.Transaction;
            var transaction_arraytemp = new Array<Transaction>();

            transactionxml.forEach(element => {
                let transaction_temp = new Transaction();
                transaction_temp.transactionID = element.TransactionID[0];
                transaction_temp.period = element.Period[0];
                transaction_temp.transactionDate = element.TransactionDate[0];
                transaction_temp.sourceID = element.SourceID[0];
                transaction_temp.description = element.Description[0];
                transaction_temp.docArchivalNumber = element.DocArchivalNumber[0];
                transaction_temp.transactionType = element.TransactionType[0];
                transaction_temp.gLPostingDate = element.GLPostingDate[0];

                //PARSE DEBIT/CREDIT LINES
              
                var debitlines_array = new Array<DebitLine>();
                var creditlines_array = new Array<CreditLine>();
              
                //DEBIT LINE
                let transaction_debitlinesxml = element.Lines[0].DebitLine;
                    transaction_debitlinesxml.forEach(element => {
                        let debitLinetemp = new DebitLine();
                        debitLinetemp.recordID = element.RecordID[0];
                        debitLinetemp.accountID = element.AccountID[0];
                        //debitLinetemp.sourceDocumentID = element.SourceDocumentID[0];
                        debitLinetemp.systemEntryDate = element.SystemEntryDate[0];
                        debitLinetemp.description = element.Description[0];
                        debitLinetemp.debitAmount = element.DebitAmount[0];
                        debitlines_array.push(debitLinetemp);
                    });
                transaction_temp.debitLines = debitlines_array;

                //CREDIT LINE
                let transaction_creditlinesxml = element.Lines[0].CreditLine;

                transaction_creditlinesxml.forEach(element => {
                        let creditLinetemp = new CreditLine();
                        creditLinetemp.recordID = element.RecordID[0];
                        creditLinetemp.accountID = element.AccountID[0];
                        //creditLinetemp.sourceDocumentID = element.SourceDocumentID[0];
                        creditLinetemp.systemEntryDate = element.SystemEntryDate[0];
                        creditLinetemp.description = element.Description[0];
                        creditLinetemp.creditAmount = element.CreditAmount[0];
                        creditlines_array.push(creditLinetemp);
                  });
                transaction_temp.creditLines = creditlines_array;
                transaction_arraytemp.push(transaction_temp);
            });
                //ADD TO OTHER TRANSACTIONS
                journaltemp.transactions = transaction_arraytemp;
                journals_array.push(journaltemp);
        });
          ledger.journals = journals_array;
          console.log(ledger);
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