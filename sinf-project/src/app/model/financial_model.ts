
export class Account{
    accountID: number;
    accountDescription: string;
    openingDebitBalance: number;
    openingCreditBalance: number;
    closingDebitBalance: number;
    closingCreditBalance: number;
    groupingCategory: string;
    taxonomyCode: number;
}

export class Customer2{
    customerID: number;
    accountID: string;
    customerTaxID: number;
    companyName: string;
    billingAddress: Address;
    shipToAddress: Address
    selfBillingIndicator: number;
}  

export class Address{
    addressDetail: string;
    city: string;
    postalCode: string;
    region: string;
    country: string;
}

export class Supplier{
    supplierID: number;
    accountID: string;
    supplierTaxID: number;
    companyName: string;
    billingAddress: Address;
    shipToAddress: Address
    selfBillingIndicator: number;
}

export class Tax{
    taxType: string;
    taxCountryRegion: string;
    taxCode: string;
    description: string;
    taxPercentage: number;
}

export class Ledger{ //so existe 1
    numberOfEntries: number;
    totalDebit: number;
    totalCredit: number;
    journals: Array<Journal> = [];
}

export class Journal{ 
    journalID: number;
    description: string;
    transactions: Array<Transaction> = [];
}

export class Transaction{ 
    transactionID: string;
    period: number;
    transactionDate: string;
    sourceID: string;
    description: string;
    docArchivalNumber: number;
    transactionType: string;
    gLPostingDate: string;
    debitLines: Array<DebitLine> = [];
    creditLines: Array<CreditLine> = [];
}

export class DebitLine{ 
    recordID: string;
    accountID: number;
    sourceDocumentID: string;
    systemEntryDate: string;
    description: string;
    debitAmount: number;
}

export class CreditLine{ 
    recordID: string;
    accountID: number;
    sourceDocumentID: string;
    systemEntryDate: string;
    description: string;
    creditAmount: number;
}

