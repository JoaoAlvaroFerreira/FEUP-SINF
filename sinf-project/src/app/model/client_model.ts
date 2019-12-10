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
    customer: Customer;
}

export class Compra{
    product: Product;
    name: string;
    quantity: number;
    unitprice: number;

}
export class Customer {
    name: string;
    id: string;
    total_spent: number;
    purchases_made: number;
}

export class Supplier{
    name: string;
    id: string;
    total_gain: number;
    sells_made: number;
}

export class Product {
    name: string;
    category: string;
    productCode: string;
}

export class Sale{
    client_name: string;
    amount: number;
    area: string;
    category: string;
    date: number;
}

export class Purchase{
    supplier_name: string;
    amount: number;
    itens: Array <Compra>;
    date: number;
    area: string;
}

export class ProdutosComprados{
    product: Product;
    total: number;
    quantity: number;
}