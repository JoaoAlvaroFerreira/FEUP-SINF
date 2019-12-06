export class Venda {
    products: Product;
    quantity: number;
    unitprice: number;
}

export class Invoice {
    vendas: Array<Venda> = [];
    region: string;
    year: number;
    month: number;
    day: number; 
    costumer: Costumer;
}

export class Costumer {
    name: string;
    id: string;
}

export class Product {
    name: string;
    category: string;
    productCode: string;
}

