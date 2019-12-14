
export class Account{
    accountID: number;
    accountDescription: string;
    openingDebitBalance: number;
    openingCreditBalance: number;
    closingDebitBalance: number;
    closingCreditBalance: number;
    groupingCategory: string;
}


export class Customer2{
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
}