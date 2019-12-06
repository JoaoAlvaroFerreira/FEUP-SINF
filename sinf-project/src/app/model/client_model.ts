export class Venda {
    products: Array<Product> = [];
    quantity: number;
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
    price: number;
    category: string;
}

