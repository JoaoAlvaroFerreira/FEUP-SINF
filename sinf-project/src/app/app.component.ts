import { Component } from '@angular/core';
import xml2js from 'xml2js';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//Testing
import { Customer, Product, Venda, Invoice } from './model/client_model';
import { Account, Customer2, Address, Supplier, Tax, Ledger, CreditLine, DebitLine, Journal, Transaction } from './model/financial_model';
import { Demonstracao } from './model/demonstracao_model';
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

      var accounts_array = new Array<Account>();
      var customers_array = new Array<Customer2>();
      var supplier_array = new Array<Supplier>();
      var taxes_array = new Array<Tax>();
      var ledger = new Ledger();

      parser.parseString(data, function (err, result) {

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
          if (element.TaxonomyCode != null)
            temp.taxonomyCode = element.TaxonomyCode[0];
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
        var suppliersxml = obj.MasterFiles[0].Supplier;
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

        var taxesxml = obj.MasterFiles[0].TaxTable[0].TaxTableEntry;

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
      this.calculateFinancial_AKA_Allthework(accounts_array, customers_array, supplier_array, taxes_array, ledger);
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

  calculateFinancial_AKA_Allthework(accounts: Array<Account>, customers_array: Array<Customer2>, suppliers: Array<Supplier>, taxes_array: Array<Tax>,
    ledger: Ledger) {
    let portantos = new Map<number, number>();
    ledger.journals.forEach(journal => { //journals
      journal.transactions.forEach(transaction => { //transactions
        transaction.creditLines.forEach(creditLine => {
          var temp = creditLine.accountID;
          accounts.forEach(account => {//para todas as contas
            if (account.accountID == temp) {
              if (portantos.get(account.taxonomyCode) != null) {
                portantos.set(Number(account.taxonomyCode), Number(portantos.get(account.taxonomyCode)) + Number(creditLine.creditAmount));
              }
              else {
                portantos.set(Number(account.taxonomyCode), Number(creditLine.creditAmount));
              }
            }
          });
        });

        transaction.debitLines.forEach(debitLine => {
          var temp = debitLine.accountID;
          accounts.forEach(account => {//para todas as contas
            if (account.accountID == temp) {
              if (portantos.get(account.taxonomyCode) != null) {
                portantos.set(Number(account.taxonomyCode), Number(portantos.get(account.taxonomyCode)) - Number(debitLine.debitAmount));
              }
              else {
                portantos.set(Number(account.taxonomyCode), -Number(debitLine.debitAmount));
              }
            }
          });
        });

      });
    });
    console.log(portantos);
    this.doDemonstracao(portantos);
  }

  doDemonstracao(portantos: Map<number, number>) {
    console.log("ENTROU");
    let demonstracao = new Demonstracao();
    for (let index = 0; index < 648; index++) {
      if(portantos.get(index) == null){
        portantos.set(index, 0);
      }
    }
    console.log(portantos);

    //ATIVO CORRENTE
    demonstracao.ativos_ﬁxos_tangiveis =
      + Number(portantos.get(268))
      + Number(portantos.get(269))
      + Number(portantos.get(270))
      + Number(portantos.get(271))
      + Number(portantos.get(272))
      + Number(portantos.get(273))
      + Number(portantos.get(274))
      - Number(portantos.get(275))
      - Number(portantos.get(276))
      - Number(portantos.get(277))
      - Number(portantos.get(278))
      - Number(portantos.get(279))
      - Number(portantos.get(280))
      - Number(portantos.get(281))
      - Number(portantos.get(282))
      - Number(portantos.get(283))
      - Number(portantos.get(284))
      - Number(portantos.get(285))
      - Number(portantos.get(286))
      - Number(portantos.get(287))
      - Number(portantos.get(288))
      + Number(portantos.get(306))
      + Number(portantos.get(310))
      - Number(portantos.get(314))
      - Number(portantos.get(318));

      console.log(demonstracao.ativos_ﬁxos_tangiveis);


    demonstracao.propriedades_de_investimento =
      + Number(portantos.get(259))
      + Number(portantos.get(260))
      + Number(portantos.get(261))
      - Number(portantos.get(262))
      - Number(portantos.get(263))
      - Number(portantos.get(264))
      - Number(portantos.get(265))
      - Number(portantos.get(266))
      - Number(portantos.get(267))
      + Number(portantos.get(305))
      + Number(portantos.get(309))
      - Number(portantos.get(313))
      - Number(portantos.get(317));

    demonstracao.goodwill =
      + Number(portantos.get(217))
      + Number(portantos.get(222))
      + Number(portantos.get(227))
      - Number(portantos.get(236))
      - Number(portantos.get(237))
      - Number(portantos.get(238))
      - Number(portantos.get(240))
      - Number(portantos.get(245))
      - Number(portantos.get(250))
      + Number(portantos.get(289))
      - Number(portantos.get(294))
      - Number(portantos.get(299));


    demonstracao.ativos_intangiveis =
      + Number(portantos.get(290))
      + Number(portantos.get(291))
      + Number(portantos.get(292))
      + Number(portantos.get(293))
      - Number(portantos.get(295))
      - Number(portantos.get(296))
      - Number(portantos.get(297))
      - Number(portantos.get(298))
      - Number(portantos.get(300))
      - Number(portantos.get(301))
      - Number(portantos.get(302))
      - Number(portantos.get(303))
      + Number(portantos.get(307))
      + Number(portantos.get(311))
      - Number(portantos.get(315))
      - Number(portantos.get(319));

    demonstracao.ativos_biologicos =
      + Number(portantos.get(197))
      + Number(portantos.get(198))
      - Number(portantos.get(200))
      - Number(portantos.get(202))
      + Number(portantos.get(215));

    demonstracao.participações_ﬁnanceiras_metodo_da_equivalencia_patrimonial =
      + Number(portantos.get(216))
      + Number(portantos.get(221))
      + Number(portantos.get(226))
      - Number(portantos.get(239))
      - Number(portantos.get(244))
      - Number(portantos.get(249));

    demonstracao.outros_investimentos_ﬁnanceiros =
      + Number(portantos.get(218))
      + Number(portantos.get(219))
      + Number(portantos.get(220))
      + Number(portantos.get(223))
      + Number(portantos.get(224))
      + Number(portantos.get(225))
      + Number(portantos.get(228))
      + Number(portantos.get(229))
      + Number(portantos.get(230))
      + Number(portantos.get(231))
      + Number(portantos.get(232))
      + Number(portantos.get(233))
      + Number(portantos.get(234))
      + Number(portantos.get(235))
      - Number(portantos.get(241))
      - Number(portantos.get(242))
      - Number(portantos.get(243))
      - Number(portantos.get(246))
      - Number(portantos.get(247))
      - Number(portantos.get(248))
      - Number(portantos.get(251))
      - Number(portantos.get(252))
      - Number(portantos.get(253))
      - Number(portantos.get(254))
      - Number(portantos.get(255))
      - Number(portantos.get(257))
      - Number(portantos.get(258))
      + Number(portantos.get(304))
      + Number(portantos.get(308))
      - Number(portantos.get(312))
      - Number(portantos.get(316));


    demonstracao.creditos_a_receber =
      + Number(portantos.get(62))
      + Number(portantos.get(64))
      - Number(portantos.get(68))
      - Number(portantos.get(70))
      + Number(portantos.get(112))
      + Number(portantos.get(114))
      - Number(portantos.get(121))
      - Number(portantos.get(123))
      + Number(portantos.get(125))
      + Number(portantos.get(127))
      + Number(portantos.get(129))
      + Number(portantos.get(139))
      - Number(portantos.get(141))
      - Number(portantos.get(145));

    demonstracao.ativos_por_impostos_diferidos =
      + Number(portantos.get(133))
      - Number(portantos.get(143));

    //ATIVOS NAO CORRENTES
    demonstracao.inventarios =
      + Number(portantos.get(165))
      + Number(portantos.get(166))
      - Number(portantos.get(167))
      - Number(portantos.get(168))
      - Number(portantos.get(169))
      + Number(portantos.get(170))
      + Number(portantos.get(171))
      + Number(portantos.get(172))
      + Number(portantos.get(173))
      + Number(portantos.get(174))
      + Number(portantos.get(175))
      + Number(portantos.get(176))
      - Number(portantos.get(177))
      - Number(portantos.get(178))
      - Number(portantos.get(179))
      - Number(portantos.get(180))
      - Number(portantos.get(181))
      - Number(portantos.get(182))
      + Number(portantos.get(183))
      + Number(portantos.get(184))
      - Number(portantos.get(185))
      - Number(portantos.get(186))
      + Number(portantos.get(187))
      + Number(portantos.get(188))
      + Number(portantos.get(189))
      - Number(portantos.get(190))
      - Number(portantos.get(191))
      - Number(portantos.get(192))
      + Number(portantos.get(193))
      - Number(portantos.get(194))
      + Number(portantos.get(209))
      + Number(portantos.get(210))
      + Number(portantos.get(211))
      + Number(portantos.get(212))
      + Number(portantos.get(213));

    demonstracao.ativos_biologicos =
      + Number(portantos.get(195))
      + Number(portantos.get(196))
      - Number(portantos.get(199))
      - Number(portantos.get(201))
      + Number(portantos.get(214));

    demonstracao.clientes =
      + Number(portantos.get(10))
      + Number(portantos.get(11))
      + Number(portantos.get(12))
      + Number(portantos.get(13))
      + Number(portantos.get(14))
      + Number(portantos.get(15))
      + Number(portantos.get(16))
      + Number(portantos.get(17))
      + Number(portantos.get(18))
      + Number(portantos.get(19))
      + Number(portantos.get(20))
      + Number(portantos.get(21))
      + Number(portantos.get(22))
      - Number(portantos.get(24))
      - Number(portantos.get(25))
      - Number(portantos.get(26))
      - Number(portantos.get(27))
      - Number(portantos.get(28))
      - Number(portantos.get(29))
      - Number(portantos.get(30))
      - Number(portantos.get(31))
      - Number(portantos.get(32))
      - Number(portantos.get(33))
      - Number(portantos.get(34))
      - Number(portantos.get(35))
      - Number(portantos.get(36));
    
      demonstracao.estado_e_outros_entes_publicos =
      + Number(portantos.get(71))
      + Number(portantos.get(73))
      + Number(portantos.get(74))
      + Number(portantos.get(76))
      + Number(portantos.get(77))
      + Number(portantos.get(79))
      + Number(portantos.get(80))
      + Number(portantos.get(81))
      + Number(portantos.get(82))
      + Number(portantos.get(83))
      + Number(portantos.get(84))
      + Number(portantos.get(85));

    demonstracao.capital_subscrito_e_nao_realizado =
      + Number(portantos.get(106))
      + Number(portantos.get(107))
      - Number(portantos.get(115))
      - Number(portantos.get(116));

    demonstracao.outros_creditos_a_receber =
      + Number(portantos.get(37))
      + Number(portantos.get(38))
      + Number(portantos.get(39))
      + Number(portantos.get(40))
      + Number(portantos.get(41))
      + Number(portantos.get(42))
      + Number(portantos.get(43))
      + Number(portantos.get(44))
      + Number(portantos.get(45))
      + Number(portantos.get(46))
      + Number(portantos.get(47))
      + Number(portantos.get(48))
      + Number(portantos.get(49))
      + Number(portantos.get(50))
      + Number(portantos.get(51))
      - Number(portantos.get(52))
      + Number(portantos.get(55))
      + Number(portantos.get(56))
      + Number(portantos.get(61))
      + Number(portantos.get(63))
      - Number(portantos.get(65))
      - Number(portantos.get(66))
      - Number(portantos.get(67))
      - Number(portantos.get(69))
      + Number(portantos.get(108))
      + Number(portantos.get(109))
      + Number(portantos.get(110))
      + Number(portantos.get(111))
      + Number(portantos.get(113))
      - Number(portantos.get(117))
      - Number(portantos.get(118))
      - Number(portantos.get(119))
      - Number(portantos.get(120))
      - Number(portantos.get(122))
      + Number(portantos.get(124))
      + Number(portantos.get(126))
      + Number(portantos.get(128))
      + Number(portantos.get(130))
      + Number(portantos.get(138))
      - Number(portantos.get(140))
      - Number(portantos.get(142))
      - Number(portantos.get(144));
    
      demonstracao.diferimentos =
      + Number(portantos.get(146));
    
      demonstracao.ativos_financeiros_detidos_para_negociacao =
      + Number(portantos.get(4))
      + Number(portantos.get(6));
    
      demonstracao.outros_ativos_financeiros =
      + Number(portantos.get(8));
    
      demonstracao.ativos_nao_correntes_detidos_para_venda =
      + Number(portantos.get(320))
      + Number(portantos.get(321))
      + Number(portantos.get(322))
      + Number(portantos.get(323))
      + Number(portantos.get(324))
      - Number(portantos.get(326))
      - Number(portantos.get(327))
      - Number(portantos.get(328))
      - Number(portantos.get(330));
   
      demonstracao.caixa_e_depositos_bancarios =
      + Number(portantos.get(1))
      + Number(portantos.get(2))
      + Number(portantos.get(3));



    //PASSIVO NAO CORRENTE

    demonstracao.provisoes =
      + Number(portantos.get(148))
      + Number(portantos.get(149))
      + Number(portantos.get(150))
      + Number(portantos.get(151))
      + Number(portantos.get(152))
      + Number(portantos.get(153))
      + Number(portantos.get(154))
      + Number(portantos.get(155));

    demonstracao.financiamentos_obtidos =
      + Number(portantos.get(87))
      + Number(portantos.get(89))
      + Number(portantos.get(91))
      + Number(portantos.get(93))
      + Number(portantos.get(95))
      + Number(portantos.get(99))
      + Number(portantos.get(101))
      + Number(portantos.get(103))
      + Number(portantos.get(105));

    demonstracao.responsabilidades_por_beneficios_pos_emprego =
      + Number(portantos.get(132));

    demonstracao.passivos_por_impostos_diferidos =
      + Number(portantos.get(134));

    demonstracao.outras_dividas_a_pagar =
      + Number(portantos.get(58))
      + Number(portantos.get(60))
      + Number(portantos.get(64))
      + Number(portantos.get(114))
      + Number(portantos.get(125))
      + Number(portantos.get(127))
      + Number(portantos.get(136))
      + Number(portantos.get(139));


    //PASSIVO CORRENTE

    demonstracao.fornecedores =
      + Number(portantos.get(37))
      + Number(portantos.get(38))
      + Number(portantos.get(39))
      + Number(portantos.get(40))
      + Number(portantos.get(41))
      + Number(portantos.get(42))
      + Number(portantos.get(43))
      + Number(portantos.get(44))
      + Number(portantos.get(45))
      + Number(portantos.get(46))
      + Number(portantos.get(47))
      + Number(portantos.get(48))
      + Number(portantos.get(49))
      + Number(portantos.get(50));

    demonstracao.adiantamentos_de_clientes =
      + Number(portantos.get(10))
      + Number(portantos.get(11))
      + Number(portantos.get(12))
      + Number(portantos.get(13))
      + Number(portantos.get(14))
      + Number(portantos.get(15))
      + Number(portantos.get(16))
      + Number(portantos.get(17))
      + Number(portantos.get(18))
      + Number(portantos.get(19))
      + Number(portantos.get(21))
      + Number(portantos.get(21))
      + Number(portantos.get(22))
      + Number(portantos.get(23))
      + Number(portantos.get(137));


    demonstracao.estado_e_outros_entes_publicos_passivo_corrente =
      + Number(portantos.get(71))
      + Number(portantos.get(72))
      + Number(portantos.get(75))
      + Number(portantos.get(76))
      + Number(portantos.get(77))
      + Number(portantos.get(78))
      + Number(portantos.get(81))
      + Number(portantos.get(82))
      + Number(portantos.get(83))
      + Number(portantos.get(84))
      + Number(portantos.get(85));

    demonstracao.financiamentos_obtidos_passivo_corrente =
      + Number(portantos.get(2))
      + Number(portantos.get(3))
      + Number(portantos.get(86))
      + Number(portantos.get(88))
      + Number(portantos.get(90))
      + Number(portantos.get(92))
      + Number(portantos.get(94))
      + Number(portantos.get(96))
      + Number(portantos.get(98))
      + Number(portantos.get(100))
      + Number(portantos.get(102))
      + Number(portantos.get(104));

    demonstracao.outras_dividas_a_pagar_passivo_corrente =
      + Number(portantos.get(53))
      + Number(portantos.get(54))
      + Number(portantos.get(57))
      + Number(portantos.get(59))
      + Number(portantos.get(61))
      + Number(portantos.get(63))
      + Number(portantos.get(109))
      + Number(portantos.get(110))
      + Number(portantos.get(113))
      + Number(portantos.get(124))
      + Number(portantos.get(126))
      + Number(portantos.get(131))
      + Number(portantos.get(135))
      + Number(portantos.get(138));

    demonstracao.diferimentos_passivo_corrente =
      + Number(portantos.get(147));


    demonstracao.passivos_financeiros_detidos_para_negociacao =
      + Number(portantos.get(5))
      + Number(portantos.get(7));

    demonstracao.outros_passivos_financeiros =
      + Number(portantos.get(9));

    demonstracao.passivos_nao_correntes_detidos_para_venda =
      + Number(portantos.get(325));

      var ativoNaoCorrente = 
      Number(demonstracao.ativos_ﬁxos_tangiveis) +
      Number(demonstracao.propriedades_de_investimento);
      Number(demonstracao.goodwill);
      /*Number(demonstracao.ativos_intangiveis) +
      Number(demonstracao.ativos_biologicos);
      Number(demonstracao.participações_ﬁnanceiras_metodo_da_equivalencia_patrimonial) +
      //demonstracao.outros_investimentos_ﬁnanceiros +
      Number(demonstracao.creditos_a_receber) +
      Number(demonstracao.ativos_por_impostos_diferidos) +
      Number(demonstracao.investimentos_ﬁnanceiros) +
      Number(demonstracao.creditos_e_outros_ativos_nao_correntes);*/

      var ativo = Number(ativoNaoCorrente) + Number(ativoNaoCorrente);

      console.log(ativoNaoCorrente);

  }

}  