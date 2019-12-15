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

export class Purchase{
    supplier_name: string;
    supplier: Supplier;
    amount: number;
    itens: Array <Compra>=[];
    date:  number;
    year: number;
    month:number;
    day: number;
    region: string;
}
export class Sale{
    client_name: string;
    amount: number;
    area: string;
    itens: Array <Compra>=[];
    category: string;
    date: number;
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

export class StockItem{
    name: string;// itemKey
    category:string; //assortment
    brand:string; //brand
    unitCost: number; // materialsItemWarehouses.foreach( el. calculatedUnitCost.amount)
    totalCost: number; // inventoryBalance.amount
    totalUnits: number; //stockBalance
    minStock: number; //out minStock
    maxStock: number; // maxStock
}
export class InvEvolution{
    item: StockItem;
    inventarioPorMes: Array<number>=[0,0,0,0,0,0,0,0,0,0,0,0];
}





export class ProdutosComprados{
    product: Product;
    category: string;
    total: number;
    quantity: number;
}


export class Category{
    name: string;
    quantity: number;
    total: number;
}